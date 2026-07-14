import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ShoppingCart, MessageSquare, ShieldCheck, HelpCircle, Truck, 
  Calculator, Check, RotateCcw, ZoomIn, Eye, Sparkles, Building2, 
  User2, Mail, Phone, FileText, Download, Printer, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  isInCart: boolean;
  allProducts?: Product[];
  onSelectProduct?: (p: Product) => void;
}

// Custom hook to handle window resizing for canvas or target stages
const getProductImages = (product: Product): string[] => {
  const fallbackImagesByCat: Record<string, string[]> = {
    'Laptops': [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80'
    ],
    'MacBooks': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80'
    ],
    'Printers': [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59edd6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    'UPS Systems': [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1558489811-667104b90be8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
    ],
    'Storage Drives': [
      'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80'
    ],
    'Accessories': [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541140111813-8222e9d90981?auto=format&fit=crop&w=600&q=80'
    ]
  };

  const defaults = fallbackImagesByCat[product.category] || [
    product.image,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80'
  ];

  const list = [...(product.images || [])];
  if (!list.includes(product.image)) {
    list.unshift(product.image);
  }

  defaults.forEach(img => {
    if (list.length < 4 && !list.includes(img)) {
      list.push(img);
    }
  });

  return list.slice(0, 4);
};

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isInCart,
  allProducts = [],
  onSelectProduct
}: ProductDetailModalProps) {
  const imagesList = getProductImages(product);
  const relatedProducts = (allProducts || [])
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  // View States
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'photos' | '360'>('photos');

  // Interactive Zoom feature states
  const [isZoomReady, setIsZoomReady] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // 360 Degrees Rotation States
  const [rotationAngle, setRotationAngle] = useState(180);
  const [isRotatingDrag, setIsRotatingDrag] = useState(false);
  const dragStartRef = useRef(0);
  const angleStartRef = useRef(180);

  // Delivery calculator variables
  const [selectedCity, setSelectedCity] = useState('Manzini (Pickup)');
  const [shippingFee, setShippingFee] = useState(0);

  // Bulk calculator states
  const [bulkQty, setBulkQty] = useState(10);

  // Advanced Bulk Quote overlay states
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [formCompany, setFormCompany] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [requireOSInstall, setRequireOSInstall] = useState(false);
  const [requireBags, setRequireBags] = useState(false);
  const [requireExtendedWarranty, setRequireExtendedWarranty] = useState(false);
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false);
  const [generatedQuoteDetails, setGeneratedQuoteDetails] = useState<any | null>(null);

  const ESWATINI_CITIES = [
    { name: 'Manzini (Pickup)', fee: 0, time: 'Immediate' },
    { name: 'Manzini Central / Sidwashini Delivery', fee: 50, time: 'Same Day' },
    { name: 'Ezulwini Valley', fee: 100, time: 'Same Day' },
    { name: 'Matsapha Industrial Area', fee: 120, time: 'Next Day' },
    { name: 'Manzini Town', fee: 150, time: 'Next Day' },
    { name: 'Piggs Peak', fee: 200, time: '1-2 Days' },
    { name: 'Siteki / Lubombo', fee: 250, time: '2 Days' },
    { name: 'Nhlangano / Shiselweni', fee: 250, time: '2 Days' },
  ];

  const VAT_RATE = 0.15;

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const found = ESWATINI_CITIES.find(c => c.name === cityName);
    if (found) {
      setShippingFee(found.fee);
    }
  };

  // Zoom Math
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomContainerRef.current) return;
    const { left, top, width, height } = zoomContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // 360 Drag rotation handlers
  const handleDragDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsRotatingDrag(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    angleStartRef.current = rotationAngle;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isRotatingDrag) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartRef.current;
    
    // Scale sensitivity
    let newAngle = angleStartRef.current - Math.round(diff * 1.2);
    
    // Clamp or wrap angle
    while (newAngle < 0) newAngle += 360;
    while (newAngle >= 360) newAngle -= 360;
    
    setRotationAngle(newAngle);
  };

  const handleDragUp = () => {
    setIsRotatingDrag(false);
  };

  // Document listener for window dragging releases
  useEffect(() => {
    if (isRotatingDrag) {
      window.addEventListener('mouseup', handleDragUp);
      window.addEventListener('touchend', handleDragUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleDragUp);
      window.removeEventListener('touchend', handleDragUp);
    };
  }, [isRotatingDrag]);

  // Pricing breakdown calculations
  const calculateWholesaleTiers = (qty: number) => {
    let discountPercent = 0;
    if (qty >= 5 && qty < 10) discountPercent = 5;
    else if (qty >= 10 && qty < 25) discountPercent = 10;
    else if (qty >= 25) discountPercent = 15;

    const baseUnitPrice = product.price;
    const tierUnitPrice = Math.round(baseUnitPrice * (1 - discountPercent / 100));
    
    // Optional specs calculation
    let addOnsPricePerUnit = 0;
    if (requireOSInstall) addOnsPricePerUnit += 280;
    if (requireBags) addOnsPricePerUnit += 350;
    if (requireExtendedWarranty) addOnsPricePerUnit += 650;

    const unitPriceWithAddons = tierUnitPrice + addOnsPricePerUnit;
    const baseSubtotalExclVat = Math.round((unitPriceWithAddons * qty) / (1 + VAT_RATE));
    const totalVAT = Math.round(unitPriceWithAddons * qty - baseSubtotalExclVat);
    const totalInvoicedValue = unitPriceWithAddons * qty;
    const totalSavingsValue = (baseUnitPrice - tierUnitPrice) * qty;

    return {
      discountPercent,
      originalUnitPrice: baseUnitPrice,
      wholesaleUnitPrice: tierUnitPrice,
      addonsCost: addOnsPricePerUnit,
      finalUnitPrice: unitPriceWithAddons,
      subtotalExclVat: baseSubtotalExclVat,
      vatComponent: totalVAT,
      finalCost: totalInvoicedValue,
      savings: totalSavingsValue
    };
  };

  // Live updates for quick visual panel
  const pBillDetails = calculateWholesaleTiers(bulkQty);

  // Handle advanced institutional quote request submit
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formContact || !formEmail) return;

    setIsGeneratingQuote(true);
    
    setTimeout(() => {
      // Simulate formal serial generation
      const quoteSerial = `BRITE-EST-Q${Math.floor(1000 + Math.random() * 9000)}-2026`;
      const finalBill = calculateWholesaleTiers(bulkQty);
      
      setGeneratedQuoteDetails({
        serial: quoteSerial,
        company: formCompany,
        contact: formContact,
        email: formEmail,
        phone: formPhone || 'N/A',
        qty: bulkQty,
        productName: product.name,
        sku: product.sku,
        addons: {
          os: requireOSInstall,
          accessories: requireBags,
          warranty: requireExtendedWarranty
        },
        financials: finalBill,
        delivery: selectedCity,
        shippingPrice: shippingFee,
        date: new Date().toLocaleDateString('en-GB')
      });
      setIsGeneratingQuote(false);
    }, 1800);
  };

  // WhatsApp formatted link
  const standardWaLink = `https://wa.me/26876623733?text=${encodeURIComponent(`Hi Briteman Electronics! I am interested in purchasing:
• *Product:* ${product.name}
• *SKU:* ${product.sku}
• *Price:* E${product.price.toLocaleString()}
• *Condition:* ${pConditionLabel(product)}

Please confirm showroom stock availability.`)}`;

  function pConditionLabel(p: Product) {
    return p.condition === 'New' ? 'Brand New Factory Sealed' : 'Grade-A Certified Pre-Owned';
  }

  const handleShareQuoteWhatsApp = () => {
    if (!generatedQuoteDetails) return;
    const q = generatedQuoteDetails;
    const msg = `🧾 *BRITEMAN ELECTRONICS - PROCUREMENT QUOTATION*
*Reference:* ${q.serial}
*Date:* ${q.date}

*Client:* ${q.company}
*Attn:* ${q.contact}
*Phone:* ${q.phone}

*Specification Request:*
- ${q.qty} x ${q.productName}
- Model SKU: ${q.sku}
${q.addons.os ? '- Custom pre-installed Windows 11 Enterprise (E280/ea)\n' : ''}${q.addons.accessories ? '- Bundled genuine heavy-duty carry bags (E350/ea)\n' : ''}${q.addons.warranty ? '- Extended 3-Year The Hub Diagnostic warranty (E650/ea)\n' : ''}
*Financial Calculation:*
• Base Unit Price: E${q.financials.originalUnitPrice.toLocaleString()}
• Tier Special Discount: ${q.financials.discountPercent}% Off
• final bulk price: E${q.financials.finalUnitPrice.toLocaleString()} / unit

• *Subtotal (Excl. VAT):* E${q.financials.subtotalExclVat.toLocaleString()}
• *VAT (15%):* E${q.financials.vatComponent.toLocaleString()}
• *Total Invoice Amount:* E${(q.financials.finalCost + q.shippingPrice).toLocaleString()} (Includes ${q.delivery} delivery)

*Estimated savings:* E${q.financials.savings.toLocaleString()}!

_Please send a signed purchase order or voucher to initiate commercial logistics._`;

    window.open(`https://wa.me/26876623733?text=${encodeURIComponent(msg)}`);
  };

  return (
    <div id="product-detail-modal-overlay" className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-50 dark:bg-dark-card rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        
        {/* Header Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md px-6 py-4 border-b dark:border-slate-800 flex justify-between items-center z-20">
          <div className="text-left">
            <span className="text-[10px] bg-primary/10 text-primary dark:text-accent font-extrabold uppercase px-2 py-0.5 rounded font-mono tracking-wider">
              {product.brand} • {product.category}
            </span>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-sm sm:max-w-md mt-1">{product.name}</h4>
          </div>

          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1.5 bg-slate-100 hover:bg-slate-205 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full transition cursor-pointer"
            title="Close Spec Sheet"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          
          {/* Main Grid View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: INTERACTIVE IMAGE SUITE (5 Columns) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Media Segment Switcher (Photos vs 360 Mode) */}
              <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl w-full">
                <button
                  id="tab-view-photos"
                  onClick={() => setViewMode('photos')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center space-x-1 ${
                    viewMode === 'photos'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                  }`}
                >
                  <Eye className="h-3.8 w-3.8 text-primary" />
                  <span>High-Res Gallery</span>
                </button>
                
                <button
                  id="tab-view-360"
                  onClick={() => setViewMode('360')}
                  className={`flex-1 py-2 text-xs font-black rounded-xl transition flex items-center justify-center space-x-1 ${
                    viewMode === '360'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
                  }`}
                >
                  <RotateCcw className="h-4 w-4 text-accent" />
                  <span>Interactive 360° View</span>
                </button>
              </div>

              {/* DYNAMIC VIEWPORT FRAME */}
              <div className="relative h-72 sm:h-96 bg-white dark:bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
                
                {/* 360 DEGREE ROTATING MODEL VIEW */}
                {viewMode === '360' ? (
                  <div 
                    id="canvas-360-rotating-stage" 
                    className="w-full h-full flex flex-col items-center justify-center relative cursor-ew-resize select-none overflow-hidden"
                    onMouseDown={handleDragDown}
                    onMouseMove={handleDragMove}
                    onMouseLeave={handleDragUp}
                    onMouseUp={handleDragUp}
                    onTouchStart={handleDragDown}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragUp}
                  >
                    {/* studio physical reflection layers */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                      style={{ 
                        background: `linear-gradient(${rotationAngle}deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 75%)`
                      }}
                    ></div>

                    {/* rotating device image shadows underneath */}
                    <div 
                      className="absolute bottom-10 left-12 right-12 h-4 bg-slate-950/30 blur-md rounded-full transform transition-all duration-100"
                      style={{
                        transform: `scale(${0.7 + Math.abs(Math.sin((rotationAngle * Math.PI) / 180)) * 0.15}) skewX(${Math.sin((rotationAngle * Math.PI) / 180) * 15}deg)`
                      }}
                    ></div>

                    {/* primary component image */}
                    <img 
                      src={product.image} 
                      alt="" 
                      className="h-40 sm:h-52 object-contain select-none pointer-events-none transform transition-all duration-100"
                      style={{
                        transform: `perspective(1000px) rotateY(${rotationAngle}deg) rotateX(10deg) scale(${0.85 + Math.abs(Math.sin((rotationAngle * Math.PI) / 180)) * 0.05})`,
                        filter: `hue-rotate(${Math.sin(rotationAngle * 0.01) * 3}deg) brightness(${98 + Math.sin(rotationAngle * 0.05) * 8}%)`
                      }}
                    />

                    {/* Instructions helper overlay */}
                    <div className="absolute top-4 left-4 right-4 text-center pointer-events-none select-none">
                      <span className="bg-slate-900/80 text-white text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold font-mono">
                        Drag Left/Right To Rotate Model
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 p-2 rounded-xl flex items-center space-x-2 border dark:border-slate-800">
                      <span className="text-[10px] font-mono text-slate-450 shrink-0">Angle: {rotationAngle}°</span>
                      <input 
                        id="rotation-slider-360"
                        type="range"
                        min="0"
                        max="360"
                        value={rotationAngle}
                        onChange={(e) => setRotationAngle(Number(e.target.value))}
                        className="flex-1 accent-accent bg-slate-200 dark:bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  
                  /* STANDARD PHOTO GALLERY + LIVE HOVER ZOOM */
                  <div
                    id="zoom-hover-frame"
                    ref={zoomContainerRef}
                    onMouseEnter={() => {
                      setIsZoomReady(true);
                      setIsZooming(true);
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => {
                      setIsZoomReady(false);
                      setIsZooming(false);
                    }}
                    className="w-full h-full flex items-center justify-center relative overflow-hidden bg-white cursor-zoom-in"
                  >
                    <img
                      src={imagesList[currentImageIdx]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain p-4 transform transition-transform duration-100 ease-out"
                      style={{
                        transform: isZooming ? `scale(2.2)` : `scale(1)`,
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                      }}
                    />

                    {/* Magnifier glass indicator */}
                    {!isZooming && (
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white p-2 rounded-full pointer-events-none">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    )}

                    {isZooming && (
                      <span className="absolute bottom-3 left-3 bg-emerald-600 text-white font-mono text-[9px] font-semibold px-2 py-0.5 rounded px-2">
                        Inspect Zoom: x2.2
                      </span>
                    )}

                    {/* Conditions badge */}
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded font-black tracking-wider shadow">
                      {product.condition}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails list selector (Photos Mode) */}
              {viewMode === 'photos' && imagesList.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {imagesList.map((img, idx) => (
                    <button
                      id={`gallery-thumb-${idx}`}
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`relative h-14 sm:h-16 rounded-xl overflow-hidden border-2 bg-white transition cursor-pointer p-0.5 ${
                        currentImageIdx === idx ? 'border-primary shadow' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}

              {/* Warranties highlights */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 space-y-3">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider block font-mono">The Hub Authorized Local Warranties</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-350">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 font-bold shrink-0" />
                    <span>In-Store Support Center on The Hub, Manzini.</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-350">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 font-bold shrink-0" />
                    <span>Manufacturer Authentic coverage: <b>{product.warranty}</b></span>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 2: DETAILED SPECS SHEET AND QUOTE CALCULATORS (7 Columns) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Main Product Info Block */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">ID SKU: {product.sku}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                    product.availability === 'In Stock'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : product.availability === 'Low Stock'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    ● {product.availability === 'In Stock' ? 'Showroom In Stock' : product.availability === 'Low Stock' ? 'Limited Reserves' : 'Out of Stock / Restocking'}
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                  {product.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-1 select-text">
                  {product.description}
                </p>
              </div>

              {/* TECHNICAL PARAMETERS MATRIX */}
              <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-wider block font-mono">Hardware Component Specifications</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="pb-2 border-b dark:border-slate-850 text-xs">
                      <span className="text-slate-450 block font-bold text-[10px] uppercase font-mono">{key}:</span>
                      <span className="font-semibold text-slate-800 dark:text-white leading-tight font-sans">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DUAL CALCULATORS: Shipping Estimator & Wholesale Tier Builder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Delivery estimator */}
                <div className="bg-white dark:bg-slate-905 p-4 rounded-xl border dark:border-slate-800 text-xs text-left shadow-sm space-y-3">
                  <span className="font-extrabold text-slate-850 dark:text-white flex items-center space-x-1.5 uppercase font-mono">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Real-time logistics Quote</span>
                  </span>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Destination Location:</label>
                    <select
                      id="shipping-est-city"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-xs cursor-pointer font-bold"
                    >
                      {ESWATINI_CITIES.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg font-mono">
                    <span className="text-slate-450 text-[10px] uppercase font-bold">Estimated charge:</span>
                    <span className="font-black text-primary text-sm">
                      {shippingFee === 0 ? 'FREE PICKUP' : `E${shippingFee}`}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-400 block">* Direct deliveries dispatched same day or next day in Eswatini hubs.</span>
                </div>

                {/* Bulk calculator visual card */}
                <div className="bg-white dark:bg-slate-905 p-4 rounded-xl border dark:border-slate-800 text-xs text-left shadow-sm space-y-3">
                  <span className="font-extrabold text-slate-850 dark:text-white flex items-center space-x-1.5 uppercase font-mono">
                    <Calculator className="h-4 w-4 text-accent" />
                    <span>Wholesale Tier Forecast</span>
                  </span>

                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Target Quantity:</span>
                    <input
                      id="bulk-qty-direct-calc"
                      type="number"
                      min="1"
                      max="150"
                      value={bulkQty}
                      onChange={(e) => setBulkQty(Math.max(1, Number(e.target.value)))}
                      className="w-16 p-1.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white rounded-lg focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1.5 text-[11px] font-mono select-none">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Selected discount:</span>
                      <span className="font-bold text-accent">-{pBillDetails.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-850 dark:text-white">
                      <span>Pro-forma Total:</span>
                      <span>E{pBillDetails.finalCost.toLocaleString()}</span>
                    </div>
                    {pBillDetails.savings > 0 && (
                      <div className="text-emerald-500 font-bold text-[10px] flex justify-between border-t border-dashed dark:border-slate-800 pt-1 mt-1">
                        <span>Corporate Savings:</span>
                        <span>E{pBillDetails.savings.toLocaleString()}!</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ACTION CENTER - PRICES AND BUY BUTTONS */}
              <div className="pt-6 border-t dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 bg-white dark:bg-slate-900/40 p-5 rounded-2xl border dark:border-slate-800">
                <div className="space-y-1 text-left">
                  <span className="text-slate-450 text-[10px] font-bold uppercase block tracking-wider font-mono">Authorized Showroom Retail Price</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl sm:text-3.5xl font-black font-mono text-slate-900 dark:text-white leading-none">
                      E{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Includes local taxes</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs line-through text-slate-400 block font-mono">Original: E{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 justify-end self-center md:self-auto w-full md:w-auto">
                  
                  {/* WhatsApp click inquiry */}
                  <a
                    id="whatsapp-direct-inquiry"
                    href={standardWaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none uppercase bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-205 py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center space-x-1 border dark:border-slate-800 cursor-pointer"
                  >
                    <MessageSquare className="h-4.2 w-4.2 text-emerald-500 font-bold shrink-0" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  {/* Add to Cart */}
                  <button
                    id="cart-add-detail-modal"
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex-1 sm:flex-none py-3 px-4 rounded-xl text-xs font-black uppercase flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                      product.stock === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border dark:bg-slate-850'
                        : isInCart
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/10'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stock === 0 ? 'Sold Out' : isInCart ? 'In Cart √' : 'Add to Cart'}</span>
                  </button>

                  {/* Buy Now directly */}
                  <button
                    id="buy-directly-modal"
                    onClick={() => onBuyNow(product)}
                    disabled={product.stock === 0}
                    className="flex-1 sm:flex-none py-3 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase rounded-xl shadow-lg shadow-accent/20 transition cursor-pointer"
                  >
                    Buy Directly (Checkout)
                  </button>

                </div>
              </div>

              {/* TENDER COMPLIANCE PRO-FORMA INVOICE QUOTE REQUEST */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden space-y-4">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                  <div>
                    <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Tender Compliance</span>
                    <h4 className="text-base sm:text-lg font-black uppercase mt-2 tracking-tight">Need a custom wholesale school or clinic proposal?</h4>
                    <p className="text-xs text-slate-350 leading-relaxed mt-1">
                      Configure custom operating licenses, accessories bags, extended warranties, and download compiled compliant quotation PDF proposal matches right now.
                    </p>
                  </div>

                  <button
                    id="open-bulk-quote-panel"
                    onClick={() => {
                      setFormCompany('');
                      setFormContact('');
                      setFormEmail('');
                      setGeneratedQuoteDetails(null);
                      setShowBulkForm(!showBulkForm);
                    }}
                    className="bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl text-xs font-black flex items-center space-x-1 transition shrink-0 self-center sm:self-auto cursor-pointer shadow-lg"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{showBulkForm ? 'Collapse Builder' : 'Request Compliant Proposal'}</span>
                  </button>
                </div>

                {/* SLIDING PROPOSAL BUILDER FOR INSTITUTIONAL BUYERS */}
                {showBulkForm && (
                  <div className="pt-4 border-t border-white/10 text-left space-y-4 text-xs animate-fadeIn">
                    
                    {!generatedQuoteDetails ? (
                      
                      /* BUILDER FORM */
                      <form onSubmit={handleRequestSubmit} className="space-y-4">
                        <span className="text-[10px] uppercase font-black text-slate-400 font-mono tracking-widest block">• PROCUREMENTS COMPLIANCE DESK FORM:</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">School, Clinic or Company Name *</label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                              <input
                                id="quote-company-name"
                                type="text"
                                placeholder="e.g. Manzini Central High School"
                                required
                                value={formCompany}
                                onChange={(e) => setFormCompany(e.target.value)}
                                className="w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Contact Person *</label>
                            <div className="relative">
                              <User2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                              <input
                                id="quote-contact-person"
                                type="text"
                                placeholder="e.g. Sipho Diamini (Head of IT)"
                                required
                                value={formContact}
                                onChange={(e) => setFormContact(e.target.value)}
                                className="w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Procurement Email *</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                              <input
                                id="quote-email"
                                type="email"
                                placeholder="e.g. siphodlamini@school.org.sz"
                                required
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                className="w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Contact Mobile Phone</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                              <input
                                id="quote-phone"
                                type="tel"
                                placeholder="e.g. +268 7602 4311"
                                value={formPhone}
                                onChange={(e) => setFormPhone(e.target.value)}
                                className="w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-1 focus:ring-accent"
                              />
                            </div>
                          </div>

                        </div>

                        {/* Custom system optimizations */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[10px] text-slate-400 uppercase font-bold">Hardware Add-ons &amp; Customizations:</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            
                            <label className="bg-slate-950 p-3 rounded-xl border border-white/10 flex items-start space-x-2.5 cursor-pointer hover:border-accent">
                              <input 
                                type="checkbox" 
                                checked={requireOSInstall} 
                                onChange={(e) => setRequireOSInstall(e.target.checked)}
                                className="mt-0.5 accent-accent"
                              />
                              <div>
                                <span className="font-bold block text-white text-[11px]">Install OS (+E280/unit)</span>
                                <span className="text-[9px] text-slate-450 block">Pre-activated original Windows 11 Enterprise</span>
                              </div>
                            </label>

                            <label className="bg-slate-950 p-3 rounded-xl border border-white/10 flex items-start space-x-2.5 cursor-pointer hover:border-accent">
                              <input 
                                type="checkbox" 
                                checked={requireBags} 
                                onChange={(e) => setRequireBags(e.target.checked)}
                                className="mt-0.5 accent-accent"
                              />
                              <div>
                                <span className="font-bold block text-white text-[11px]">Heavy duty bags (+E350/unit)</span>
                                <span className="text-[9px] text-slate-450 block">Genuine leather/felt anti-shock backpacks</span>
                              </div>
                            </label>

                            <label className="bg-slate-950 p-3 rounded-xl border border-white/10 flex items-start space-x-2.5 cursor-pointer hover:border-accent">
                              <input 
                                type="checkbox" 
                                checked={requireExtendedWarranty} 
                                onChange={(e) => setRequireExtendedWarranty(e.target.checked)}
                                className="mt-0.5 accent-accent"
                              />
                              <div>
                                <span className="font-bold block text-white text-[11px]">3-Year Extension (+E650/unit)</span>
                                <span className="text-[9px] text-slate-450 block">The Hub diagnostic physical coverage</span>
                              </div>
                            </label>

                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            id="submit-pro-forma-request"
                            type="submit"
                            disabled={isGeneratingQuote}
                            className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                          >
                            {isGeneratingQuote ? (
                              <>
                                <span className="animate-spin text-xs">⟳</span>
                                <span>Generating Compliant Invoice Quote...</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Generate Compliant Quotation</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    ) : (
                      
                      /* GENERATED COMPLIANT QUOTATION SCREEN */
                      <div className="bg-white text-slate-900 p-5 sm:p-6 rounded-2xl space-y-4 border-2 border-accent border-double shadow-xl animate-scaleUp">
                        
                        {/* Quote head banner */}
                        <div className="flex justify-between items-start border-b pb-3 border-slate-201 flex-wrap gap-2 text-left">
                          <div>
                            <span className="text-[10px] bg-primary text-white font-mono px-2 py-0.5 rounded font-black max-w-[120px] block text-center">OFFICIAL QUOTE</span>
                            <h4 className="font-black text-sm text-slate-900 mt-1">BRITEMAN COMMERCIAL ELECTRONICS</h4>
                            <p className="text-[10px] text-slate-500">Lot 14 The Hub, Manzini, Eswatini • +268 3450 1703</p>
                          </div>
                          <div className="text-right text-xs">
                            <p className="font-mono text-[11px] font-bold text-accent">Ref: {generatedQuoteDetails.serial}</p>
                            <p className="text-slate-500">Date Issued: {generatedQuoteDetails.date}</p>
                            <p className="text-[10px] text-emerald-600 font-bold">Local showroom stock prioritized</p>
                          </div>
                        </div>

                        {/* Customer & hardware matrix */}
                        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl text-left">
                          <div>
                            <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider font-mono">Invoice To:</span>
                            <p className="font-extrabold text-slate-900">{generatedQuoteDetails.company}</p>
                            <p className="text-[11px] text-slate-650">attn: {generatedQuoteDetails.contact}</p>
                            <p className="text-[11px] text-slate-500">{generatedQuoteDetails.email}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] block text-slate-400 font-bold uppercase tracking-wider font-mono">Item Ordered:</span>
                            <p className="font-bold text-slate-900">{generatedQuoteDetails.productName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">Model SKU: {generatedQuoteDetails.sku}</p>
                            <p className="text-[11px] text-emerald-600 font-bold">{generatedQuoteDetails.qty} wholesale units</p>
                          </div>
                        </div>

                        {/* Addon details summary */}
                        <div className="space-y-1.5 text-[11px]">
                          <span className="text-[9px] text-slate-450 uppercase tracking-widest font-extrabold font-mono font-bold block">Included Service Customizations:</span>
                          <div className="bg-slate-50/50 p-2 rounded-lg space-y-1">
                            <div className="flex justify-between">
                              <span>• Base Factory Units:</span>
                              <span className="font-mono">{generatedQuoteDetails.qty} units</span>
                            </div>
                            {generatedQuoteDetails.addons.os && (
                              <div className="flex justify-between text-slate-600">
                                <span>• Windows 11 Enterprise installation:</span>
                                <span className="font-mono">Included (+E280/ea)</span>
                              </div>
                            )}
                            {generatedQuoteDetails.addons.accessories && (
                              <div className="flex justify-between text-slate-600">
                                <span>• Shockproof Backpack attachments:</span>
                                <span className="font-mono">Included (+E350/ea)</span>
                              </div>
                            )}
                            {generatedQuoteDetails.addons.warranty && (
                              <div className="flex justify-between text-slate-600">
                                <span>• 3-Year Diamond physical Warranty extension:</span>
                                <span className="font-mono">Included (+E650/ea)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Prices calculations */}
                        <div className="border-t pt-3 space-y-2 text-xs">
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-500">Total Unit Price (Discount applied):</span>
                            <span className="font-bold text-slate-800">E{generatedQuoteDetails.financials.finalUnitPrice.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between font-mono">
                            <span className="text-slate-500">Gross Procurement Subtotal (Excl. VAT):</span>
                            <span className="font-bold text-slate-800">E{generatedQuoteDetails.financials.subtotalExclVat.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between font-mono">
                            <span className="text-slate-500">Eswatini VAT (15% compliance):</span>
                            <span className="font-medium text-slate-600">E{generatedQuoteDetails.financials.vatComponent.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between font-mono">
                            <span className="text-slate-500">Institutional Ground Logistics ({generatedQuoteDetails.delivery}):</span>
                            <span className="font-medium text-slate-600">E{generatedQuoteDetails.shippingPrice}</span>
                          </div>

                          <div className="flex justify-between items-baseline font-mono bg-primary/10 p-3 rounded-xl border border-primary/20 text-sm">
                            <span className="font-extrabold text-primary uppercase text-xs">Grand Total Invoice Value:</span>
                            <span className="text-xl font-black text-primary">
                              E{(generatedQuoteDetails.financials.finalCost + generatedQuoteDetails.shippingPrice).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                          <span>🎁 Volume Loyalty Tier Saved:</span>
                          <span className="font-mono">E{generatedQuoteDetails.financials.savings.toLocaleString()}!</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2.5 justify-end">
                          <button
                            id="quote-print-action"
                            onClick={() => window.print()}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-850 px-4 py-2.5 rounded-lg text-xs font-bold font-mono transition flex items-center space-x-1 cursor-pointer"
                          >
                            <Printer className="h-3.8 w-3.8" />
                            <span>Print Proposal</span>
                          </button>

                          <button
                            id="quote-share-whatsapp"
                            onClick={handleShareQuoteWhatsApp}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow"
                          >
                            <MessageSquare className="h-3.8 w-3.8" />
                            <span>Send Quotation to WhatsApp</span>
                          </button>

                          <button
                            id="quote-restart-builder"
                            onClick={() => setGeneratedQuoteDetails(null)}
                            className="text-xs text-slate-450 hover:text-slate-900 border rounded-lg px-2 py-1 flex items-center"
                          >
                            Reset
                          </button>
                        </div>

                      </div>

                    )}

                  </div>
                )}

                {/* DYNAMIC RELATED PRODUCTS / PRODUCT RECOMMENDATIONS */}
                {relatedProducts && relatedProducts.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
                    <div className="mb-5">
                      <span className="text-[10px] text-accent uppercase font-black font-mono tracking-widest block">💡 CERTIFIED ALTERNATIVES</span>
                      <h4 className="text-base font-black text-slate-905 dark:text-white uppercase tracking-tight">Product Recommendations</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {relatedProducts.map(rp => (
                        <div
                          id={`recommendation-card-${rp.id}`}
                          key={rp.id}
                          onClick={() => {
                            if (onSelectProduct) {
                              onSelectProduct(rp);
                            }
                          }}
                          className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-805/65 p-2.5 rounded-2xl flex flex-col justify-between hover:scale-102 transform transition duration-300 cursor-pointer hover:shadow-sm"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-950 mb-2">
                            <img src={rp.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold uppercase font-mono block mb-0.5">{rp.brand}</span>
                            <h5 className="font-bold text-slate-900 truncate dark:text-white text-xs mb-0.5" title={rp.name}>{rp.name}</h5>
                            <span className="font-mono font-bold text-primary dark:text-accent text-xs">E{rp.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
