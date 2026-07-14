import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipboardList, CheckCircle2, TrendingUp, Boxes, Briefcase, Plus, Percent, Trash2, Tag, Image as ImageIcon, Upload, Sparkles, RefreshCw, Award, Building, MapPin, Phone, Mail, Pencil } from 'lucide-react';
import { Product, Order, WholesaleQuoteRequest, WholesaleProfile, Coupon } from '../types';
import { saveCloudLogo, removeCloudLogo } from '../lib/firebase';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  quotes: WholesaleQuoteRequest[];
  registrations: WholesaleProfile[];
  onUpdateStock: (id: string, qty: number) => void;
  onAddProduct?: (p: Product) => void;
  onEditProduct?: (p: Product) => void;
  onDeleteProduct?: (id: string) => void;
  onApproveQuote: (id: string, customPrice: number) => void;
  onApproveRegistration: (id: string) => void;
  coupons: Coupon[];
  onCreateCoupon: (c: { code: string; percent: number; description: string }) => void;
  onToggleCoupon: (code: string) => void;
  onDeleteCoupon: (code: string) => void;
  onLogout?: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  quotes,
  registrations,
  onUpdateStock,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onApproveQuote,
  onApproveRegistration,
  coupons = [],
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  onLogout
}: AdminDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'branding' | 'brands' | 'company' | 'orders' | 'wholesale' | 'discounts' | 'services' | 'blogs'>('overview');
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);
  const [editCategory, setEditCategory] = useState('');
  const [editBrand, setEditBrand] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  
  // Custom price setter for wholesale quotes
  const [quotePrices, setQuotePrices] = useState<{ [key: string]: number }>({});
  
  // New coupon creation form states
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(10);
  const [newDesc, setNewDesc] = useState('');

  // Logo & Branding state
  const [customLogoUrl, setCustomLogoUrl] = useState(localStorage.getItem('briteman_custom_logo') || '');
  const [brandingMsg, setBrandingMsg] = useState('');

  // Services Management state
  const [servicesList, setServicesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('briteman_services');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [];
  });
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('');
  const [newServiceDetailStr, setNewServiceDetailStr] = useState('');
  const [serviceMsg, setServiceMsg] = useState('');

  const handleSaveServices = (updated: any[]) => {
    setServicesList(updated);
    localStorage.setItem('briteman_services', JSON.stringify(updated));
    window.dispatchEvent(new Event('services-updated'));
    setServiceMsg('Services successfully updated!');
    setTimeout(() => setServiceMsg(''), 4000);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle) return;
    const details = newServiceDetailStr ? newServiceDetailStr.split(',').map(s => s.trim()).filter(Boolean) : ['Professional SLA', 'Dedicated Support'];
    const newService = {
      id: 'srv-' + Date.now(),
      title: newServiceTitle,
      desc: newServiceDesc || 'Professional IT service offering.',
      image: newServiceImage,
      details
    };
    handleSaveServices([...servicesList, newService]);
    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServiceImage('');
    setNewServiceDetailStr('');
  };

  const handleDeleteService = (id: string) => {
    const updated = servicesList.filter(s => s.id !== id);
    handleSaveServices(updated);
  };

  // Blogs & Guides Management state
  const [blogsList, setBlogsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('briteman_blogs');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return [];
  });
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Student Technology Advice');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [blogMsg, setBlogMsg] = useState('');

  const handleSaveBlogs = (updated: any[]) => {
    setBlogsList(updated);
    localStorage.setItem('briteman_blogs', JSON.stringify(updated));
    window.dispatchEvent(new Event('blogs-updated'));
    setBlogMsg('Blogs & Guides successfully updated!');
    setTimeout(() => setBlogMsg(''), 4000);
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle) return;
    const newBlog = {
      id: 'blog-' + Date.now(),
      title: newBlogTitle,
      category: newBlogCategory,
      image: newBlogImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: newBlogReadTime || '5 min read',
      excerpt: newBlogContent.slice(0, 120) + '...',
      content: newBlogContent || 'Detailed buying guide and advice for Eswatini technology buyers.'
    };
    handleSaveBlogs([...blogsList, newBlog]);
    setNewBlogTitle('');
    setNewBlogContent('');
    setNewBlogImage('');
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogsList.filter(b => b.id !== id);
    handleSaveBlogs(updated);
  };

  // Generic file uploader helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Licensed Brands state
  const [licensedBrands, setLicensedBrands] = useState<{ name: string; desc: string; logo?: string }[]>(() => {
    const saved = localStorage.getItem('briteman_licensed_brands');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [brandMsg, setBrandMsg] = useState('');

  // Company Info & Contact state
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('briteman_company_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      phone1: '+268 3450 1703',
      phone2: '+268 7662 3733',
      email: 'ajapresd@gmail.com',
      addressLine1: 'LM Building Unit 10, Somhlolo Road',
      addressLine2: 'Next to Lilunga House, SRIC Route, H100',
      city: 'Mbabane, Eswatini',
      hours: 'Mon - Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 2:00 PM'
    };
  });
  const [companyMsg, setCompanyMsg] = useState('');

  const handleSaveBrands = (updated: { name: string; desc: string; logo?: string }[]) => {
    setLicensedBrands(updated);
    localStorage.setItem('briteman_licensed_brands', JSON.stringify(updated));
    window.dispatchEvent(new Event('brands-updated'));
    setBrandMsg('Licensed brands & logos successfully updated across the app!');
    setTimeout(() => setBrandMsg(''), 4000);
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) return;
    const updated = [...licensedBrands, { name: newBrandName, desc: newBrandDesc || 'Authorized Brand', logo: newBrandLogo }];
    handleSaveBrands(updated);
    setNewBrandName('');
    setNewBrandDesc('');
    setNewBrandLogo('');
  };

  const handleDeleteBrand = (name: string) => {
    const updated = licensedBrands.filter(b => b.name !== name);
    handleSaveBrands(updated);
  };

  const handleBrandLogoUpload = (brandName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updated = licensedBrands.map(b => b.name === brandName ? { ...b, logo: result } : b);
        handleSaveBrands(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCompanyInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('briteman_company_info', JSON.stringify(companyInfo));
    window.dispatchEvent(new Event('company-info-updated'));
    setCompanyMsg('Company contact & location information successfully updated!');
    setTimeout(() => setCompanyMsg(''), 4000);
  };

  // New product creation form states
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('BRT-' + Math.floor(100 + Math.random() * 900));
  const [prodPrice, setProdPrice] = useState(3500);
  const [prodCategory, setProdCategory] = useState('Laptops');
  const [prodBrand, setProdBrand] = useState('HP');
  const [prodStock, setProdStock] = useState(12);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800');
  const [prodDesc, setProdDesc] = useState('Enterprise specification machine with robust warranty support in Manzini.');

  // Analytics projection mock data
  const data = [
    { day: 'Mon', sales: 42000, pickups: 12 },
    { day: 'Tue', sales: 65000, pickups: 18 },
    { day: 'Wed', sales: 38000, pickups: 9 },
    { day: 'Thu', sales: 78000, pickups: 24 },
    { day: 'Fri', sales: 110000, pickups: 31 },
    { day: 'Sat', sales: 52000, pickups: 14 },
  ];

  const handlePriceChange = (quoteId: string, value: number) => {
    setQuotePrices({
      ...quotePrices,
      [quoteId]: value
    });
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setCustomLogoUrl(result);
        await saveCloudLogo(result);
        window.dispatchEvent(new Event('logo-updated'));
        setBrandingMsg('Logo successfully uploaded and synced to cloud across all app headers and footers!');
        setTimeout(() => setBrandingMsg(''), 5000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogoUrl = async () => {
    setCustomLogoUrl(customLogoUrl);
    await saveCloudLogo(customLogoUrl);
    window.dispatchEvent(new Event('logo-updated'));
    setBrandingMsg('Logo updated and synced to cloud successfully!');
    setTimeout(() => setBrandingMsg(''), 4000);
  };

  const handleResetLogo = async () => {
    await removeCloudLogo();
    setCustomLogoUrl('');
    window.dispatchEvent(new Event('logo-updated'));
    setBrandingMsg('Logo reset to default professional vector design.');
    setTimeout(() => setBrandingMsg(''), 4000);
  };

  // Metrics calculators
  const lifetimeSales = (orders || []).reduce((acc, curr) => acc + (curr.total || 0), 0) + 148500;
  const outstandingRequestsCount = quotes.filter(q => q.status === 'Pending').length;
  const pendingRegsCount = registrations.filter(r => r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Title */}
      <div className="flex flex-wrap justify-between items-end gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="text-xs font-black text-red-500 uppercase tracking-widest block font-mono">🔑 SYSTEM ADMINISTRATIVE COMMAND</span>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 px-2.5 py-1 rounded-lg transition cursor-pointer border border-red-200 dark:border-red-900"
              >
                Sign Out (Admin)
              </button>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-0.5">
            Briteman Electronics Admin Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage inventory, upload custom logos/brands, audit orders, and configure discounts.</p>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border dark:border-slate-800">
          {[
            { id: 'overview', icon: <TrendingUp className="h-3.8 w-3.8" />, label: 'Overview' },
            { id: 'inventory', icon: <Boxes className="h-3.8 w-3.8" />, label: 'Inventory & Products' },
            { id: 'branding', icon: <ImageIcon className="h-3.8 w-3.8 text-blue-500" />, label: 'Logo & Branding' },
            { id: 'brands', icon: <Award className="h-3.8 w-3.8 text-amber-500" />, label: 'Licensed Brands' },
            { id: 'company', icon: <Building className="h-3.8 w-3.8 text-emerald-500" />, label: 'Company Info' },
            { id: 'services', icon: <Briefcase className="h-3.8 w-3.8 text-indigo-500" />, label: 'Services' },
            { id: 'blogs', icon: <ImageIcon className="h-3.8 w-3.8 text-purple-500" />, label: 'Blogs & Guides' },
            { id: 'orders', icon: <ClipboardList className="h-3.8 w-3.8" />, label: 'Orders' },
            { id: 'wholesale', icon: <Briefcase className="h-3.8 w-3.8" />, label: 'Wholesale Hub' },
            { id: 'discounts', icon: <Percent className="h-3.8 w-3.8 text-accent" />, label: 'Coupons' }
          ].map((t) => (
            <button
              id={`admin-tab-btn-${t.id}`}
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`text-xs px-3.5 py-1.8 rounded-xl font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white dark:bg-dark-card text-primary dark:text-accent shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STATS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Aggregate Turnover", val: `E${lifetimeSales.toLocaleString()}`, color: "text-emerald-500", desc: "Seed + Online checkouts" },
          { label: "Active Shop SKU Count", val: `${products.length} Products`, color: "text-primary", desc: "Certified brand lines" },
          { label: "RFQ Bid Applications", val: `${outstandingRequestsCount} Pending`, color: "text-amber-500", desc: "Requires manual pricing" },
          { label: "Wholesale Tiers", val: `${pendingRegsCount} Registrations`, color: "text-indigo-500", desc: "Awaiting SLA assignment" },
        ].map((c, i) => (
          <div key={i} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-left">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">{c.label}</span>
            <span className={`text-xl sm:text-2xl font-black block mt-1 font-mono ${c.color}`}>{c.val}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{c.desc}</span>
          </div>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-left space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase">Daily Revenue Projections</h3>
              <p className="text-[11px] text-slate-400">Weekly operational statistics compiled from corporate quote checks and pickup logs.</p>
            </div>

            <div className="h-64 sm:h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0057D9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0057D9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888888' }} />
                  <Tooltip formatter={(v: any) => `E${Number(v).toLocaleString()}`} />
                  <Area type="monotone" dataKey="sales" stroke="#0057D9" strokeWidth={2.5} fillOpacity={1} fill="url(#salesColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-left flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">System Diagnostics</span>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">API Core Database Server</p>
                    <p className="text-[11px] text-slate-450 font-mono">STATUS: 200 OK / IN-MEMORY</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-3 border-t dark:border-slate-850">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Gemini Recommendation Engine</p>
                    <p className="text-[11px] text-slate-450 font-mono">MODEL: gemini-2.5-flash / Active</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-3 border-t dark:border-slate-850">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Custom Logo & Asset Store</p>
                    <p className="text-[11px] text-slate-450 font-mono">LOCALSTORAGE: ACTIVE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-850 mt-6 text-xs text-slate-500 leading-normal space-y-2">
              <p>🔒 Admin changes and uploaded logos persist instantly across container sessions.</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider block text-[10px]">Authorized Super Admin:</span>
                <span className="font-mono text-primary font-bold text-xs">ajapresd@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. INVENTORY & PRODUCT UPLOAD TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-8">
          
          {/* Add New Product Form */}
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
            <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white flex items-center mb-2">
              <Plus className="h-5 w-5 text-primary mr-2" />
              <span>Upload / Add New Product SKU</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Add a new laptop, printer, phone, or load-shedding backup device to the live store catalog.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!prodName || !onAddProduct) return;
              const newProduct: Product = {
                id: 'prod-' + Date.now(),
                sku: prodSku,
                name: prodName,
                price: Number(prodPrice),
                category: prodCategory,
                brand: prodBrand,
                stock: Number(prodStock),
                availability: Number(prodStock) > 5 ? 'In Stock' : 'Low Stock',
                image: prodImage,
                images: [prodImage],
                condition: 'New',
                warranty: '1 Year Manufacturer Warranty',
                tags: [prodCategory, prodBrand],
                description: prodDesc,
                specs: { Processor: 'Intel Core i7 / High Performance', RAM: '16GB DDR4', Storage: '512GB NVMe SSD', Display: '14" FHD IPS' }
              };
              onAddProduct(newProduct);
              setProdName('');
              setProdSku('BRT-' + Math.floor(100 + Math.random() * 900));
              alert('New product successfully added to store catalog!');
            }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Product Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Dell Latitude 7420 i7"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">SKU Code:</label>
                <input
                  type="text"
                  value={prodSku}
                  onChange={(e) => setProdSku(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Price (E - Emalangeni):</label>
                <input
                  type="number"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Category:</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Printers">Printers & Scanners</option>
                  <option value="Solar">Power & Solar Backup</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Brand / Manufacturer:</label>
                <input
                  type="text"
                  value={prodBrand}
                  onChange={(e) => setProdBrand(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Initial Stock Units:</label>
                <input
                  type="number"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-bold"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Product Image (Upload File or URL):</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                  <label className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setProdImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer shadow-md flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Product SKU</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Inventory Table */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Product stock quantities & deletion ledger</span>
              <span className="text-xs text-slate-400 font-mono">{products.length} SKUs Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="p-4 text-left">SKU / Product</th>
                    <th className="p-4 text-center">Category</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Stock Units</th>
                    <th className="p-4 text-center">Stock Controls</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="p-4 flex items-center space-x-3">
                        <img src={p.image} alt={p.name} className="h-10 w-10 object-cover rounded-lg border shrink-0 bg-white" />
                        <div>
                          <span className="font-mono font-bold text-primary block">{p.sku}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium">{p.category}</td>
                      <td className="p-4 text-center font-mono font-semibold">E{p.price.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : p.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onUpdateStock(p.id, p.stock - 1)}
                            className="h-7 w-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border dark:border-slate-700 font-bold rounded flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs px-2">{p.stock}</span>
                          <button
                            onClick={() => onUpdateStock(p.id, p.stock + 1)}
                            className="h-7 w-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border dark:border-slate-700 font-bold rounded flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          {onEditProduct && (
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setEditName(p.name);
                                setEditSku(p.sku);
                                setEditPrice(p.price);
                                setEditStock(p.stock);
                                setEditCategory(p.category);
                                setEditBrand(p.brand);
                                setEditDesc(p.description);
                                setEditImage(p.image);
                              }}
                              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {onDeleteProduct && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT PRODUCT MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono text-indigo-500 font-bold uppercase">EDIT INVENTORY SKU</span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Modify Product: {editingProduct.sku}</h3>
                  </div>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (onEditProduct) {
                    onEditProduct({
                      ...editingProduct,
                      name: editName,
                      sku: editSku,
                      price: Number(editPrice),
                      stock: Number(editStock),
                      availability: Number(editStock) > 5 ? 'In Stock' : Number(editStock) > 0 ? 'Low Stock' : 'Out of Stock',
                      category: editCategory,
                      brand: editBrand,
                      description: editDesc,
                      image: editImage,
                      images: [editImage]
                    });
                  }
                  setEditingProduct(null);
                }} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Product Name:</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">SKU Code:</label>
                      <input
                        type="text"
                        value={editSku}
                        onChange={(e) => setEditSku(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Price (Eswatini Emalangeni E):</label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Stock Quantity:</label>
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Category:</label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Brand:</label>
                      <input
                        type="text"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Description:</label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl p-3 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Product Image (Upload File or URL):</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-xs"
                      />
                      <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow">
                        <Upload className="h-4 w-4" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setEditImage)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {editImage && (
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800">
                      <img src={editImage} alt="Preview" className="h-12 w-12 object-cover rounded-xl" />
                      <span className="text-xs font-mono text-slate-500">Image successfully loaded</span>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow"
                    >
                      Save Product Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. LOGO & BRANDING UPLOAD TAB */}
      {activeTab === 'branding' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-8 text-left">
          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest block font-mono">🎨 BRAND IDENTITY & LOGO UPLOAD</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
              Upload Custom Logo & Configure Store Branding
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Upload your company logo image file (PNG, JPG, or SVG) or provide an image URL. Once uploaded, it instantly replaces the default vector logo across all headers, navigation bars, and footer sections throughout the Briteman Electronics application.
            </p>
          </div>

          {brandingMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{brandingMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border dark:border-slate-800">
            {/* Live Preview */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Live Logo Preview in Header Bar:</span>
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center min-h-[120px]">
                {customLogoUrl ? (
                  <img src={customLogoUrl} alt="Custom Logo Preview" className="max-h-16 w-auto object-contain" />
                ) : (
                  <div className="text-center">
                    <span className="font-display font-black text-2xl tracking-tighter text-blue-700 block">BRITEMAN</span>
                    <span className="font-sans font-black text-xs tracking-[0.2em] text-red-600 uppercase">SERVICES (Default Vector)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Option A: Upload Image File from Computer
                </label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-accent p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-white dark:bg-slate-900 transition-all group">
                  <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary mb-2 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload logo file</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                </label>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Option B: Paste Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png"
                    value={customLogoUrl}
                    onChange={(e) => setCustomLogoUrl(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleSaveLogoUrl}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0"
                  >
                    Save URL
                  </button>
                </div>
              </div>

              {customLogoUrl && (
                <div className="pt-2">
                  <button
                    onClick={handleResetLogo}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Reset to default professional vector logo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b dark:border-slate-850">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Completed Client Orders</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Direct checkout operations listed in in-memory state.</p>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <p>No customer orders completed yet during current thread session.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-750 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-900 text-[10px] uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-4 text-left">Order Code/ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Delivery Location</th>
                    <th className="p-4 text-center">Items Billed</th>
                    <th className="p-4 text-right">Sum Invoice</th>
                    <th className="p-4 text-center">Payment System</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {orders.map((ord, idx) => (
                    <tr key={idx}>
                      <td className="p-4 font-mono font-bold text-accent">ID-{Math.floor(10000 + idx * 8)}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{ord.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{ord.phone}</p>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{ord.address}</td>
                      <td className="p-4 text-center font-bold">
                        {(ord.items || []).reduce((s, i) => s + (i.quantity || 0), 0)} units
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                        E{ord.total.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                          {ord.paymentMethod || 'Mobile Money'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 5. WHOLESALE HUB TAB */}
      {activeTab === 'wholesale' && (
        <div className="space-y-8 text-left">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b dark:border-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Wholesale RFQ Bidding quotes</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Approve corporate bulk lists and authorize specific bundle prices.</p>
            </div>

            {quotes.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <p>No procurement bidding tickets exist in current thread lists.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-150 dark:divide-slate-800">
                {quotes.map((q) => (
                  <div key={q.id} className="p-6 space-y-4">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 font-mono px-2 py-0.5 rounded font-bold">
                          APP_ID: {q.id}
                        </span>
                        <h4 className="font-bold text-slate-950 dark:text-white text-sm mt-1">{q.companyName} ({q.businessType})</h4>
                        <p className="text-[11px] text-slate-400">Contact: {q.email} | {q.phone}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {q.status === 'Approved' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>APPROVED: E{q.assignedPrice?.toLocaleString()}</span>
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-slate-400 font-semibold font-mono">E</span>
                              <input
                                type="number"
                                placeholder="Enter Price"
                                value={quotePrices[q.id] || ''}
                                onChange={(e) => handlePriceChange(q.id, Number(e.target.value))}
                                className="w-24 p-1.5 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs rounded-lg"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const finalPrice = quotePrices[q.id];
                                if (!finalPrice) {
                                  alert('Please enter a custom pricing sum to approve the ticket.');
                                  return;
                                }
                                onApproveQuote(q.id, finalPrice);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3.5 py-1.8 rounded-lg cursor-pointer"
                            >
                              Approve Bid
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2">Requested Hardware configuration</span>
                      
                      {q.items && q.items.length > 0 ? (
                        <div className="space-y-1.5 text-xs text-slate-650 dark:text-slate-350">
                          {q.items.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between max-w-md">
                              <span>• {item.productName || item.productId}:</span>
                              <span className="font-bold text-slate-900 dark:text-white font-mono">{item.quantity} units</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 italic">
                          📎 Procurement list uploaded in background: <b className="font-mono text-primary">{q.uploadedFileList || 'procurement-rfq.xlsx'}</b>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. DISCOUNTS & COUPONS TAB */}
      {activeTab === 'discounts' && (
        <div className="space-y-8 text-left">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white flex items-center mb-2">
              <Tag className="h-5 w-5 text-accent mr-2" />
              <span>Create Dynamic Coupon Discount</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Add custom coupon combinations to support promotional events in Eswatini or mobile money seasonal codes.</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if(!newCode) return;
              onCreateCoupon({ code: newCode, percent: newPercent, description: newDesc });
              setNewCode('');
              setNewDesc('');
            }} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">COUPON SEQUENCE CODE:</label>
                <input
                  type="text"
                  placeholder="e.g. MOMOSPECIAL"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold uppercase focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">PERCENT REDUCTION VALUE (1-99%):</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={newPercent}
                  onChange={(e) => setNewPercent(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">PUBLIC VISIBLE TITLE:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 15% Mobile Money Discount"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white rounded-xl px-5 py-2.5 font-black uppercase text-[11px] shrink-0 cursor-pointer shadow-md"
                  >
                    Add Code
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-[10px] uppercase font-black text-slate-400 block font-mono">⚡ LIVE COMMERCIAL DISCOUNTS</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Promotional System Rules</h4>
            </div>

            {coupons.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <p>No coupon discount rates currently declared in active listing arrays.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-slate-700 dark:text-slate-300 text-left">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Saving Value</th>
                      <th className="p-4">Short Description</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="p-4">
                          <span className="font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg uppercase">
                            {c.code}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{c.percent}% OFF</td>
                        <td className="p-4 text-slate-500">{c.description}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onToggleCoupon(c.code)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer ${
                              c.active
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {c.active ? '● Active' : '○ Suspended'}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onDeleteCoupon(c.code)}
                            className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BRAND & LOGOS TAB */}
      {activeTab === 'brands' && (
        <div className="space-y-8 text-left">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white flex items-center mb-2">
              <Award className="h-5 w-5 text-amber-500 mr-2" />
              <span>Add New Licensed Brand</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Add a new brand to the 'Licensed Brands We Distribute' homepage section and catalog filter.</p>
            
            <form onSubmit={handleAddBrand} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Brand Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft / Razer"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Description / Tagline:</label>
                <input
                  type="text"
                  placeholder="e.g. Surface & Peripherals"
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Logo Image URL (Optional):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... logo.png"
                    value={newBrandLogo}
                    onChange={(e) => setNewBrandLogo(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-5 py-2 font-black uppercase text-[11px] shrink-0 cursor-pointer shadow-md"
                  >
                    Add Brand
                  </button>
                </div>
              </div>
            </form>
          </div>

          {brandMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{brandMsg}</span>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block font-mono">⚡ AUTHORIZED DISTRIBUTION LIST</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Manage Licensed Brand Logos & Badges</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">{licensedBrands.length} Brands Listed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {licensedBrands.map((b) => (
                <div key={b.name} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-16 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <span className="font-black text-slate-800 dark:text-white text-xs">{b.name}</span>
                      )}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 dark:text-white text-sm">{b.name}</h5>
                      <p className="text-[11px] text-slate-400">{b.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <label className="p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 border dark:border-slate-800 rounded-xl cursor-pointer text-xs font-semibold flex items-center space-x-1 text-slate-600 dark:text-slate-300" title="Upload Brand Logo">
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      <input type="file" accept="image/*" onChange={(e) => handleBrandLogoUpload(b.name, e)} className="hidden" />
                    </label>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${b.name} from licensed distribution list?`)) {
                          handleDeleteBrand(b.name);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPANY INFO & CONTACT TAB */}
      {activeTab === 'company' && (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6 text-left max-w-4xl mx-auto">
          <div>
            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block font-mono">🏢 COMPANY DETAILS & LOCATION COMMAND</span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
              Edit Manzini Showroom & Contact Information
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Update phone numbers, physical address, support email, and operating hours. Changes apply instantly across the Contact Us page and footer headers.
            </p>
          </div>

          {companyMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>{companyMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveCompanyInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Primary Phone Line:</label>
              <input
                type="text"
                value={companyInfo.phone1}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone1: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-bold font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp / Hotline Number:</label>
              <input
                type="text"
                value={companyInfo.phone2}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone2: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-bold font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Support Email Address:</label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-bold font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">City & Country:</label>
              <input
                type="text"
                value={companyInfo.city}
                onChange={(e) => setCompanyInfo({ ...companyInfo, city: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Physical Address Line 1:</label>
              <input
                type="text"
                value={companyInfo.addressLine1}
                onChange={(e) => setCompanyInfo({ ...companyInfo, addressLine1: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Physical Address Line 2 (Landmarks):</label>
              <input
                type="text"
                value={companyInfo.addressLine2}
                onChange={(e) => setCompanyInfo({ ...companyInfo, addressLine2: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Operating Hours Schedule:</label>
              <input
                type="text"
                value={companyInfo.hours}
                onChange={(e) => setCompanyInfo({ ...companyInfo, hours: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end pt-4">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer shadow-md flex items-center space-x-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Company Details</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SERVICES MANAGEMENT TAB */}
      {activeTab === 'services' && (
        <div className="space-y-8 text-left max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-indigo-500 uppercase tracking-widest block font-mono">🛠️ PROFESSIONAL SERVICES COMMAND</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
                Add or Edit Enterprise & School IT Services
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure corporate support offerings, school technology supply packages, and printer solutions. Supports both image URLs and direct image file uploads from your computer.
              </p>
            </div>

            {serviceMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{serviceMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Service Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Server Room Cabling & Setup"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Service Parameter Checklist (comma-separated):</label>
                <input
                  type="text"
                  placeholder="e.g. Active Directory, Firewalls, SLA contracts"
                  value={newServiceDetailStr}
                  onChange={(e) => setNewServiceDetailStr(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Service Description:</label>
                <textarea
                  rows={3}
                  placeholder="Detailed explanation of the IT service..."
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl p-3 font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Service Icon / Image (Upload File or URL):</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="https://... or upload file"
                    value={newServiceImage}
                    onChange={(e) => setNewServiceImage(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-xs"
                  />
                  <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setNewServiceImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {newServiceImage && (
                <div className="md:col-span-2 flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800">
                  <img src={newServiceImage} alt="Preview" className="h-12 w-12 object-cover rounded-xl" />
                  <span className="text-xs font-mono text-slate-500">Image loaded successfully</span>
                </div>
              )}

              <div className="md:col-span-2 flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer shadow-md flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Service Offering</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">Active Services ({servicesList.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicesList.map((s) => (
                <div key={s.id} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-slate-900 dark:text-white text-base">{s.title}</h5>
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono border-t dark:border-slate-800 pt-2">
                    Parameters: {Array.isArray(s.details) ? s.details.join(', ') : 'Standard SLA'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOGS & GUIDES MANAGEMENT TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-8 text-left max-w-5xl mx-auto">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <span className="text-xs font-black text-purple-500 uppercase tracking-widest block font-mono">📚 GUIDES & BLOG ARTICLES COMMAND</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
                Publish Tech Guides & Buying Advice
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Create helpful articles for Eswatini university students and business owners. Supports both image URLs and direct image file uploads from your computer.
              </p>
            </div>

            {blogMsg && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>{blogMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddBlog} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Article Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Top 5 Laptop Maintenance Tips for Eswatini Winters"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Category:</label>
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3.5 py-2.5 font-semibold"
                >
                  <option value="Student Technology Advice">Student Technology Advice</option>
                  <option value="Computer Maintenance Tips">Computer Maintenance Tips</option>
                  <option value="Printer Guides">Printer Guides</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Cover Image (Upload File or URL):</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="https://... or upload file"
                    value={newBlogImage}
                    onChange={(e) => setNewBlogImage(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2 font-mono text-xs"
                  />
                  <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow">
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setNewBlogImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {newBlogImage && (
                <div className="md:col-span-2 flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border dark:border-slate-800">
                  <img src={newBlogImage} alt="Cover Preview" className="h-16 w-24 object-cover rounded-xl" />
                  <span className="text-xs font-mono text-slate-500">Cover image uploaded successfully</span>
                </div>
              )}

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Full Article Content (Markdown format supported):</label>
                <textarea
                  rows={6}
                  placeholder="### Introduction&#10;&#10;Write article details here..."
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl p-3 font-mono text-xs leading-relaxed"
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end pt-3">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider cursor-pointer shadow-md flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish Article / Guide</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">Published Guides & Blogs ({blogsList.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogsList.map((b) => (
                <div key={b.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-800 flex items-start space-x-4">
                  <img src={b.image} alt="" className="h-20 w-28 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded uppercase">{b.category}</span>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{b.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{b.excerpt || b.content}</p>
                    <span className="text-[10px] text-slate-400 font-mono block pt-1">{b.date} • {b.readTime || '5 min'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
