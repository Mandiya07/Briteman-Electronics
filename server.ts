import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure absolute path resolution in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// In-Memory Database for state persistence during application lifecycle
// Pre-populated with beautiful mock data
const orders = [
  {
    id: "ORD-92841",
    customerName: "Sipho Dlamini",
    email: "siphod@gmail.com",
    phone: "+268 7654 3211",
    address: "Cooper Center, Plaza, Mbabane",
    items: [
      { productId: "p1", productName: "HP EliteBook 840 G8", price: 14999, quantity: 1 }
    ],
    total: 14999,
    paymentMethod: "Mobile Money (MTN MoMo)",
    status: "Approved",
    date: "2026-06-08"
  },
  {
    id: "ORD-92842",
    customerName: "Winile Gamedze",
    email: "winile@gamedzegroup.sz",
    phone: "+268 7822 9944",
    address: "Sidwashini Industrial, Mbabane",
    items: [
      { productId: "p5", productName: "Epson EcoTank L3250 WiFi Multi-function Printer", price: 4999, quantity: 2 },
      { productId: "p11", productName: "Seagate Expansion Port 2TB Hard Drive", price: 1350, quantity: 4 }
    ],
    total: 15398,
    paymentMethod: "Bank Transfer (EFT)",
    status: "Pending",
    date: "2026-06-09"
  }
];

const wholesaleRequests = [
  {
    id: "WQT-5512",
    companyName: "Mbabane High School",
    email: "info@mbabanehigh.edu.sz",
    phone: "+268 3402 1120",
    businessType: "School",
    message: "Seeking official quotation for bulk classrooms setup. Need durable laptops with full local warranty.",
    items: [
      { productName: "Dell Latitude 3420 Business Laptop", quantity: 15, notes: "Needs 8GB RAM minimum" },
      { productName: "Canon PIXMA G3411 3-in-1 Ink Tank Printer", quantity: 3, notes: "For computer lab desk" }
    ],
    uploadedFileList: "procurement-laptops-2026.xlsx",
    status: "Pending",
    quotedPrice: 157350,
    date: "2026-06-07"
  },
  {
    id: "WQT-5513",
    companyName: "Vuvulane Tech Solutions",
    email: "purchasing@vuvulane.sz",
    phone: "+268 7662 4455",
    businessType: "Corporate",
    message: "Frequent purchases. Seeking regular wholesale contract pricing on hard drives & accessories.",
    items: [
      { productName: "WD Elements SE 1TB Portable SSD", quantity: 20 },
      { productName: "Seagate Expansion Port 2TB Hard Drive", quantity: 15 }
    ],
    status: "Processing",
    quotedPrice: 57250,
    date: "2026-06-10"
  }
];

const wholesaleRegistrations = [
  {
    id: "WREG-101",
    companyName: "Mbabane High School",
    contactPerson: "Mr. Musa Shongwe",
    email: "info@mbabanehigh.edu.sz",
    phone: "+268 3402 1120",
    businessType: "School",
    approved: true,
    tier: "Gold"
  },
  {
    id: "WREG-102",
    companyName: "Vuvulane Tech Solutions",
    contactPerson: "Nokwanda Mabuza",
    email: "purchasing@vuvulane.sz",
    phone: "+268 7662 4455",
    businessType: "Corporate",
    approved: true,
    tier: "Silver"
  },
  {
    id: "WREG-103",
    companyName: "SD High-Tech Retailers",
    contactPerson: "Thandeka Ndlovu",
    email: "admin@sdtech.co.sz",
    phone: "+268 7800 1234",
    businessType: "Retailer",
    approved: false,
    tier: "Silver"
  }
];

// Product inventory cache to keep changes consistent on server
import { PRODUCTS } from './src/data/products.js';
let serverProducts = [...PRODUCTS];

// --- API routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date() });
});

// Products API
app.get('/api/products', (req, res) => {
  res.json(serverProducts);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: 'p_' + Math.random().toString(36).substr(2, 9),
    stock: Number(req.body.stock) || 5,
    price: Number(req.body.price) || 0,
    originalPrice: Number(req.body.originalPrice) || undefined,
    specs: req.body.specs || {}
  };
  serverProducts.push(newProduct);
  res.status(210).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = serverProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    serverProducts[index] = { ...serverProducts[index], ...req.body };
    res.json(serverProducts[index]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const lengthBefore = serverProducts.length;
  serverProducts = serverProducts.filter(p => p.id !== id);
  if (serverProducts.length < lengthBefore) {
    res.json({ success: true, id });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
    ...req.body,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };
  orders.push(newOrder);

  // Decrement stocks if available in server products
  newOrder.items.forEach((item: any) => {
    const product = serverProducts.find(p => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      if (product.stock === 0) product.availability = 'Out of Stock';
      else if (product.stock <= 3) product.availability = 'Low Stock';
    }
  });

  res.status(210).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Wholesale Requests API
app.get('/api/wholesale-quotes', (req, res) => {
  res.json(wholesaleRequests);
});

app.post('/api/wholesale-quotes', (req, res) => {
  const newQuote = {
    id: 'WQT-' + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    status: 'Pending',
    date: new Date().toISOString().split('T')[0]
  };
  wholesaleRequests.push(newQuote);
  res.status(210).json(newQuote);
});

app.put('/api/wholesale-quotes/:id/price', (req, res) => {
  const { id } = req.params;
  const { quotedPrice, status } = req.body;
  const request = wholesaleRequests.find(w => w.id === id);
  if (request) {
    if (quotedPrice !== undefined) request.quotedPrice = Number(quotedPrice);
    if (status !== undefined) request.status = status;
    res.json(request);
  } else {
    res.status(404).json({ error: 'Wholesale request not found' });
  }
});

// Wholesale Registrations API
app.get('/api/wholesale-registrations', (req, res) => {
  res.json(wholesaleRegistrations);
});

app.post('/api/wholesale-registrations', (req, res) => {
  const newReg = {
    id: 'WREG-' + Math.floor(100 + Math.random() * 900),
    ...req.body,
    approved: false,
    tier: 'Silver'
  };
  wholesaleRegistrations.push(newReg);
  res.status(210).json(newReg);
});

app.put('/api/wholesale-registrations/:id', (req, res) => {
  const { id } = req.params;
  const { approved, tier } = req.body;
  const reg = wholesaleRegistrations.find(r => r.id === id);
  if (reg) {
    if (approved !== undefined) reg.approved = approved;
    if (tier !== undefined) reg.tier = tier;
    res.json(reg);
  } else {
    res.status(404).json({ error: 'Registration not found' });
  }
});

// Dynamic Coupon / Discount Management System
const couponsList = [
  { code: 'BRITEMAN10', percent: 10, active: true, description: '15% VAT adjustment discount.' },
  { code: 'WELCOME5', percent: 5, active: true, description: '5% Welcome retail deduction.' },
  { code: 'MOMOFLASH', percent: 15, active: true, description: '15% Off flash mobile money special.' }
];

app.get('/api/coupons', (req, res) => {
  res.json(couponsList);
});

app.post('/api/coupons', (req, res) => {
  const { code, percent, description } = req.body;
  if (!code || isNaN(Number(percent))) {
    return res.status(400).json({ error: 'Code and percent are required' });
  }
  const cleanCode = code.trim().toUpperCase();
  const exists = couponsList.find(c => c.code === cleanCode);
  if (exists) {
    return res.status(400).json({ error: 'Coupon code already exists' });
  }
  const newCoupon = {
    code: cleanCode,
    percent: Math.min(100, Math.max(1, Number(percent))),
    active: true,
    description: description || `${percent}% off discount`
  };
  couponsList.push(newCoupon);
  res.status(210).json(newCoupon);
});

app.put('/api/coupons/:code/toggle', (req, res) => {
  const { code } = req.params;
  const couponMatch = couponsList.find(c => c.code === code.toUpperCase());
  if (couponMatch) {
    couponMatch.active = !couponMatch.active;
    res.json(couponMatch);
  } else {
    res.status(404).json({ error: 'Coupon not found' });
  }
});

app.delete('/api/coupons/:code', (req, res) => {
  const { code } = req.params;
  const index = couponsList.findIndex(c => c.code === code.toUpperCase());
  if (index !== -1) {
    const deleted = couponsList.splice(index, 1);
    res.json(deleted[0]);
  } else {
    res.status(404).json({ error: 'Coupon not found' });
  }
});

// AI Product Recommendation Engine (Gemini API Server-Side Integration)
app.post('/api/gemini/recommend', async (req, res) => {
  const { prompt, category, budget, useCase, conditionPreference } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_KEY")) {
      // Fallback recommendation engine in case API key is not configured yet
      const recommendationsList = serverProducts.filter(p => {
        let match = true;
        if (category && category !== 'All') {
          match = p.category.toLowerCase().includes(category.toLowerCase()) || 
                  category.toLowerCase().includes(p.category.toLowerCase());
        }
        if (budget && match) {
          const maxBudget = Number(budget);
          if (!isNaN(maxBudget)) {
            match = p.price <= maxBudget;
          }
        }
        return match;
      });

      const fallbackText = `### Hello! I am the Briteman AI Sales Consultant.
      
**(Note: Server is currently running on localized diagnostic intelligence as the live Gemini API is being configured.)**

Based on your inquiry, here are top custom recommendations from Briteman Electronics matching Eswatini local stock:

${recommendationsList.length > 0 ? recommendationsList.map(p => `
* **${p.name}** (${p.brand}) — **E${p.price.toLocaleString()}**
  * *Condition:* ${p.condition} | *Warranty:* ${p.warranty}
  * *Feature Highlights:* ${Object.entries(p.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(', ')}
  * [Ask about this via WhatsApp](https://wa.me/26876623733?text=Inquired%20about%20${encodeURIComponent(p.name)})
`).join('\n') : `
We have superb options matching computer requirements! Let us know if you need high-performance laptops (EliteBooks / Latitude), high-efficiency Epson printers, or APC battery backups.
`}

#### Need more help?
For immediate wholesale quotes and pricing reviews, please click the **Registration Form** or speak directly to our Mbabane sales hotline at **+268 7662 3733**.`;

      return res.json({ text: fallbackText });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Stringify current inventory to ground the AI response in actual products
    const stockSnapshot = serverProducts.map(p => ({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      condition: p.condition,
      warranty: p.warranty,
      specs: p.specs,
      availability: p.availability,
      sku: p.sku
    }));

    const systemInstruction = `You are a friendly, expert AI sales consultant for "Briteman Services" (branded "Briteman Electronics"), 
the leading computer retail, wholesale, and corporate technology provider in Mbabane, Eswatini.
Your location is: LM Building Unit 10, Somhlolo Road, Mbabane.
Hotlines: +268 3450 1703 or +268 7662 3733. Email: ajapresd@gmail.com.

You speak to students, educators, corporate IT buyers, and home office managers.
Always align suggestions WITH the actual products currently in our Mbabane inventory listed below:
${JSON.stringify(stockSnapshot, null, 2)}

Refer to prices in Eswatini Lilangeni (prefixed with 'E' or 'SZL', e.g. E14,999). 
Provide direct links dynamically in markdown syntax if possible, e.g. for any recommended product, note its SKU and highlight they can add it directly to their shopping cart or inquire via WhatsApp (+268 7662 3733).

Guidelines:
- Keep the tone highly professional, helpful, tech-savvy, and direct.
- Select products that strictly align with user's requests. If they seek printers, suggest Epson EcoTank L3250 or Canon PIXMA.
- Offer custom advice like student packages, office IT setup, printer savings, or Load-Shedding solutions with APC UPS systems.
- Emphasize benefits: 100% genuine items, in-store pickup, physical support in Somhlolo Road, MBABANE.`;

    const userPrompt = `Customer Preference Questionnaire Answers:
- General Prompt/Question: "${prompt || 'I am looking for laptop options and accessories'}"
- Product Type / Category Preference: "${category || 'Any'}"
- Maximum Lilangeni Budget limit: "${budget ? 'E' + budget : 'Unlimited'}"
- Core Target Use Case: "${useCase || 'General Business / School'}"
- Condition Preference: "${conditionPreference || 'Any (New or Certified Refurbished)'}"

Please analyze these traits and provide a formatted response including:
1. Elegant greeting and friendly analysis of their needs.
2. A list of 2 or 3 best matching products from our stock with their pricing, warranties, and crucial specs.
3. Tips on why these electronics fit their business/learning use case.
4. Direct, humble call to actions inviting them to checkout using the Cart, apply for Wholesale registration, or click our floating WhatsApp bubble to talk directly to our MBABANE store team (Somhlolo Road).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const aiText = response.text || "I was unable to compile advice. Please review our product catalog or contact our staff directly!";
    res.json({ text: aiText });

  } catch (error: any) {
    console.error("Gemini AI API Error:", error);
    res.status(500).json({ error: "Failed to query AI assistant. Please contact Briteman Services sales directly.", details: error.message });
  }
});


// --- Vite Middleware or Static Asset Serving ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      // Direct API path exclusions
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Briteman Services Fullstack Server] is running on http://0.0.0.0:${PORT}`);
    console.log(`- Local Mbabane Time initialized`);
  });
}

startServer();
