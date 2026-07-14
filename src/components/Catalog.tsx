import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, Check, RefreshCw, ShoppingCart, 
  MessageSquare, Plus, CheckSquare, Eye, Share2, Info, X, 
  ChevronDown, CheckCircle2, Zap, Sparkles, Cpu, HardDrive, Cpu as ProcessorIcon, LayoutGrid
} from 'lucide-react';
import { Product, CartItem } from '../types';
import { BRANDS, CATEGORIES } from '../data/products';

interface CatalogProps {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  onAddToCart: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  selectedCompare: Product[];
  onToggleCompare: (p: Product) => void;
  onOpenProductDetail: (p: Product) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBuyNow: (p: Product) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  recentlyViewed?: Product[];
}

export default function Catalog({
  products,
  cart,
  wishlist,
  onAddToCart,
  onAddToWishlist,
  selectedCompare,
  onToggleCompare,
  onOpenProductDetail,
  searchQuery,
  onSearchChange,
  onBuyNow,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  recentlyViewed = []
}: CatalogProps) {
  // Advanced smart filter states
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [minPrice, setMinPrice] = useState<number>(300);
  const [selectedRam, setSelectedRam] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All'); // All, In Stock, Low Stock, Out of Stock
  const [selectedProductType, setSelectedProductType] = useState<string>('All'); // All, Business Laptop, Student Laptop, Gaming, Home Office, Backup Power, Storage, Accessories
  const [selectedStorage, setSelectedStorage] = useState<string>('All'); // All, 64GB, 256GB, 512GB, 1TB, 2TB
  const [selectedProcessor, setSelectedProcessor] = useState<string>('All'); // All, Intel Core i3, Intel Core i5, Intel Core i7, Intel Core i9, Apple Silicon, Other

  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Field-specific search inputs
  const [isAdvancedSearchExpanded, setIsAdvancedSearchExpanded] = useState<boolean>(false);
  const [advSearchName, setAdvSearchName] = useState<string>('');
  const [advSearchBrand, setAdvSearchBrand] = useState<string>('');
  const [advSearchCategory, setAdvSearchCategory] = useState<string>('');
  const [advSearchModel, setAdvSearchModel] = useState<string>('');

  // Predefined lists
  const ramOptions = ['All', '4GB', '8GB', '16GB', 'Unified'];
  const storageOptions = ['All', '64GB', '256GB', '512GB', '1TB', '2TB'];
  const processorOptions = ['All', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Apple Silicon', 'Other'];
  const availabilityOptions = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
  
  const productTypeOptions = [
    { label: 'All Types', value: 'All' },
    { label: 'Business Systems', value: 'Business' },
    { label: 'Student & Academic', value: 'Student' },
    { label: 'High Performance & Gaming', value: 'Gaming' },
    { label: 'Printers & Off-Office', value: 'Office' },
    { label: 'Backup & Surge Protections', value: 'UPS' },
    { label: 'Storage & Expansion', value: 'Storage' },
    { label: 'Accessories & Adapters', value: 'Accessories' }
  ];

  // Quick prompt suggestions search keywords
  const promptSuggestions = [
    { label: 'Core i7 EliteBook', query: 'EliteBook 840' },
    { label: 'EcoTank Smart Wifi', query: 'EcoTank' },
    { label: 'M3 MacBook Pro', query: 'M3' },
    { label: 'APC double backup', query: 'APC 1200' },
    { label: 'Seagate 2TB Drive', query: 'Seagate 2' }
  ];

  const handleQuickSuggestion = (query: string) => {
    onSearchChange(query);
    // Fill specific text filter as well if needed
    setAdvSearchName(query);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedCondition('All');
    setMinPrice(300);
    setMaxPrice(45000);
    setSelectedRam('All');
    setSelectedAvailability('All');
    setSelectedProductType('All');
    setSelectedStorage('All');
    setSelectedProcessor('All');
    setSortBy('featured');
    onSearchChange('');
    setAdvSearchName('');
    setAdvSearchBrand('');
    setAdvSearchCategory('');
    setAdvSearchModel('');
    setIsAdvancedSearchExpanded(false);
  };

  // Filter application logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Global Search Box Match
      const query = searchQuery.trim().toLowerCase();
      let matchesGlobalSearch = true;
      if (query) {
        const specsString = Object.entries(p.specs).map(([k, v]) => `${k}:${v}`).join(' ').toLowerCase();
        matchesGlobalSearch =
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          specsString.includes(query);
      }

      // 2. Advanced field-specific Search Box Match
      if (isAdvancedSearchExpanded) {
        if (advSearchName && !p.name.toLowerCase().includes(advSearchName.trim().toLowerCase())) {
          return false;
        }
        if (advSearchBrand && !p.brand.toLowerCase().includes(advSearchBrand.trim().toLowerCase())) {
          return false;
        }
        if (advSearchCategory && !p.category.toLowerCase().includes(advSearchCategory.trim().toLowerCase())) {
          return false;
        }
        if (advSearchModel && !p.sku.toLowerCase().includes(advSearchModel.trim().toLowerCase())) {
          return false;
        }
      }

      // 3. Category match
      const catMatch = selectedCategory === 'All' || p.category === selectedCategory;

      // 4. Brand match
      const brandMatch = selectedBrand === 'All' || p.brand === selectedBrand;

      // 5. Condition match
      const condMatch = selectedCondition === 'All' || p.condition === selectedCondition;

      // 6. Price range check
      const priceMatch = p.price >= minPrice && p.price <= maxPrice;

      // 7. RAM size check
      let ramMatch = true;
      if (selectedRam !== 'All') {
        const ramSpec = (p.specs['RAM'] || p.specs['Memory'] || '').toLowerCase();
        ramMatch = ramSpec.includes(selectedRam.toLowerCase());
      }

      // 8. Availability check
      let availabilityMatch = true;
      if (selectedAvailability !== 'All') {
        availabilityMatch = p.availability.toLowerCase() === selectedAvailability.toLowerCase();
      }

      // 9. Product Type Match based on tags and descriptions
      let productTypeMatch = true;
      if (selectedProductType !== 'All') {
        const typeLower = selectedProductType.toLowerCase();
        const pTags = (p.tags || []).map(t => t.toLowerCase());
        const pDesc = p.description.toLowerCase();
        productTypeMatch = 
          p.category.toLowerCase().includes(typeLower) || 
          pTags.some(t => t.includes(typeLower)) || 
          pDesc.includes(typeLower);
      }

      // 10. Storage specs check
      let storageMatch = true;
      if (selectedStorage !== 'All') {
        const specsVal = (p.specs['Storage'] || p.specs['Capacity'] || '').toLowerCase();
        storageMatch = specsVal.includes(selectedStorage.toLowerCase());
      }

      // 11. Processor specs check
      let processorMatch = true;
      if (selectedProcessor !== 'All') {
        const cpuSpec = (p.specs['Processor'] || '').toLowerCase();
        if (selectedProcessor === 'Intel Core i5') {
          processorMatch = cpuSpec.includes('i5');
        } else if (selectedProcessor === 'Intel Core i7') {
          processorMatch = cpuSpec.includes('i7');
        } else if (selectedProcessor === 'Intel Core i9') {
          processorMatch = cpuSpec.includes('i9');
        } else if (selectedProcessor === 'Apple Silicon') {
          processorMatch = cpuSpec.includes('apple') || cpuSpec.includes('m1') || cpuSpec.includes('m1') || cpuSpec.includes('m2') || cpuSpec.includes('m3');
        } else if (selectedProcessor === 'Other') {
          // Check other CPU listings
          processorMatch = !cpuSpec.includes('i5') && !cpuSpec.includes('i7') && !cpuSpec.includes('i9') && !cpuSpec.includes('apple') && !cpuSpec.includes('m1') && !cpuSpec.includes('m3');
        }
      }

      return matchesGlobalSearch && catMatch && brandMatch && condMatch && priceMatch && ramMatch && availabilityMatch && productTypeMatch && storageMatch && processorMatch;
    });
  }, [
    products, 
    searchQuery, 
    selectedCategory, 
    selectedBrand, 
    selectedCondition, 
    minPrice,
    maxPrice, 
    selectedRam,
    selectedAvailability,
    selectedProductType,
    selectedStorage,
    selectedProcessor,
    isAdvancedSearchExpanded,
    advSearchName,
    advSearchBrand,
    advSearchCategory,
    advSearchModel
  ]);

  // Sort logic applied on filtered list
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'alphabetical') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Default 'featured'
    return list;
  }, [filteredProducts, sortBy]);

  const generateWhatsAppUrl = (p: Product) => {
    const baseMessage = `Hi Briteman Electronics! I'm interested in inquiring about:
*Product:* ${p.name}
*SKU:* ${p.sku}
*Price:* E${p.price.toLocaleString()}
*Condition:* ${p.condition}

Please let me know if this is currently available in Manzini showroom. Thanks!`;
    return `https://wa.me/26876623733?text=${encodeURIComponent(baseMessage)}`;
  };

  const isInCart = (id: string) => {
    return cart.some(item => item.product.id === id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-dark-card border border-slate-150 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
        <div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono">BRITEMAN SERVICES STOCKLIST</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1.5">
            Institutional Electronics Database
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Configure system parameters, storage capacities, processors, and availability side-by-side. Save formal items to comparisons to build comprehensive tender-compliant quotes.
          </p>
        </div>

        <button
          id="global-reset-all"
          onClick={handleResetFilters}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shrink-0"
        >
          <RefreshCw className="h-3.8 w-3.8" />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* ADVANCED CATALOG SEARCH PANEL */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-left">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <Search className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-300">Catalog Query Engine</h3>
                <p className="text-xs text-slate-400">Search by Name, Manufacturer Brand, Category classification, or Model SKU</p>
              </div>
            </div>

            {/* Advanced toggle buttons */}
            <button
              id="toggle-adv-search"
              onClick={() => setIsAdvancedSearchExpanded(!isAdvancedSearchExpanded)}
              className={`text-xs px-3.5 py-1.8 rounded-xl font-extrabold transition flex items-center space-x-1.5 cursor-pointer border ${
                isAdvancedSearchExpanded 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{isAdvancedSearchExpanded ? 'Hide Advanced Fields' : 'Expand Advanced Fields (Specific Filters)'}</span>
            </button>
          </div>

          {/* Simple Global Search Area */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
            <div className="md:col-span-3 relative">
              <input
                id="search-main-catalog"
                type="text"
                placeholder="Type query terms, e.g., i7 ThinkCentre, eco-tank, APC UPS, 1TB SSD, Dell..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-900/60 text-white pl-4 pr-10 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary border border-white/5 placeholder-slate-500 font-medium text-xs sm:text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-3.5 p-0.5 bg-slate-800 hover:bg-slate-705 text-slate-400 rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            
            <button
              id="run-catalog-search"
              onClick={() => setIsAdvancedSearchExpanded(!isAdvancedSearchExpanded)}
              className="bg-primary hover:bg-primary-hover text-white rounded-xl py-3 text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Adjust Field-Search</span>
            </button>
          </div>

          {/* ADVANCED SECTION FOR SPECIFIC FIELDS */}
          {isAdvancedSearchExpanded && (
            <div className="pt-4 border-t border-white/5 space-y-4 animate-fadeIn">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">FIELD SPECIFIC MATCHERS:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Product Name Specific Matcher */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 font-mono">Model Name Matches</label>
                  <input
                    id="adv-search-name"
                    type="text"
                    placeholder="e.g. EliteBook 840"
                    value={advSearchName}
                    onChange={(e) => setAdvSearchName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* 2. Brand Specific Matcher */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 font-mono">Manufacturer Brand</label>
                  <input
                    id="adv-search-brand"
                    type="text"
                    placeholder="e.g. Epson"
                    value={advSearchBrand}
                    onChange={(e) => setAdvSearchBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* 3. Category Specific Matcher */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 font-mono">Category Specifics</label>
                  <input
                    id="adv-search-cat"
                    type="text"
                    placeholder="e.g. UPS Systems"
                    value={advSearchCategory}
                    onChange={(e) => setAdvSearchCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* 4. Model Number SKU Specific Matcher */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 font-mono">Model Code / SKU / Serial</label>
                  <input
                    id="adv-search-model"
                    type="text"
                    placeholder="e.g. HP-EB-840G8"
                    value={advSearchModel}
                    onChange={(e) => setAdvSearchModel(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button 
                  onClick={() => {
                    setAdvSearchName('');
                    setAdvSearchBrand('');
                    setAdvSearchCategory('');
                    setAdvSearchModel('');
                  }}
                  className="px-4 py-1.8 bg-white/5 border border-white/15 text-slate-400 rounded-lg hover:text-white"
                >
                  Clear Fields
                </button>
              </div>
            </div>
          )}

          {/* Quick suggestions shortcut pill */}
          <div className="flex items-center space-x-2 pt-2 text-left flex-wrap gap-y-2 text-xs">
            <span className="text-slate-450 text-[10px] uppercase tracking-wider font-extrabold font-mono">Popular hardware tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {promptSuggestions.map((s) => (
                <button
                  id={`suggest-pill-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
                  key={s.label}
                  onClick={() => handleQuickSuggestion(s.query)}
                  className="bg-white/10 hover:bg-primary border border-white/10 text-white rounded-full px-3 py-1 text-[11px] font-bold transition focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  #{s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR ADVANCED SMART FILTERS (Desktop) */}
        <div className="hidden lg:block space-y-6 bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left">
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="font-extrabold flex items-center space-x-2 text-slate-900 dark:text-white text-sm">
              <SlidersHorizontal className="h-4.2 w-4.2 text-primary" />
              <span>Smart Stock Filters</span>
            </span>
            <button
              id="reset-smart-sidebar"
              onClick={handleResetFilters}
              className="text-[11px] text-primary hover:text-accent font-bold flex items-center space-x-0.5 cursor-pointer underline hover:no-underline"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset List</span>
            </button>
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Electronics Group</h4>
            <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
              <button
                id={`cat-filter-all`}
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-1.8 rounded-xl text-xs transition font-semibold flex justify-between items-center ${
                  selectedCategory === 'All'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Stock Lines</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-400 font-mono">
                  {products.length}
                </span>
              </button>
              {CATEGORIES.map(cat => (
                <button
                  id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-1.8 rounded-xl text-xs transition font-semibold flex justify-between items-center ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono">
                    {products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Specific Brand Selector */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Manufacturer Brand</h4>
            <select
              id="brand-dropdown-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary border border-slate-205 dark:border-slate-800"
            >
              <option value="All">All Brands</option>
              {BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* 3. Availability Filter (EXCLUSIVE) */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800 text-xs">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Stock Availability</h4>
            <div className="grid grid-cols-2 gap-1 px-0.5">
              {availabilityOptions.map(avail => {
                const isSel = selectedAvailability === avail;
                return (
                  <button
                    id={`filter-avail-${avail.replace(/\s+/g, '-')}`}
                    key={avail}
                    onClick={() => setSelectedAvailability(avail)}
                    className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      isSel 
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {avail}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Product Type Specification (EXCLUSIVE) */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Product Hardware Type</h4>
            <select
              id="prodtype-dropdown-filter"
              value={selectedProductType}
              onChange={(e) => setSelectedProductType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary border border-slate-205 dark:border-slate-800 cursor-pointer"
            >
              {productTypeOptions.map(pt => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
          </div>

          {/* 5. Custom Price Range With Input Boxes (EXCLUSIVE) */}
          <div className="space-y-2.5 pt-2 border-t dark:border-slate-800">
            <div className="flex justify-between items-center text-[10px]">
              <h4 className="font-black text-slate-400 uppercase tracking-wider font-mono">Price Bounds (Emalangeni)</h4>
              <span className="font-mono font-extrabold text-primary dark:text-accent">E{minPrice.toLocaleString()} - E{maxPrice.toLocaleString()}</span>
            </div>
            
            {/* Input boxes for exact maximum/minimum values */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 block font-semibold font-mono">MIN VALUE:</span>
                <input
                  id="price-range-min-input"
                  type="number"
                  min="0"
                  max="45000"
                  value={minPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= maxPrice) setMinPrice(val);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 font-mono rounded-lg p-1.5 border dark:border-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 block font-semibold font-mono">MAX VALUE:</span>
                <input
                  id="price-range-max-input"
                  type="number"
                  min="300"
                  max="45000"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= minPrice && val <= 45000) setMaxPrice(val);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 font-mono rounded-lg p-1.5 border dark:border-slate-800 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-1.5">
              <input
                id="price-range-slider-catalog"
                type="range"
                min="300"
                max="45000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>E{minPrice}</span>
                <span>E45,000</span>
              </div>
            </div>
          </div>

          {/* 6. RAM Size Check-pills */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800 text-xs">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Compute RAM Size</h4>
            <div className="flex flex-wrap gap-1">
              {ramOptions.map(ram => (
                <button
                  id={`ram-filter-${ram}`}
                  key={ram}
                  onClick={() => setSelectedRam(ram)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition font-bold cursor-pointer ${
                    selectedRam === ram
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  {ram}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Storage Capacity check (EXCLUSIVE) */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800 text-xs">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Storage Capacity</h4>
            <div className="flex flex-wrap gap-1">
              {storageOptions.map(st => (
                <button
                  id={`storage-filter-${st}`}
                  key={st}
                  onClick={() => setSelectedStorage(st)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition font-bold cursor-pointer ${
                    selectedStorage === st
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-650 dark:text-slate-350'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* 8. Processor Technology Type (EXCLUSIVE) */}
          <div className="space-y-2.5 pt-2 border-t dark:border-slate-800">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Processor Technology</h4>
            <select
              id="processor-dropdown-filter"
              value={selectedProcessor}
              onChange={(e) => setSelectedProcessor(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary border border-slate-205 dark:border-slate-800 cursor-pointer"
            >
              {processorOptions.map(proc => (
                <option key={proc} value={proc}>{proc}</option>
              ))}
            </select>
          </div>

          {/* 9. Item Seal/Condition */}
          <div className="space-y-2 pt-2 border-t dark:border-slate-800 text-xs">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Seal &amp; Condition</h4>
            <div className="grid grid-cols-3 gap-1">
              {['All', 'New', 'Pre-Owned'].map(cond => (
                <button
                  id={`cond-filter-${cond}`}
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`text-[11px] p-1.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                    selectedCondition === cond
                      ? 'bg-primary text-white border-primary'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* PRODUCTS AREA (Right Side) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-dark-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-left">
            
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-bold block uppercase font-mono">Query Execution Complete</span>
              <span className="text-xs sm:text-sm text-slate-705 dark:text-slate-300">
                Found <b className="font-extrabold text-primary font-mono">{sortedProducts.length}</b> premium configurations matched
              </span>
            </div>

            {/* Display selectors and sort dropdowns */}
            <div className="flex items-center space-x-3">
              
              {/* Sort By */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs text-slate-450 font-bold">SORT:</span>
                <select
                  id="sort-dropdown-catalog"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary border border-slate-200 dark:border-slate-800 cursor-pointer"
                >
                  <option value="featured">Featured Inventory</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="alphabetical">Alphabetical A-Z</option>
                </select>
              </div>

              {/* Mobile Filter toggle button */}
              <button
                id="mobile-filter-toggle"
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="lg:hidden p-2 text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Smart Filters</span>
              </button>
            </div>
          </div>

          {/* MOBILE EXPANDED FILTERS ACCORDION */}
          {showFiltersMobile && (
            <div className="lg:hidden bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-left animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">Adjust System Specs</span>
                <button onClick={() => setShowFiltersMobile(false)} className="text-xs font-bold text-red-500 underline">Close Panel</button>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <span className="text-xs font-bold block text-slate-400">Class Category</span>
                <select
                  id="cat-dropdown-mobile"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border text-xs font-bold rounded-xl p-2.5 dark:border-slate-800 dark:text-white"
                >
                  <option value="All">All Classifications</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Specific Brand Selector */}
              <div className="space-y-1">
                <span className="text-xs font-bold block text-slate-400 font-mono">Brand</span>
                <select
                  id="brand-dropdown-filter-mobile"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white rounded-xl p-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800"
                >
                  <option value="All">All Brands</option>
                  {BRANDS.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-1">
                <span className="text-xs font-bold block text-slate-400">Availability</span>
                <select
                  id="avail-dropdown-mobile"
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white rounded-xl p-2.5 text-xs font-bold border border-slate-201 dark:border-slate-800"
                >
                  {availabilityOptions.map(avail => (
                    <option key={avail} value={avail}>{avail}</option>
                  ))}
                </select>
              </div>

              {/* Processor Type */}
              <div className="space-y-1">
                <span className="text-xs font-bold block text-slate-400">Processor Tech</span>
                <select
                  id="cpu-dropdown-mobile"
                  value={selectedProcessor}
                  onChange={(e) => setSelectedProcessor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white rounded-xl p-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800"
                >
                  {processorOptions.map(proc => (
                    <option key={proc} value={proc}>{proc}</option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="space-y-1">
                <span className="text-xs font-bold block text-slate-400">Max Budget (E{maxPrice})</span>
                <input
                  id="price-slider-mobile"
                  type="range"
                  min="300"
                  max="45000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Reset mobile shortcut */}
              <button
                id="reset-mobile-filters"
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-black rounded-xl border mt-2"
              >
                Reset All Parameters
              </button>
            </div>
          )}

          {/* PRODUCTS GRID WRAPPING */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center space-y-4 opacity-90 text-left md:text-center">
              <span className="text-4xl block">🔍</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">No Matching Hardware Configured</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                No stock-line matches those exact selections. Try clearing field queries, relaxing processor rules, or adjusting your price limits.
              </p>
              <button
                id="clear-filters-nodata"
                onClick={handleResetFilters}
                className="bg-primary hover:bg-primary-hover text-white text-xs px-5 py-2.5 font-bold rounded-xl cursor-pointer shadow-md shadow-primary/25"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => {
                const inCompare = selectedCompare.some((cp) => cp.id === p.id);
                // Calculate Eswatini VAT inclusions for explicit displays
                const VAT = 0.15;
                const exclVatPrice = Math.round(p.price / (1 + VAT));

                return (
                  <div
                    id={`product-card-${p.id}`}
                    key={p.id}
                    className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Badge absolute overlays */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 p-1">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ${
                        p.condition === 'New' ? 'bg-primary' : 'bg-amber-600'
                      }`}>
                        {p.condition}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="bg-red-500 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider shadow-sm animate-pulse">
                          SAVE {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Compare Quick Toggle top-right */}
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        id={`compare-icon-badge-${p.id}`}
                        onClick={() => onToggleCompare(p)}
                        className={`p-2 rounded-full border transition-all duration-300 shadow-md ${
                          inCompare 
                            ? 'bg-primary border-primary text-white scale-110' 
                            : 'bg-white/90 hover:bg-white border-slate-200 text-slate-700 dark:bg-slate-900/95 dark:text-white dark:border-slate-700'
                        }`}
                        title={inCompare ? "Remove from side-by-side comparison" : "Add to specs side-by-side comparison"}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image frame */}
                    <div className="relative h-48 sm:h-52 bg-slate-50 dark:bg-slate-950 overflow-hidden cursor-pointer border-b dark:border-slate-850" onClick={() => onOpenProductDetail(p)}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      
                      {/* Interactive Spec Sheet Eye Indicator */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <span className="bg-white text-slate-950 text-xs px-4 py-2 font-black rounded-xl flex items-center space-x-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <Eye className="h-4.2 w-4.2" />
                          <span>Inspect Full Specs</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Frame */}
                    <div className="p-5 flex-1 flex flex-col text-left">
                      
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.8 rounded-md font-extrabold font-mono uppercase">
                          {p.brand} | {p.category}
                        </span>
                        
                        {/* SKU/Model matching tag */}
                        <span className="text-[10px] text-slate-400 font-mono" title="Model Tag">{p.sku}</span>
                      </div>

                      {/* Title heading */}
                      <h3
                        onClick={() => onOpenProductDetail(p)}
                        className="text-base font-black text-slate-900 dark:text-white hover:text-primary transition line-clamp-1 cursor-pointer"
                        title={p.name}
                      >
                        {p.name}
                      </h3>

                      {/* Technical Specs Summary Rows */}
                      <div className="my-3 bg-slate-50/50 dark:bg-slate-900/50 p-2.5 rounded-2xl border dark:border-slate-850 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 flex-1 select-none">
                        {p.specs['Processor'] && (
                          <div className="flex justify-between items-center whitespace-nowrap overflow-hidden">
                            <span className="font-semibold text-slate-650 dark:text-slate-350 flex items-center gap-1">
                              <Cpu className="h-3 w-3 text-primary" />
                              <span>CPU:</span>
                            </span>
                            <span className="font-medium text-slate-800 dark:text-white truncate max-w-[150px]">{p.specs['Processor']}</span>
                          </div>
                        )}
                        {(p.specs['RAM'] || p.specs['Memory']) && (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-650 dark:text-slate-350 flex items-center gap-1">
                              <LayoutGrid className="h-3 w-3 text-primary" />
                              <span>Memory:</span>
                            </span>
                            <span className="font-medium text-slate-800 dark:text-white">{p.specs['RAM'] || p.specs['Memory']}</span>
                          </div>
                        )}
                        {p.specs['Storage'] && (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-650 dark:text-slate-350 flex items-center gap-1">
                              <HardDrive className="h-3 w-3 text-primary" />
                              <span>Storage:</span>
                            </span>
                            <span className="font-medium text-slate-800 dark:text-white">{p.specs['Storage']}</span>
                          </div>
                        )}
                        {p.specs['Display'] && (
                          <div className="flex justify-between items-center whitespace-nowrap overflow-hidden">
                            <span className="font-semibold text-slate-650 dark:text-slate-350">Display:</span>
                            <span className="font-medium text-slate-800 dark:text-white truncate max-w-[150px]">{p.specs['Display']}</span>
                          </div>
                        )}
                      </div>

                      {/* Warranty & Stock Status Matrix */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850 text-[11px] my-2">
                        <span className="text-slate-400 italic" title="Local Diagnostic Warranty">{p.warranty}</span>
                        <span className={`font-mono font-bold flex items-center space-x-1 ${
                          p.availability === 'In Stock'
                            ? 'text-emerald-500'
                            : p.availability === 'Low Stock'
                              ? 'text-amber-500 animate-pulse'
                              : 'text-red-500'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            p.availability === 'In Stock' ? 'bg-emerald-500' : p.availability === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></span>
                          <span>{p.availability}</span>
                        </span>
                      </div>

                      {/* Dual Price Information Matrix (Excl & Incl VAT) */}
                      <div className="pt-2 flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold block leading-none">RETAIL INVOICED</span>
                          <div className="flex items-baseline gap-1">
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="text-slate-400 dark:text-slate-500 text-xs line-through">
                                E{p.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-lg font-black text-slate-905 dark:text-white font-mono">
                              E{p.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-bold block leading-none">EXCL. 15% VAT</span>
                          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                            E{exclVatPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Comparison Checkbox Integration row */}
                      <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-555 dark:text-slate-400 font-medium">Specs comparison sheet:</span>
                        <button
                          id={`compare-check-${p.id}`}
                          onClick={() => onToggleCompare(p)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1.2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                            inCompare
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-750'
                          }`}
                        >
                          {inCompare ? <CheckSquare className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                          <span>{inCompare ? 'Added √' : 'Compare list'}</span>
                        </button>
                      </div>

                      {/* Action buttons (Add to Cart / WhatsApp Inquiry / Buy Now) */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button
                          id={`add-to-cart-btn-${p.id}`}
                          onClick={() => onAddToCart(p)}
                          disabled={p.stock === 0}
                          className={`w-full py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                            p.stock === 0
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : isInCart(p.id)
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                : 'bg-primary hover:bg-primary-hover text-white shadow-primary/10'
                          }`}
                        >
                          <ShoppingCart className="h-3.8 w-3.8" />
                          <span>{isInCart(p.id) ? 'In Cart √' : 'Add to Cart'}</span>
                        </button>

                        <a
                          id={`whatsapp-btn-${p.id}`}
                          href={generateWhatsAppUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-emerald-450 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition"
                          title="WhatsApp chat showroom inquiry"
                        >
                          <MessageSquare className="h-3.8 w-3.8" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <button
                        id={`buy-now-btn-${p.id}`}
                        onClick={() => onBuyNow(p)}
                        className="w-full mt-2 bg-gradient-to-r from-accent to-orange-600 hover:from-orange-600 hover:to-accent text-white py-2 rounded-xl text-xs font-extrabold transition duration-300 cursor-pointer"
                      >
                        Buy Directly (Secure Checkout)
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* RECENTLY VIEWED PRODUCTS BLOCK */}
          {recentlyViewed && recentlyViewed.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
              <div className="flex justify-between items-baseline mb-6">
                <div>
                  <span className="text-[10px] text-accent uppercase font-black tracking-widest block font-mono">🕒 STORE MEMORY DIAGNOSTICS</span>
                  <h4 className="text-xl font-black text-slate-905 dark:text-white uppercase tracking-tight">
                    Recently Viewed Products
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {recentlyViewed.map((p) => (
                  <div
                    id={`recently-viewed-card-${p.id}`}
                    key={p.id}
                    onClick={() => onOpenProductDetail(p)}
                    className="bg-white dark:bg-dark-card border dark:border-slate-800 p-3 rounded-2xl flex flex-col justify-between hover:scale-102 transform cursor-pointer hover:shadow-md transition text-left group"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 mb-2">
                      <img src={p.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase font-mono block mb-1">{p.brand}</span>
                      <h5 className="font-bold text-slate-900 truncate dark:text-white text-xs mb-1">{p.name}</h5>
                      <span className="font-mono font-bold text-primary dark:text-accent text-xs">E{p.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
