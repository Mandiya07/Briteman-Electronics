import React, { useState } from 'react';
import { X, ShoppingCart, Scale, CheckCircle2, FileText, DollarSign, Sparkles, Check, Info, ShieldAlert } from 'lucide-react';
import { Product } from '../types';

interface CompareDrawerProps {
  compareProducts: Product[];
  onRemoveFromCompare: (p: Product) => void;
  onClearCompare: () => void;
  onAddToCart: (p: Product) => void;
  onClose: () => void;
}

type CompareTab = 'specs' | 'prices' | 'features';

export default function CompareDrawer({
  compareProducts,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  onClose
}: CompareDrawerProps) {
  const [activeTab, setActiveTab] = useState<CompareTab>('specs');

  if (compareProducts.length === 0) return null;

  // Compile unique lists of specs keys from compared products
  const specKeys = ['Processor', 'RAM', 'Storage', 'Display', 'Graphics', 'OS', 'Battery', 'Functions', 'Print Speed'];

  // Eswatini standard VAT rate is 15%
  const VAT_RATE = 0.15;

  const calculateExclVat = (price: number) => {
    return Math.round(price / (1 + VAT_RATE));
  };

  // Wholesale bulk tier calculation helper for realistic quotes representation
  const getWholesaleTierQuote = (price: number, quantity: number) => {
    const discount = quantity >= 10 ? 0.85 : quantity >= 5 ? 0.90 : 0.95;
    return Math.round(price * discount);
  };

  return (
    <div id="compare-drawer-overlay" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-100 dark:bg-slate-900 border-t-2 border-primary shadow-2xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto transition-transform duration-500">
      
      {/* Drawer header banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-slate-300 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-left">
          <div className="bg-primary/20 p-2 rounded-xl text-primary font-bold">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span>Electronics Comparison Centre</span>
              <span className="bg-primary text-white text-xs px-2.5 py-0.5 rounded-full font-mono">{compareProducts.length} Selected</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Match specifications, prices, and high-tier hardware capability side-by-side.</p>
          </div>
        </div>

        {/* Comparison Aspect Toggles (Specs / Prices / Features) */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl space-x-1 w-full sm:w-auto self-center">
          <button
            id="compare-tab-specs"
            onClick={() => setActiveTab('specs')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
              activeTab === 'specs'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            <span className="whitespace-nowrap">Specifications</span>
          </button>
          
          <button
            id="compare-tab-prices"
            onClick={() => setActiveTab('prices')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
              activeTab === 'prices'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-705'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5 mr-1" />
            <span className="whitespace-nowrap">Prices &amp; Value</span>
          </button>
          
          <button
            id="compare-tab-features"
            onClick={() => setActiveTab('features')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
              activeTab === 'features'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-705'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            <span className="whitespace-nowrap">Highlights</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0 self-end sm:self-auto">
          <button
            id="clear-all-compare"
            onClick={onClearCompare}
            className="text-xs text-slate-500 hover:text-red-500 font-bold cursor-pointer underline decoration-dotted"
          >
            Clear List
          </button>
          
          <button
            id="close-compare-drawer"
            onClick={onClose}
            className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300 transition text-slate-905 dark:text-white cursor-pointer"
            title="Minimize drawer"
          >
            <X className="h-4.2 w-4.2" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Dynamic comparison aspect descriptions (Left column) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <div className="p-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl">
            {activeTab === 'specs' && (
              <>
                <span className="text-xs font-black text-primary block uppercase tracking-wider">Specs Comparison Matrix</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Analyze processing power, storage speed, and screen sizes. Essential for educational institutions matching tender checklists.
                </p>
                <div className="mt-3 flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Showing crucial metrics</span>
                </div>
              </>
            )}

            {activeTab === 'prices' && (
              <>
                <span className="text-xs font-black text-orange-500 block uppercase tracking-wider">Commercial Pricing analysis</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Review calculated VAT options and estimated wholesale tier prices. Perfect for bulk purchase planning in clinics, classrooms, and offices.
                </p>
                <div className="mt-3 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-[10px] text-slate-400 space-y-1">
                  <p>• Eswatini VAT rate: 15%</p>
                  <p>• Wholesale 5+ Tier: 10% Off</p>
                  <p>• Wholesale 10+ Tier: 15% Off</p>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <>
                <span className="text-xs font-black text-accent block uppercase tracking-wider">Tech Highpoints &amp; Features</span>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Compare product specialities, unique features, and intended targets. Find the ideal configuration designed specifically for your workload.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="bg-slate-150 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">WiFi Print</span>
                  <span className="bg-slate-150 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">Surge AVR</span>
                  <span className="bg-slate-150 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">SSD Type</span>
                  <span className="bg-slate-150 dark:bg-slate-800 text-[9px] px-2 py-0.5 rounded text-slate-650 dark:text-slate-350">M3 Silicon</span>
                </div>
              </>
            )}
          </div>
          
          <div className="text-[10px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-dashed dark:border-slate-800">
            * Formal quotes can be saved and edited via the Wholesale Portal. Direct stock verification available on WhatsApp.
          </div>
        </div>

        {/* Dynamic products list side-by-side */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {compareProducts.map((p) => {
            const exclVat = calculateExclVat(p.price);
            const vatAmount = p.price - exclVat;
            const discountPercent = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
            
            return (
              <div
                id={`compare-item-${p.id}`}
                key={p.id}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 relative text-left"
              >
                {/* Remove button */}
                <button
                  id={`remove-compare-${p.id}`}
                  onClick={() => onRemoveFromCompare(p)}
                  className="absolute top-3 right-3 p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full cursor-pointer transition z-10"
                  title="Remove product"
                >
                  <X className="h-3.2 w-3.2" />
                </button>

                {/* mini product description */}
                <div className="flex items-center space-x-3">
                  <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-100 dark:border-slate-800" />
                  <div className="min-w-0 pr-4">
                    <span className="text-[9px] font-extrabold text-primary block uppercase font-mono tracking-wider">{p.brand} | {p.category}</span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate" title={p.name}>{p.name}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono">{p.sku}</span>
                  </div>
                </div>

                {/* TAB 1: SPECIFICATION DETAIL */}
                {activeTab === 'specs' && (
                  <div className="space-y-2 flex-1 text-xs pt-2 border-t dark:border-slate-800">
                    <div className="flex justify-between pb-1 border-b dark:border-slate-850">
                      <span className="text-slate-400">Condition:</span>
                      <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wide text-[10px]">{p.condition}</span>
                    </div>
                    
                    <div className="flex justify-between pb-1 border-b dark:border-slate-850">
                      <span className="text-slate-400">Local Warranty:</span>
                      <span className="font-semibold text-slate-800 dark:text-white text-right leading-tight line-clamp-1">{p.warranty}</span>
                    </div>

                    {specKeys.map(key => {
                      const val = p.specs[key];
                      if (!val) return null;
                      return (
                        <div key={key} className="pb-1 border-b dark:border-slate-850 text-left">
                          <span className="text-[10px] text-slate-400 block font-semibold">{key}:</span>
                          <span className="font-semibold text-slate-800 dark:text-white text-[11px] line-clamp-2 leading-tight">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TAB 2: PRICING COMPARISON */}
                {activeTab === 'prices' && (
                  <div className="space-y-2.5 flex-1 text-xs pt-2 border-t dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border dark:border-slate-850">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Standard Retail</span>
                        {discountPercent > 0 && (
                          <span className="text-[9px] bg-red-500 text-white font-mono rounded px-1.5 font-bold">SAVE {discountPercent}%</span>
                        )}
                      </div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-xl font-mono font-black text-slate-900 dark:text-white">E{p.price.toLocaleString()}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs line-through text-slate-400">E{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Includes standard retail markup</span>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="space-y-1.5 px-1 py-0.5 text-[11px]">
                      <div className="flex justify-between pb-1 border-b border-dashed dark:border-slate-800">
                        <span className="text-slate-400">Excl. VAT (15%):</span>
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">E{exclVat.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-dashed dark:border-slate-800">
                        <span className="text-slate-400">Calculated VAT:</span>
                        <span className="font-mono text-slate-500">E{vatAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pb-1 border-b border-dashed dark:border-slate-800">
                        <span className="text-slate-400">Invoiced Retail (Incl. VAT):</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">E{p.price.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Wholesale Projections */}
                    <div className="bg-primary/5 dark:bg-primary/10 p-2.5 rounded-lg border border-primary/20 space-y-1.5">
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider block">Wholesale Bulk Forecast</span>
                      
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Tier 1 (5 - 9 units - 10% Off):</span>
                        <span className="font-mono font-bold text-primary">E{getWholesaleTierQuote(p.price, 5).toLocaleString()}/ea</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Tier 2 (10+ units - 15% Off):</span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">E{getWholesaleTierQuote(p.price, 10).toLocaleString()}/ea</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: FEATURES & CAPABILITIES */}
                {activeTab === 'features' && (
                  <div className="space-y-2.5 flex-1 text-xs pt-2 border-t dark:border-slate-800">
                    
                    {/* Unique Product Capabilities */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Primary Target Use:</span>
                      <p className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 italic">
                        {p.category === 'Laptops' || p.category === 'MacBooks' || p.category === 'Desktop Computers'
                          ? p.tags.includes('Gaming') 
                            ? 'Designed for intensive 3D graphics rendering, video editing, and software gaming processes.'
                            : 'Perfect for business, government workspace tasks, student research, and office spreadsheets.'
                          : p.category === 'Printers'
                            ? 'Optimized for cartridge-free bulk prints, document duplication, and scanned assignments.'
                            : p.category === 'UPS Systems'
                              ? 'Essential for maintaining continuous network, server, and router connection during load-shedding.'
                              : 'High productivity tier designed to enhance active workloads and local storage line backups.'}
                      </p>
                    </div>

                    {/* Check list of features */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Standard Capabilities Checklist:</span>
                      <div className="space-y-1 text-[11px]">
                        {[
                          { feat: 'Direct Factory Genuine License', ok: true },
                          { feat: 'Physical Diagnostic Hardware warranty', ok: true },
                          { feat: p.condition === 'New' ? 'Factory Brand New Seal' : 'Grade A Certified Pre-Owned Diagnostics', ok: true },
                          { feat: p.availability === 'In Stock' ? 'Mbabane Showroom In-Stock (Immediate Pickup)' : 'Limited Stock / Reserves Check Required', ok: p.availability !== 'Out of Stock' }
                        ].map((f, idx) => (
                          <div key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-500 font-bold mt-0.5">•</span>
                            <span className={f.ok ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through'}>{f.feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags matching */}
                    <div className="pt-2">
                      <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map(t => (
                          <span key={t} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] px-1.5 py-0.5 rounded-md font-medium">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to cart action direct inside compare page */}
                <button
                  id={`compare-add-cart-${p.id}`}
                  onClick={() => onAddToCart(p)}
                  disabled={p.stock === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                    p.stock === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-hover text-white shadow-sm'
                  }`}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span>{p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
