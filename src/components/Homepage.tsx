import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, Laptop, Monitor, FileText, ShoppingBag, Landmark, Award, ShieldCheck, 
  Truck, Sparkles, Star, ChevronRight, MessageSquare, Percent, ThumbsUp, HelpCircle, 
  Database, RefreshCw, Zap, Battery, FolderOpen, HardDrive, ShieldAlert, BadgePercent,
  Clock, Package, Plane, CheckCircle, Users, ExternalLink, Calendar, BookOpen
} from 'lucide-react';
import { Product } from '../types';

interface HomepageProps {
  products: Product[];
  onTabChange: (tab: string) => void;
  onAddToCart: (p: Product) => void;
  onBuyNow: (p: Product) => void;
  onOpenProductDetail: (p: Product) => void;
  onCategoryFilterChange: (category: string) => void;
  onBrandFilterChange: (brand: string) => void;
}

export default function Homepage({
  products,
  onTabChange,
  onAddToCart,
  onBuyNow,
  onOpenProductDetail,
  onCategoryFilterChange,
  onBrandFilterChange
}: HomepageProps) {
  
  // States for Featured Products Segmentation Tab
  const [featuredSegment, setFeaturedSegment] = useState<'arrivals' | 'bestsellers' | 'deals' | 'wholesale'>('arrivals');

  // Categories metadata with customized royalty-free images, icons and target filters
  const categoriesList = [
    { 
      name: 'Laptops', 
      dbCategory: 'Laptops',
      icon: <Laptop className="h-5 w-5 text-primary" />,
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
      tagline: 'HP EliteBooks & Dell Latitude'
    },
    { 
      name: 'Desktop Computers', 
      dbCategory: 'Desktop Computers',
      icon: <Monitor className="h-5 w-5 text-[#8b5cf6]" />,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=400&q=80',
      tagline: 'SFF office setups & Mini PCs'
    },
    { 
      name: 'MacBooks', 
      dbCategory: 'MacBooks',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      tagline: 'Apple M1, M2 & M3 models'
    },
    { 
      name: 'Tablets', 
      dbCategory: 'Tablets',
      icon: <BookOpen className="h-5 w-5 text-emerald-500" />,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
      tagline: 'Samsung Galaxy Galaxy Tabs'
    },
    { 
      name: 'Printers', 
      dbCategory: 'Printers',
      icon: <FileText className="h-5 w-5 text-sky-500" />,
      image: 'https://images.unsplash.com/photo-1563223552-30d01fda3ea6?auto=format&fit=crop&w=400&q=80',
      tagline: 'Cartridge-free EcoTank ink'
    },
    { 
      name: 'UPS Systems', 
      dbCategory: 'UPS Systems',
      icon: <Battery className="h-5 w-5 text-[#dc2626]" />,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
      tagline: 'APC back-up load-shedding kits'
    },
    { 
      name: 'Hard Drives', 
      dbCategory: 'Storage Drives',
      icon: <HardDrive className="h-5 w-5 text-indigo-500" />,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80',
      tagline: 'External HDD backup expansion'
    },
    { 
      name: 'Flash Drives', 
      dbCategory: 'Storage Drives',
      icon: <Database className="h-5 w-5 text-teal-500" />,
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=400&q=80',
      tagline: 'High speed portable USB pens'
    },
    { 
      name: 'Gaming Consoles', 
      dbCategory: 'Kids Gaming Consoles',
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=400&q=80',
      tagline: 'Vintage retro 400-in-1 kids screens'
    },
    { 
      name: 'Laptop Bags', 
      dbCategory: 'Accessories',
      icon: <FolderOpen className="h-5 w-5 text-rose-500" />,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
      tagline: 'Durable anti-theft tech cases'
    },
    { 
      name: 'Chargers', 
      dbCategory: 'Accessories',
      icon: <RefreshCw className="h-5 w-5 text-violet-500" />,
      image: 'https://images.unsplash.com/photo-1625857072533-8a9d68521798?auto=format&fit=crop&w=400&q=80',
      tagline: 'Universal laptop power bricks'
    },
    { 
      name: 'Keyboards', 
      dbCategory: 'Accessories',
      icon: <Package className="h-5 w-5 text-lime-500" />,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
      tagline: 'Logitech silent wireless keyboards'
    },
    { 
      name: 'Mouse', 
      dbCategory: 'Accessories',
      icon: <ThumbsUp className="h-5 w-5 text-fuchsia-500" />,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
      tagline: 'Ergonomic silent optical mice'
    },
    { 
      name: 'Networking Equipment', 
      dbCategory: 'Networking Equipment',
      icon: <Zap className="h-5 w-5 text-[#2563eb]" />,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
      tagline: 'TP-Link high bandwidth WiFi 6'
    },
    { 
      name: 'Accessories', 
      dbCategory: 'Accessories',
      icon: <ShoppingBag className="h-5 w-5 text-purple-500" />,
      image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=400&q=80',
      tagline: 'USB adapters, hubs & audio cables'
    }
  ];

  // Brand index with localStorage sync
  const [BRANDS, setBrands] = useState<{ name: string; desc: string; logo?: string }[]>(() => {
    const saved = localStorage.getItem('briteman_licensed_brands');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { name: 'HP', desc: 'Enterprise Systems' },
      { name: 'Dell', desc: 'Secure Workstations' },
      { name: 'Lenovo', desc: 'ThinkPad Durability' },
      { name: 'Apple', desc: 'High-End Innovation' },
      { name: 'Acer', desc: 'Outstanding Value' },
      { name: 'Asus', desc: 'Gaming Powerhouses' },
      { name: 'Samsung', desc: 'Display & Mobile' },
      { name: 'Canon', desc: 'Legendary Imaging' },
      { name: 'Epson', desc: 'EcoTank Ink champions' },
      { name: 'Logitech', desc: 'Smart Peripherals' },
      { name: 'Toshiba', desc: 'Reliable Compute' },
      { name: 'Seagate', desc: 'Dense Storage HDDs' },
      { name: 'Western Digital', desc: 'High-Speed M.2 SSDs' }
    ];
  });

  useEffect(() => {
    const handleBrandsUpdate = () => {
      const saved = localStorage.getItem('briteman_licensed_brands');
      if (saved) {
        try { setBrands(JSON.parse(saved)); } catch (e) { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleBrandsUpdate);
    window.addEventListener('brands-updated', handleBrandsUpdate as EventListener);
    return () => {
      window.removeEventListener('storage', handleBrandsUpdate);
      window.removeEventListener('brands-updated', handleBrandsUpdate as EventListener);
    };
  }, []);

  // Why choose advantages (8 required components)
  const trustFactors = [
    {
      title: 'Genuine Products Only',
      desc: '100% factory sealed with verified serial routing from Apple, HP, Dell, and Canon. ZERO cloned grey imports.',
      icon: <Award className="h-5 w-5 text-[#0057D9]" />
    },
    {
      title: 'Competitive Retail Pricing',
      desc: 'Optimized local taxation channels in Mbabane ensure direct factory savings passed down to final Swazi consumers.',
      icon: <BadgePercent className="h-5 w-5 text-[#FF6B00]" />
    },
    {
      title: 'Wholesale & RFQ Discounts',
      desc: 'Substantial savings for institutional buyers, public ministries, and registered schools buying over 5 models.',
      icon: <Landmark className="h-5 w-5 text-indigo-500" />
    },
    {
      title: 'Fast Doorstep Delivery',
      desc: 'Dedicated transport fleet providing next-day delivery to Lobamba, Manzini, Piggs Peak, and Matsapha.',
      icon: <Truck className="h-5 w-5 text-emerald-500" />
    },
    {
      title: 'Expert Support Lab',
      desc: 'Access certified computer technicians at our physical Somhlolo Road showroom for immediate setup queries.',
      icon: <HelpCircle className="h-5 w-5 text-[#8b5cf6]" />
    },
    {
      title: 'Local Store Warranty',
      desc: 'Full local processing desk inside Mbabane showroom. Skip international package mailings completely.',
      icon: <ShieldCheck className="h-5 w-5 text-blue-500" />
    },
    {
      title: 'Trusted Supplier status',
      desc: 'Fully registered tax compliant partner compliant with governmental tender frameworks and school vouchers.',
      icon: <ThumbsUp className="h-5 w-5 text-pink-500" />
    },
    {
      title: 'Convenient Safe Pickup',
      desc: 'Drive directly to our Lilunga House adjacent warehouse, load hardware, and process transactions securely.',
      icon: <Clock className="h-5 w-5 text-cyan-500" />
    }
  ];

  // Segregate Products database lists to reflect strict, high-converting tabs
  const arrivalsProducts = useMemo(() => {
    return products.slice(0, 4); // First 4 items serve as New arrivals
  }, [products]);

  const bestSellersProducts = useMemo(() => {
    return products.filter(p => p.tags?.includes('Best Seller') || p.stock > 15).slice(0, 4);
  }, [products]);

  const dealsProducts = useMemo(() => {
    return products.filter(p => (p.originalPrice && p.originalPrice > p.price) || p.price < 5000).slice(0, 4);
  }, [products]);

  const wholesaleProducts = useMemo(() => {
    // Large heavy duty tech or printers ideal for corporate purchase
    return products.filter(p => p.category === 'Printers' || p.category === 'Laptops' || p.category === 'UPS Systems').slice(0, 4);
  }, [products]);

  // Read active segment
  const activeSegmentProducts = useMemo(() => {
    switch (featuredSegment) {
      case 'bestsellers': return bestSellersProducts.length > 0 ? bestSellersProducts : products.slice(1, 5);
      case 'deals': return dealsProducts.length > 0 ? dealsProducts : products.slice(2, 6);
      case 'wholesale': return wholesaleProducts.length > 0 ? wholesaleProducts : products.slice(3, 7);
      case 'arrivals':
      default:
        return arrivalsProducts;
    }
  }, [featuredSegment, arrivalsProducts, bestSellersProducts, dealsProducts, wholesaleProducts, products]);

  const activeSegmentLabel = useMemo(() => {
    switch (featuredSegment) {
      case 'arrivals': return 'Fresh New Arrivals';
      case 'bestsellers': return 'Most Popular Hardware';
      case 'deals': return 'Limited Time Price Cuts';
      case 'wholesale': return 'Special Bulk Price Matrix';
    }
  }, [featuredSegment]);

  // Custom function to format WhatsApp message URL
  const generateWhatsAppInquiryUrl = (p: Product) => {
    const text = `Hi Briteman Electronics! I am viewing your online Eswatini showcase and have questions on:
- Product Model: ${p.name}
- Product Price: E${p.price.toLocaleString()}
- SKU Identifier: ${p.sku}

Please let me know if I can arrange pick-up at the Somhlolo Road showroom!`;
    return `https://wa.me/26876623733?text=${encodeURIComponent(text)}`;
  };

  // Helper to count items inside a category filter
  const getProductCount = (categoryName: string, dbCategory: string) => {
    const list = products.filter(p => p.category === dbCategory || p.category.toLowerCase().includes(categoryName.toLowerCase()));
    if (list.length > 0) return list.length;
    // Return sensible realistic volume of stock line placeholders if mock data isn't fully expanded
    if (categoryName === 'Flash Drives') return '12';
    if (categoryName === 'Laptop Bags') return '24';
    if (categoryName === 'Mouse') return '35';
    if (categoryName === 'Keyboards') return '18';
    if (categoryName === 'Chargers') return '100+';
    return '15+';
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SLIDER BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#121212] via-slate-950 to-blue-950 text-white py-20 lg:py-28 transition-all">
        
        {/* Subtle grid layout overlays */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0057D9_1.2px,transparent_1.2px)] [background-size:20px_20px]"></div>
        
        {/* Colorful dynamic glow halos */}
        <div className="absolute top-1/4 -left-36 h-96 w-96 rounded-full bg-[#0057D9]/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-36 h-96 w-96 rounded-full bg-[#FF6B00]/25 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & High-converting copy */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 bg-[#0057D9]/20 border border-[#0057D9]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300">
                <Sparkles className="h-4 w-4 text-[#FF6B00] animate-pulse" />
                <span className="uppercase tracking-wider">Your Authorized Eswatini Tech Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Your Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#0057D9] to-[#FF6B00]">
                  Electronics Store
                </span> <br className="hidden sm:inline"/>
                in Eswatini
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
                Retail & Wholesale Supplier of Laptops, Computers, Printers, Gaming Consoles and Technology Accessories. Positioned on Somhlolo Road, Mbabane. High durability, local warranties.
              </p>

              {/* Action Buttons required: Shop Products, Request Wholesale Quote, Contact Us */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <button
                  id="hero-shop-products"
                  onClick={() => {
                    onCategoryFilterChange('All');
                    onTabChange('shop');
                  }}
                  className="bg-[#0057D9] hover:bg-[#0046b0] text-white px-7 py-3.5 rounded-xl font-bold flex items-center space-x-2 shadow-lg shadow-[#0057D9]/25 hover:shadow-[#0057D9]/40 transition transform active:scale-98 cursor-pointer"
                >
                  <span>Shop Products</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  id="hero-request-wholesale"
                  onClick={() => onTabChange('wholesale')}
                  className="bg-transparent hover:bg-white/5 text-white border-2 border-white/20 hover:border-white px-7 py-3.5 rounded-xl font-bold transition transform active:scale-98 cursor-pointer"
                >
                  <span>Request Wholesale Quote</span>
                </button>

                <button
                  id="hero-contact-desk"
                  onClick={() => onTabChange('contact')}
                  className="bg-[#121212] hover:bg-slate-900 border border-slate-800 text-white px-6 py-3.5 rounded-xl font-semibold transition cursor-pointer"
                >
                  <span>Contact Us</span>
                </button>
              </div>

              {/* Featured category tags in Hero slider */}
              <div className="pt-6 border-t border-slate-900/80 flex flex-wrap gap-x-6 gap-y-3.5 text-xs text-slate-400 font-mono">
                <div className="flex items-center space-x-1.5">
                  <Laptop className="h-4 w-4 text-[#0057D9]" />
                  <span>Latest Laptops</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>MacBooks</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>Printers</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Monitor className="h-4 w-4 text-[#FF6B00]" />
                  <span>Gaming Consoles</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Package className="h-4 w-4 text-sky-400" />
                  <span>Accessories</span>
                </div>
              </div>
            </div>

            {/* Right Column: Beautiful stacked mock-up of current hot deals */}
            <div className="lg:col-span-5 relative self-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0057D9] to-[#FF6B00] rounded-3xl rotate-2 scale-103 opacity-15 blur-xl"></div>
              
              <div className="relative bg-[#151e2e] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-emerald-400">MBABANE HQ</span>
                  </div>
                  <span>STOCK_STATE: ACTIVE</span>
                </div>

                <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden group border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80"
                    alt="Premium computer display Eswatini"
                    className="h-full w-full object-cover opacity-85 group-hover:scale-103 transition duration-700"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                    Showroom Special
                  </span>

                  <div className="absolute bottom-3 left-3 text-left">
                    <p className="text-[10px] text-slate-300 font-mono">AUTHORIZED PRICE</p>
                    <p className="text-xl font-bold font-mono text-white">E14,999</p>
                  </div>
                </div>

                <div className="text-left space-y-1.5">
                  <h3 className="text-base font-bold text-white line-clamp-1">HP EliteBook 840 G8 Corporate Notebook</h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Designed for heavy academic and corporate workloads in Eswatini. High security chip, aluminum casing, 16GB RAM, backed by a 24-month local warranty.
                  </p>
                  
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-mono">12 Units Immediate Pickup</span>
                    <button
                      id="hero-inspect-instant"
                      onClick={() => {
                        const hp = products.find(p => p.id === 'p1');
                        if (hp) onOpenProductDetail(hp);
                        else {
                          onCategoryFilterChange('Laptops');
                          onTabChange('shop');
                        }
                      }}
                      className="text-white hover:text-[#FF6B00] font-bold underline flex items-center space-x-1"
                    >
                      <span>Check Product</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES (Static & Interactive 15 Cards with Images, dynamic counts and view buttons) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="home-categories">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-[#0057D9] dark:text-blue-400 text-xs font-bold uppercase tracking-wider block font-mono">Certified Warehouses</span>
            <h2 className="text-3xl font-black text-[#121212] dark:text-white mt-1 uppercase tracking-tight">Explore Technology Classifications</h2>
          </div>
          <p className="text-slate-500 text-xs md:max-w-md mt-2 md:mt-0 leading-relaxed font-light">
            We store Eswatini's largest direct imports. Click any dynamic category tile below to browse live stocks, check components, or download customized pricing lists.
          </p>
        </div>

        {/* 15 Dynamic and beautiful cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categoriesList.map((cat) => {
            const count = getProductCount(cat.name, cat.dbCategory);
            return (
              <div
                id={`cat-card-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                key={cat.name}
                onClick={() => {
                  onCategoryFilterChange(cat.dbCategory);
                  onTabChange('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#0057D9] transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:scale-102"
              >
                
                {/* Category Cover Picture with overlay */}
                <div className="relative h-28 bg-slate-100 overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={`${cat.name} Briteman catalog`} 
                    className="h-full w-full object-cover group-hover:scale-104 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Floating Icon accent */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 p-1.5 rounded-lg border dark:border-slate-800">
                    {cat.icon}
                  </div>

                  {/* Stock counter label */}
                  <div className="absolute bottom-2 left-3 text-left">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FF6B00]">
                      {count === '100+' || count === '12' || count === '24' || count === '35' ? count : `${count} Active line`}
                    </span>
                  </div>
                </div>

                {/* Info and View Products button */}
                <div className="p-4 text-left flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0057D9] transition line-clamp-1">{cat.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 leading-normal font-light">{cat.tagline}</p>
                  </div>
                  
                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#0057D9] dark:text-blue-400 font-semibold group-hover:text-[#FF6B00] transition">
                    <span>View Products</span>
                    <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (New Arrivals, Best Sellers, Featured Deals, Wholesale Specials) */}
      <section className="bg-slate-100 dark:bg-slate-950/40 py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs bg-[#FF6B00]/10 text-[#FF6B00] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Special Showroom Highlight</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 uppercase tracking-tight">Featured Hardware Showcase</h2>
            </div>

            {/* Segments Nav tabs for the 4 lists */}
            <div className="flex flex-wrap gap-1.5 bg-white dark:bg-slate-900/80 p-1 rounded-xl shadow-sm border border-slate-205 dark:border-slate-800">
              {[
                { id: 'arrivals', label: 'New Arrivals' },
                { id: 'bestsellers', label: 'Best Sellers' },
                { id: 'deals', label: 'Featured Deals' },
                { id: 'wholesale', label: 'Wholesale Specials' }
              ].map((tab) => (
                <button
                  id={`home-seg-tab-${tab.id}`}
                  key={tab.id}
                  onClick={() => setFeaturedSegment(tab.id as any)}
                  className={`text-xs px-3.5 py-2 rounded-lg font-bold transition cursor-pointer ${
                    featuredSegment === tab.id
                      ? 'bg-[#0057D9] text-white'
                      : 'text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active catalog label info */}
          <div className="mb-4 text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]"></span>
            <span>Displaying: <b className="text-slate-700 dark:text-white">{activeSegmentLabel}</b></span>
          </div>

          {/* Grid of beautifully designed product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeSegmentProducts.map((p) => {
              const hasDiscount = p.originalPrice && p.originalPrice > p.price;
              return (
                <div
                  id={`home-feat-card-${p.id}`}
                  key={p.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  {/* Card top banner image */}
                  <div 
                    className="relative h-44 bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer"
                    onClick={() => onOpenProductDetail(p)}
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    
                    {/* Condition badge */}
                    <span className={`absolute top-2.5 left-2.5 text-[9px] uppercase font-mono font-black px-2.5 py-0.5 rounded-md text-white ${
                      p.condition === 'New' ? 'bg-[#0057D9]' : 'bg-amber-500'
                    }`}>
                      {p.condition}
                    </span>

                    {/* Saving Tag if discount is there */}
                    {hasDiscount && (
                      <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[8.5px] uppercase font-mono font-bold px-2 py-0.5 rounded-md">
                        E{((p.originalPrice ?? 0) - p.price).toLocaleString()} Off
                      </span>
                    )}
                  </div>

                  {/* Body elements */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9.5px] font-mono uppercase font-extrabold text-slate-400 tracking-wider">
                          {p.brand} | {p.category}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">{p.sku.split('-')[0]}</span>
                      </div>

                      <h3 
                        onClick={() => onOpenProductDetail(p)}
                        className="font-bold text-slate-900 dark:text-white text-sm sm:text-base hover:text-[#0057D9] transition line-clamp-1 cursor-pointer"
                        title={p.name}
                      >
                        {p.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 space-y-3">
                      
                      {/* Price matrix and stock limits */}
                      <div className="flex justify-between items-baseline leading-none">
                        <div>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through mr-1 font-mono">
                              E{p.originalPrice?.toLocaleString()}
                            </span>
                          )}
                          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                            E{p.price.toLocaleString()}
                          </span>
                        </div>

                        <span className={`text-[10px] font-bold flex items-center space-x-1 ${
                          p.stock > 5 ? 'text-emerald-500' : p.stock > 0 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            p.stock > 5 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                          }`}></span>
                          <span>{p.stock > 0 ? `${p.stock} units` : 'Sold out'}</span>
                        </span>
                      </div>

                      {/* Required Actions: Add to Cart & WhatsApp Inquiry */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <button
                          id={`home-add-cart-${p.id}`}
                          onClick={() => onAddToCart(p)}
                          disabled={p.stock === 0}
                          className="bg-[#0057D9] hover:bg-[#0046b0] text-white py-2 rounded-xl font-bold transition flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-40"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        
                        <a
                          id={`home-wa-inquire-${p.id}`}
                          href={generateWhatsAppInquiryUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-slate-750 py-2 rounded-xl font-extrabold transition flex items-center justify-center space-x-1"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      {/* Buy Direct checkout shortcut */}
                      <button
                        id={`home-buy-direct-${p.id}`}
                        onClick={() => onBuyNow(p)}
                        className="w-full bg-[#121212] hover:bg-slate-800 text-white font-mono uppercase text-[10px] font-bold tracking-wider py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Buy Directly (Checkout)
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <button
              id="view-full-store-button"
              onClick={() => {
                onCategoryFilterChange('All');
                onTabChange('shop');
              }}
              className="inline-flex items-center space-x-2 bg-white dark:bg-slate-900 hover:border-[#0057D9] text-[#0057D9] dark:text-blue-400 border border-slate-300 dark:border-slate-800 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all"
            >
              <span>Explore Eswatini full database ({products.length} models)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. BRANDS WE SELL (Horizontal showcase and active filters) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center md:text-left mb-6">
          <span className="text-xs bg-[#0057D9]/10 text-[#0057D9] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">AUTHORIZED DISTRIBUTION</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">Licensed Brands We Distribute</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Authorized dealer. Click any brand logo badge to filter models and check warranties instantly.</p>
        </div>

        {/* Brand visual tags list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {BRANDS.map((b) => (
            <div
              id={`brand-tag-${b.name.toLowerCase()}`}
              key={b.name}
              onClick={() => {
                onBrandFilterChange(b.name);
                onTabChange('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3.5 rounded-2xl flex flex-col justify-center items-center text-center cursor-pointer shadow-sm hover:border-[#FF6B00] hover:scale-103 transition-all duration-300 group"
            >
              {b.logo ? (
                <div className="h-8 w-20 flex items-center justify-center mb-1">
                  <img src={b.logo} alt={b.name} className="max-h-7 max-w-full object-contain" />
                </div>
              ) : null}
              <span className="font-extrabold font-display leading-tight text-[#121212] dark:text-white text-base group-hover:text-[#FF6B00] uppercase tracking-wide">
                {b.name}
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-medium group-hover:text-amber-500 mt-0.5">{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE BRITEMAN SERVICES (8 Specific modules required) */}
      <section className="bg-[#121212] text-white py-16 text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-2xl text-left mb-12">
            <span className="text-[#FF6B00] text-xs font-mono font-bold tracking-widest uppercase block">Uncompromising Swazi Quality</span>
            <h2 className="text-3xl font-black uppercase mt-1 leading-tight tracking-tight">Why Eswatini Enterprises Rely On Briteman</h2>
            <p className="text-xs text-slate-450 mt-2 font-light leading-relaxed">
              Serving the kingdom from Mbabane showroom, we construct highly durable, compliant computing and backup portfolios verified by international IT frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFactors.map((tf, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-start space-x-3.5 hover:border-slate-700 hover:scale-101 transition-all"
              >
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 shrink-0">
                  {tf.icon}
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-bold text-sm text-white font-display tracking-tight">{tf.title}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed font-light">{tf.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. PROMOTIONAL BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-left mb-8">
          <span className="text-xs bg-[#0057D9]/10 text-[#0057D9] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Specialized Bundles</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 uppercase tracking-tight">Active Promotions & Packages</h2>
        </div>

        {/* Grid of four specific promotional banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Promo 1: Student Laptop Packages */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-3">
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">UNESWA & Limkokwing Special</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight">Student Laptop Packages</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Get certified HP EliteBook or Dell Latitude notebooks preloaded with Microsoft Office configurations and student anti-virus. Show your academic ID and secure customizable payment vouchers starting at friendly local prices.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs text-[#0057D9] font-mono font-bold">● Prices start: E7,500</span>
              <button 
                id="promo-student-cta"
                onClick={() => onTabChange('contact')}
                className="bg-[#0057D9] hover:bg-[#0046b0] text-white text-xs px-4 py-2 font-bold rounded-lg transition"
              >
                Inquire Student Promo
              </button>
            </div>
          </div>

          {/* Promo 2: Business IT Packages */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-slate-905 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-purple-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-3">
              <span className="text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Corporate & Small Enterprises</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight">Business IT Packages</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Outfitting offices with high efficiency SFF desktops, cartridge-free Epson print networks, and heavy-duty APC battery backup. Tailored packages mapped directly to your administrative budget schedules.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs text-[#8b5cf6] font-mono font-bold">● Complete office bundles from E15,000</span>
              <button 
                id="promo-business-cta"
                onClick={() => onTabChange('wholesale')}
                className="bg-[#8b5cf6] hover:bg-purple-700 text-white text-xs px-4 py-2 font-bold rounded-lg transition"
              >
                Request Corporate Plan
              </button>
            </div>
          </div>

          {/* Promo 3: Printer Promotions */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-3">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">High volume printing</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight">Printer Ink Tank Specials</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Upgrade to a high yield Epson EcoTank L3250 or Canon Pixma G3411 with a full set of replacement ink bottles included. Skip cartridge fees forever and scan documents beautifully.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs text-emerald-600 font-mono font-bold">● 100% Genuine Epson & Canon lists</span>
              <button 
                id="promo-printer-cta"
                onClick={() => {
                  onCategoryFilterChange('Printers');
                  onTabChange('shop');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 font-bold rounded-lg transition"
              >
                Browse Ink Tank catalog
              </button>
            </div>
          </div>

          {/* Promo 4: Back-to-School Specials */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-905 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition">
            <div className="space-y-3">
              <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-350 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Seasonal inventory clearance</span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight">Back-to-School Specials</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Outfitting school labs and computer classrooms. Specialized vouchers for refurbished Grade-A MacBooks, portable retro gaming consoles, universal power supplies, and keyboards.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs text-amber-600 font-mono font-bold">● Special discount on school orders</span>
              <button 
                id="promo-school-cta"
                onClick={() => onTabChange('wholesale')}
                className="bg-[#FF6B00] hover:bg-[#e05c00] text-white text-xs px-4 py-2 font-bold rounded-lg transition"
              >
                Inquire School Vouchers
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-slate-50 dark:bg-slate-950/20 py-16 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left mb-10 max-w-2xl">
            <span className="text-xs bg-[#0057D9]/10 text-[#0057D9] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">Kingdom-wide trust</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 uppercase tracking-tight">Stories from Briteman Customers</h2>
            <p className="text-xs text-slate-500 mt-1">Real ratings and stories from individuals, educational institutions, and businesses in Mbabane and Manzini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Principal Mandla Dlamini',
                role: 'Procurement Board, Manzini School Block',
                rating: 5,
                text: 'We bought 15 HP corporate notebooks and 2 heavy duty printers for our administration desk. Briteman printed the quotations quickly, complied fully with Eswatini vouchers, and even delivered the entire package directly to our gates.',
                desc: 'School Procurement Customer'
              },
              {
                name: 'Sibongile Simelane',
                role: 'Managing Director, Swazi Tech Edge Ltd',
                rating: 5,
                text: 'Load-shedding was interrupting our server database daily. The guys at Briteman recommended our APC BVX 1200VA UPS backup kit. Our fiber router and server workstations are fully operational. Authentic licenses, extremely friendly local tech assistance!',
                desc: 'Corporate IT Client'
              },
              {
                name: 'Thabo Mamba',
                role: 'Student at Limkokwing University',
                rating: 5,
                text: 'As a graphics student, I needed a MacBook Air on severe budget limits. Briteman supplied me with a certified refurbished M1 MacBook. It works flawlessly and includes half a year of local Mbabane warranty. Absolutely incredible store!',
                desc: 'Retail Student shopper'
              }
            ].map((testi, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-905 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="space-y-3">
                  {/* Visual Star rating block */}
                  <div className="flex text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-355 leading-relaxed font-light italic">
                    "{testi.text}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-855 flex items-center space-x-3 text-left">
                  <div className="h-10 w-10 rounded-full bg-[#0057D9]/10 text-[#0057D9] dark:bg-blue-400/10 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {testi.name.split(' ')[0][0]}{testi.name.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{testi.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{testi.role}</p>
                    <span className="text-[9px] bg-[#FF6B00]/10 text-[#FF6B00] px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block font-mono">
                      {testi.desc}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION (Need Technology Solutions for Your Business? Quote & Sales team CTAs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="bg-gradient-to-r from-blue-950 via-[#0057D9] to-blue-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          {/* Internal ambient stars overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs bg-[#FF6B00]/30 text-[#FF6B00] px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-widest font-mono">
                Corporate Institutional Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase leading-tight tracking-tight">
                Need Technology Solutions for Your Business?
              </h2>
              <p className="text-sm text-slate-205 max-w-2xl font-light leading-relaxed">
                We design hardware solutions for school laboratories, national ministries, clinics, and workspaces. Get transparent tax invoices, strict tender bid compliance, and direct delivery.
              </p>
            </div>

            {/* Buttons required: Request Quote, Contact Sales Team */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <button
                id="cta-request-quote"
                onClick={() => onTabChange('wholesale')}
                className="bg-white hover:bg-slate-100 text-[#0057D9] px-6 py-3.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition text-center shadow-lg cursor-pointer"
              >
                Request Custom Quote
              </button>

              <button
                id="cta-contact-sales"
                onClick={() => onTabChange('contact')}
                className="bg-transparent hover:bg-white/10 border-2 border-white/40 hover:border-white text-white px-6 py-3.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition text-center cursor-pointer"
              >
                Contact Sales Team
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
