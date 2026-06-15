import React from 'react';
import { ArrowRight, Laptop, Monitor, FileText, ShoppingBag, Landmark, Award, ShieldCheck, Truck, Sparkles } from 'lucide-react';

interface HeroProps {
  onTabChange: (tab: string) => void;
}

export default function Hero({ onTabChange }: HeroProps) {
  const highlights = [
    {
      icon: <Laptop className="h-6 w-6 text-primary" />,
      title: "Business & Study Laptops",
      desc: "Authorized dealer of Hewlett Packard (HP), Dell, and Lenovo professional lines starting at friendly prices."
    },
    {
      icon: <Monitor className="h-6 w-6 text-accent" />,
      title: "Gaming & MacBooks",
      desc: "High end performance specs, ASUS ROG rigs, plus M3 MacBooks with local Mbabane store warranties."
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-500" />,
      title: "Office Printers & UPS",
      desc: "Epson EcoTank and Canon wireless systems. Heavy duty APC UPS battery backups to defeat load-shedding."
    }
  ];

  const features = [
    { icon: <Award className="h-5 w-5 text-accent" />, label: "100% Genuine Products", sub: "Direct brand distribution" },
    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, label: "Local Mbabane Warranty", sub: "Immediate exchange support" },
    { icon: <Truck className="h-5 w-5 text-emerald-500" />, label: "Fast Eswatini Delivery", sub: "Straight to your doorstep" },
    { icon: <Landmark className="h-5 w-5 text-indigo-500" />, label: "Govt & School Supplies", sub: "Official procurement billing" }
  ];

  const clientBrands = [
    { name: 'HP', logo: 'https://cdn.iconfinder.com/data/icons/social-media-2285/512/1_Hp_colored_svg_social-512.png' },
    { name: 'Dell', logo: 'https://cdn.iconfinder.com/data/icons/social-media-2285/512/1_Dell_colored_svg_social-512.png' },
    { name: 'Lenovo', logo: 'https://cdn.iconfinder.com/data/icons/social-media-auto-filled-lines-vol-2/434/lenovo-512.png' },
    { name: 'Apple', logo: 'https://cdn.iconfinder.com/data/icons/social-media-2285/512/1_Apple_colored_svg_social-512.png' },
    { name: 'Epson', logo: 'https://cdn.iconfinder.com/data/icons/academic-disciplines-color/64/art-design-technology-computer-electronics-printer-equipment-machine-office-stationery-utility-print-512.png' },
    { name: 'Canon', logo: 'https://cdn.iconfinder.com/data/icons/photo-video-color/64/camera-dslr-photography-lens-shutter-aperture-zoom-professional-equipment-technology-portable-photo-512.png' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white py-16 lg:py-24 transition-colors">
      
      {/* Abstract Tech Grid Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3056ff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Glowing atmospheric circles */}
      <div className="absolute top-1/4 -left-36 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-36 h-96 w-96 rounded-full bg-accent/20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Headline and Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-300">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Leading Electronics Retail & Wholesale in Eswatini</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-white">
              Your Trusted <br className="hidden sm:inline"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-accent">
                Electronics Store
              </span> <br />
              in Eswatini
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl font-light">
              Official supplier of modern laptops, desktop computers, Canon/Epson ink-tank printers, APC power backup units, high-speed storage drives, and premium gaming rigs. Serving retail shoppers and corporate procurement with best pricing.
            </p>

            {/* CTA panel */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero-shop-cta"
                onClick={() => onTabChange('shop')}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-semibold flex items-center space-x-2 shadow-lg shadow-primary/30 hover:shadow-primary/45 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Shop Products</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                id="hero-wholesale-cta"
                onClick={() => onTabChange('wholesale')}
                className="bg-transparent hover:bg-white/5 text-white border-2 border-white/20 hover:border-white px-8 py-3.5 rounded-xl font-semibold flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Request Wholesale Quote</span>
              </button>

              <button
                id="hero-contact-cta"
                onClick={() => onTabChange('contact')}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-xl font-semibold flex items-center space-x-2 shadow-lg shadow-accent/20 transition cursor-pointer"
              >
                <span>Contact Us</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              <div>
                <span className="block text-2xl font-black text-accent">100%</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">Genuine Stock</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-blue-400">Eswatini</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">Wide Delivery</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-emerald-400">Mbabane</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">Physical Pickup</span>
              </div>
            </div>
          </div>

          {/* Premium visuals side */}
          <div className="lg:col-span-5 relative self-center">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Back decoration */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-3xl rotate-3 scale-102 opacity-20 blur-lg"></div>
              
              {/* Main tech mockup product card stack */}
              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">stock_status: MBABANE_MAIN</span>
                </div>

                {/* Simulated product photo with overlays */}
                <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-950 mb-6 group border border-slate-800/80">
                  <img
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80"
                    alt="Premium EliteBook laptop mockup"
                    className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Floating badge */}
                  <span className="absolute top-3 left-3 bg-accent text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    HOT DEAL
                  </span>
                  
                  {/* Floating Price tag */}
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-slate-400 text-xs line-through block">E17,500</span>
                    <span className="text-xl font-bold font-display text-white">E14,999</span>
                  </div>
                </div>

                <div className="text-left space-y-2">
                  <h3 className="text-lg font-bold text-white">HP EliteBook 840 G8 Business Laptop</h3>
                  <p className="text-xs text-slate-400">Core i7, 16GB RAM, 512GB NVMe SSD, 14" IPS Anti-Glare. Best choice for Mbabane corporate offices and University research.</p>
                  
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-xs text-emerald-400 font-semibold">● 12 Units available for Immediate Pickup</span>
                    <button
                      id="hero-buy-btn"
                      onClick={() => onTabChange('shop')}
                      className="bg-primary/20 hover:bg-primary border border-primary/40 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                    >
                      Inspect Specs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Brands section */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest text-center mb-6">
            Authorized Brands We Distribute
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
            {clientBrands.map((b) => (
              <div key={b.name} className="flex items-center space-x-2 text-slate-300">
                <img src={b.logo} alt={b.name} className="h-6 object-contain filter invert bg-transparent opacity-90" />
                <span className="font-semibold font-display tracking-wider text-sm">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Core Strengths */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-start space-x-4 hover:border-slate-700/80 transition text-left">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">{f.label}</h4>
                <p className="text-xs text-slate-400 mt-1">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
