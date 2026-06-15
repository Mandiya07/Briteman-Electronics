import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Search, Moon, Sun, Heart, User, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Product } from '../types';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navigation({
  currentTab,
  onTabChange,
  cart,
  wishlist,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Products' },
    { id: 'wholesale', label: 'Wholesale Portal', highlight: true },
    { id: 'services', label: 'Services' },
    { id: 'blogs', label: 'Blog & Guides' },
    { id: 'ai', label: 'Ask AI ⚡' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
    { id: 'admin', label: 'Admin Panel', badge: 'Manager' },
  ];

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 shadow-md transition-colors duration-300">
      {/* Top promotional bar */}
      <div className="bg-primary hover:bg-primary-hover text-white text-xs py-2 px-4 transition-colors duration-300 text-center flex flex-wrap justify-between items-center sm:px-8">
        <div>
          <span className="font-semibold text-accent">🔥 Back-to-School Specials: </span> 
          Get premium student laptop bundles up to 15% discount!
        </div>
        <div className="hidden md:flex space-x-6">
          <span>📍 LM Building Unit 10, Somhlolo Road, Mbabane</span>
          <span className="font-semibold">📞 +268 7662 3733</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <button 
              id="brand-logo-btn"
              onClick={() => onTabChange('home')}
              className="flex items-center space-x-2.5 text-left cursor-pointer group"
            >
              <div className="bg-primary group-hover:bg-accent p-2 rounded-xl text-white transform group-hover:-rotate-3 transition-all duration-500 shadow-lg shadow-primary/25">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-slate-950 dark:text-white leading-tight block">
                  BRITEMAN
                </span>
                <span className="text-accent font-mono text-[9px] font-bold tracking-[0.2em] uppercase select-none leading-none">
                  Electronics
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center ml-6 space-x-0.5">
            {navItems.filter(item => !item.badge && item.id !== 'admin' && item.id !== 'ai').map((item) => (
              <button
                id={`nav-tab-${item.id}`}
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-2.5 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 cursor-pointer relative group whitespace-nowrap ${
                  currentTab === item.id
                    ? 'text-primary dark:text-accent'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {currentTab === item.id && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-primary dark:bg-accent rounded-full" 
                  />
                )}
                <div className={`absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-slate-200 dark:bg-slate-800 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center ${currentTab === item.id ? 'hidden' : ''}`}></div>
              </button>
            ))}
          </div>

          {/* Search bar middle (Desktop) - Adjusted for better flow */}
          <div className="hidden xl:flex items-center flex-1 max-w-[240px] mx-4 group">
            <div className="relative w-full">
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentTab !== 'shop') onTabChange('shop');
                }}
                className="w-full bg-slate-100 dark:bg-slate-900/50 text-slate-900 dark:text-white pl-9 pr-3 py-1.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary/30 dark:focus:ring-accent/30 border border-slate-200/50 dark:border-slate-800 transition-all font-sans text-xs placeholder:text-slate-400"
              />
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          {/* Functional Actions & Special Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              id="nav-tab-ai"
              onClick={() => onTabChange('ai')}
              className={`px-3 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                currentTab === 'ai'
                  ? 'bg-accent text-white shadow-accent/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-accent hover:text-white'
              }`}
            >
              Ask AI <Sparkles className="h-3 w-3" />
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1.5"></div>

            {/* Icons */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                id="theme-toggle-btn"
                onClick={toggleDarkMode}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer group"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="h-5 w-5 group-hover:rotate-12 transition-transform" /> : <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform" />}
              </button>

              <button
                id="wishlist-toggle-btn"
                onClick={onOpenWishlist}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all relative cursor-pointer group"
                title="View Wishlist"
              >
                <Heart className={`h-5 w-5 group-hover:scale-110 transition-transform ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-bg animate-in fade-in zoom-in">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                id="cart-toggle-btn"
                onClick={onOpenCart}
                className="p-2.5 text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all relative flex items-center cursor-pointer group"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                {totalCartItems > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-accent text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-bg animate-in fade-in zoom-in">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {/* Admin/Manager Tab icon */}
              <button
                id="nav-tab-admin-badge"
                onClick={() => onTabChange('admin')}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  currentTab === 'admin'
                    ? 'bg-slate-950 text-white border-slate-950'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
                title="Admin Portal"
              >
                <User className="h-5 w-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline">Portal</span>
              </button>
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center md:hidden space-x-1 sm:space-x-3">
            <button
              id="theme-toggle-mobile"
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              id="cart-toggle-mobile"
              onClick={onOpenCart}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[8px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white dark:border-dark-bg">
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-950 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 overflow-hidden"
          >
            <div className="px-5 py-6 space-y-6">
              {/* Mobile search bar */}
              <div className="relative group">
                <input
                  id="search-input-mobile"
                  type="text"
                  placeholder="Search laptops, keyboards..."
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentTab !== 'shop') onTabChange('shop');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-primary border border-slate-200 dark:border-slate-800 transition-all text-sm"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <button
                    id={`nav-tab-mobile-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`group w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold flex justify-between items-center transition-all ${
                      currentTab === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : item.highlight
                          ? 'text-accent border border-accent/20 hover:bg-slate-50 dark:hover:bg-slate-900'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="uppercase tracking-tight">{item.label}</span>
                    {item.badge ? (
                      <span className="bg-primary/20 dark:bg-slate-800 text-primary dark:text-accent text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-black">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${currentTab === item.id ? 'text-white' : 'text-slate-300'}`} />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  id="wishlist-toggle-mobile"
                  onClick={() => {
                    onOpenWishlist();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">
                    Wishlist ({wishlist.length})
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
