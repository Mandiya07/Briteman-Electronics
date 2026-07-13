import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Homepage from './components/Homepage';
import ProductDetailModal from './components/ProductDetailModal';
import CompareDrawer from './components/CompareDrawer';
import WholesalePortal from './components/WholesalePortal';
import ServicePages from './components/ServicePages';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import BlogCenter from './components/BlogCenter';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminDashboard from './components/AdminDashboard';
import AiAssistant from './components/AiAssistant';
import { Logo } from './components/Logo';

import { Product, CartItem, Order, WholesaleQuoteRequest, WholesaleProfile, Coupon } from './types';
import { PRODUCTS, BLOGS, CATEGORIES } from './data/products';
import { Phone, MessageSquare, MapPin, Mail, ChevronRight, CheckCircle2, Star, Percent, Sparkles, Scale, ShoppingBag, Send, ShieldAlert, Lock, UserCheck } from 'lucide-react';
import { auth, loginWithGoogle, logoutUser } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email?.toLowerCase() === 'ajapresd@gmail.com') {
        setActiveTab('admin');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        setCurrentUser(user);
        if (user.email?.toLowerCase() === 'ajapresd@gmail.com') {
          setActiveTab('admin');
        }
      }
    } catch (e) {
      console.error('Google login error:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const [activeTab, setActiveTab] = useState<string>('home');
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [selectedCompare, setSelectedCompare] = useState<Product[]>([]);
  
  // Lifted category & brand filter states for interactive homepage integration
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  
  // Modals & Drawers Toggles
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState<boolean>(false);
  const [isCompareDrawerMinimized, setIsCompareDrawerMinimized] = useState<boolean>(false);

  // Dynamic states for premium features: recently viewed and coupon management
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Dynamic lists returned from server OR kept reactively in-memory
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [quotes, setQuotes] = useState<WholesaleQuoteRequest[]>([]);

  const [registrations, setRegistrations] = useState<WholesaleProfile[]>([]);

  // Load from server database if available, other fallback to reactive state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodResp = await fetch('/api/products');
        if (prodResp.ok) {
          const prods = await prodResp.json();
          if (prods && prods.length > 0) {
            setProductsList(prods);
          }
        }
        
        const ordResp = await fetch('/api/orders');
        if (ordResp.ok) {
          const ords = await ordResp.json();
          setOrders(ords);
        }

        const quoteResp = await fetch('/api/wholesale-quotes');
        if (quoteResp.ok) {
          const qts = await quoteResp.json();
          if (qts && qts.length > 0) {
            setQuotes(qts);
          }
        }

        const regResp = await fetch('/api/wholesale-registrations');
        if (regResp.ok) {
          const regs = await regResp.json();
          if (regs && regs.length > 0) {
            setRegistrations(regs);
          }
        }

        const couponResp = await fetch('/api/coupons');
        if (couponResp.ok) {
          const cpns = await couponResp.json();
          if (cpns && cpns.length > 0) {
            setCoupons(cpns);
          }
        }
      } catch (err) {
        console.warn('API database routes offline or loading in-memory fallback modes.', err);
      }
    };
    fetchData();
  }, []);

  // Discount & Coupon Management Operations
  const handleCreateCoupon = async (couponData: { code: string; percent: number; description: string }) => {
    const formatted = {
      code: couponData.code.trim().toUpperCase(),
      percent: couponData.percent,
      active: true,
      description: couponData.description || `${couponData.percent}% Off Discount`
    };
    setCoupons(prev => [...prev, formatted]);
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      });
    } catch (e) {
      console.warn('Coupon persisted locally in UI state');
    }
  };

  const handleToggleCoupon = async (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
    try {
      await fetch(`/api/coupons/${code}/toggle`, {
        method: 'PUT'
      });
    } catch (e) {
      console.warn('Toggle persisted locally in UI state');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    try {
      await fetch(`/api/coupons/${code}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Coupon deleted locally in UI state');
    }
  };

  // Wishlist, recents, and spec modal actions
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist(prev => prev.filter(p => p.id !== product.id));
  };

  const handleOpenProductDetail = (product: Product) => {
    setSelectedProductForDetail(product);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Keep up to 5 recently viewed items
    });
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    const existingIdx = cart.findIndex(item => item.product.id === product.id);
    if (existingIdx !== -1) {
      const updated = [...cart];
      updated[existingIdx].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setIsCartDrawerOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(cart.map(item => item.product.id === id ? { ...item, quantity: qty } : item));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter(item => item.product.id !== id));
  };

  // Compare toggles
  const handleToggleCompare = (product: Product) => {
    const exists = selectedCompare.some(item => item.id === product.id);
    if (exists) {
      setSelectedCompare(selectedCompare.filter(item => item.id !== product.id));
    } else {
      if (selectedCompare.length >= 3) {
        alert('You can compare a maximum of 3 devices side-by-side!');
        return;
      }
      setSelectedCompare([...selectedCompare, product]);
      setIsCompareDrawerMinimized(false);
    }
  };

  // Admin stocks modifier
  const handleUpdateStockInState = (id: string, qty: number) => {
    setProductsList(productsList.map(p => p.id === id ? { ...p, stock: Math.max(0, qty), availability: qty > 5 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock' } : p));
  };

  const handleCreateProduct = (newProduct: Product) => {
    setProductsList(prev => [newProduct, ...prev]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProductsList(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList(prev => prev.filter(p => p.id !== productId));
  };

  // Wholesale portal triggers (sends backend HTTP posts if live, parses locally too)
  const handleSubmitQuote = async (quoteData: any) => {
    const formatted = {
      id: 'RFQ-' + Math.floor(1000 + Math.random() * 9000),
      ...quoteData,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setQuotes(prev => [formatted, ...prev]);

    try {
      await fetch('/api/wholesale-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
    } catch (e) {
      console.warn('Backup state save enabled.');
    }
  };

  const handleSubmitRegistration = async (regData: any) => {
    const formatted = {
      id: 'REG-' + Math.floor(1000 + Math.random() * 9000),
      ...regData,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRegistrations(prev => [formatted, ...prev]);

    try {
      await fetch('/api/wholesale-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
    } catch (e) {
      console.warn('Backup state registration saved.');
    }
  };

  // Admin quote custom pricing approves
  const handleApproveQuote = (id: string, customPrice: number) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: 'Approved', assignedPrice: customPrice } : q));
  };

  const handleApproveRegistration = (id: string) => {
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleCheckoutComplete = async (orderDetails: any) => {
    setOrders(prev => [orderDetails, ...prev]);

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      });
    } catch (e) {
      console.warn('Checkout successfully handled in local UI state.');
    }
  };

  const handleBuyNowTrigger = (p: Product) => {
    const inCart = cart.some(item => item.product.id === p.id);
    if (!inCart) {
      setCart([...cart, { product: p, quantity: 1 }]);
    }
    setSelectedProductForDetail(null);
    setIsCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Dynamic Navigation Bar and Header */}
      <Navigation
        currentTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // scroll to viewport top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenWishlist={() => {
          setIsWishlistDrawerOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'shop') {
            setActiveTab('shop');
          }
        }}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Main Switchable Contents */}
      <main className="flex-1">
        
        {activeTab === 'home' && (
          <Homepage
            products={productsList}
            onTabChange={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNowTrigger}
            onOpenProductDetail={(p) => setSelectedProductForDetail(p)}
            onCategoryFilterChange={(cat) => setSelectedCategoryFilter(cat)}
            onBrandFilterChange={(brand) => setSelectedBrandFilter(brand)}
          />
        )}

        {activeTab === 'shop' && (
          /* RICH PRODUCTS DIRECTORY CATALOG & COMPARISONS */
          <Catalog
            products={productsList}
            cart={cart}
            wishlist={wishlist}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleToggleWishlist}
            selectedCompare={selectedCompare}
            onToggleCompare={handleToggleCompare}
            onOpenProductDetail={handleOpenProductDetail}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            onBuyNow={handleBuyNowTrigger}
            selectedCategory={selectedCategoryFilter}
            setSelectedCategory={setSelectedCategoryFilter}
            selectedBrand={selectedBrandFilter}
            setSelectedBrand={setSelectedBrandFilter}
            recentlyViewed={recentlyViewed}
          />
        )}

        {activeTab === 'services' && (
          <ServicePages onTabChange={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'wholesale' && (
          <WholesalePortal
            products={productsList}
            onSubmitQuote={handleSubmitQuote}
            onSubmitRegistration={handleSubmitRegistration}
            quotes={quotes}
            registrations={registrations}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogCenter blogs={BLOGS} />
        )}

        {activeTab === 'about' && (
          <AboutUs />
        )}

        {activeTab === 'contact' && (
          <ContactUs />
        )}

        {activeTab === 'ai' && (
          <AiAssistant
            products={productsList}
            onOpenProductDetail={(p) => setSelectedProductForDetail(p)}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'admin' && (
          currentUser?.email?.toLowerCase() === 'ajapresd@gmail.com' ? (
              <AdminDashboard
                products={productsList}
                orders={orders}
                quotes={quotes}
                registrations={registrations}
                onUpdateStock={handleUpdateStockInState}
                onAddProduct={handleCreateProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onApproveQuote={handleApproveQuote}
                onApproveRegistration={handleApproveRegistration}
                coupons={coupons}
                onCreateCoupon={handleCreateCoupon}
                onToggleCoupon={handleToggleCoupon}
                onDeleteCoupon={handleDeleteCoupon}
                onLogout={handleLogout}
              />
          ) : (
            <div className="max-w-md mx-auto py-20 px-6 text-center">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
                <div className="h-16 w-16 bg-red-100 dark:bg-red-950/50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Restricted Admin Access</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    The Briteman Electronics Manager Dashboard is strictly secured for authorized administrators. Please sign in with the designated admin account: <span className="font-mono text-primary font-bold">ajapresd@gmail.com</span>
                  </p>
                </div>

                {currentUser ? (
                  <div className="space-y-4 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-800 text-xs">
                      <p className="text-slate-400">Currently signed in as:</p>
                      <p className="font-mono font-bold text-slate-800 dark:text-white mt-0.5">{currentUser.email}</p>
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">⚠️ This account is not authorized as Admin.</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Sign Out & Switch Account
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Sign In with Google (ajapresd@gmail.com)</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('home')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline font-medium"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8 text-left mt-16 font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="inline-block bg-white/5 p-2 rounded-2xl">
              <Logo />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Eswatini's premium technology retail partner positioned in somhlolo route, Mbabane. HP original notebooks, Canon printers, load-shedding backup kits, and school procurement ledgers.
            </p>
            <div className="text-xs space-y-1 text-slate-455 font-mono">
              <p>Hotline: +268 7662 3733</p>
              <p>Showroom: +268 3450 1703</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-black text-slate-200 uppercase tracking-widest">Office Categories</h4>
            <ul className="space-y-2 text-slate-400">
              {['Laptops', 'Desktop Computers', 'Printers', 'UPS Systems', 'Accessories'].map(cat => (
                <li key={cat}>
                  <button
                    id={`footer-cat-link-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('shop');
                    }}
                    className="hover:text-primary transition"
                  >
                    {cat} Stock
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-black text-slate-200 uppercase tracking-widest">Institutional Channels</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => setActiveTab('wholesale')} className="hover:text-primary transition">School Procurement Accounts</button></li>
              <li><button onClick={() => setActiveTab('wholesale')} className="hover:text-primary transition">Government Tender Support</button></li>
              <li><button onClick={() => setActiveTab('services')} className="hover:text-primary transition">Corporate IT Setup contracts</button></li>
              <li><button onClick={() => setActiveTab('blogs')} className="hover:text-primary transition">Tech Buying Guides</button></li>
            </ul>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-black text-slate-200 uppercase tracking-widest">Certified Showroom</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              LM Building Unit 10, Somhlolo Road,<br />
              Next to Lilunga House, SRIC Route,<br />
              Mbabane, Eswatini
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              🕒 Mon-Fri: 08:00 AM - 05:00 PM<br />
              🕒 Saturday: 08:30 AM - 01:00 PM
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-wrap justify-between items-baseline gap-4">
          <p>© 2026 Briteman Services (Briteman Electronics). All Rights Reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('about')}>Our Story</span>
            <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('contact')}>Contact Showroom</span>
            <span className="hover:underline cursor-pointer text-red-500 font-bold" onClick={() => setActiveTab('admin')}>Admin login</span>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON (Line 10) */}
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/26876623733?text=Hi%20Briteman%20Electronics!%20I%20have%20questions%20regarding%20corporate%25/institutional%20computing%20stock%20and%20deliveries."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 shadow-xl hover:scale-105 transform transition p-4 rounded-full text-white flex items-center justify-center cursor-pointer"
        title="Chat in WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>

      {/* DYNAMIC COMPARISON SPECS DRAWER (Slides from bottom) */}
      {selectedCompare.length > 0 && !isCompareDrawerMinimized && (
        <CompareDrawer
          compareProducts={selectedCompare}
          onRemoveFromCompare={(p) => setSelectedCompare(selectedCompare.filter(item => item.id !== p.id))}
          onClearCompare={() => setSelectedCompare([])}
          onAddToCart={handleAddToCart}
          onClose={() => setIsCompareDrawerMinimized(true)}
        />
      )}

      {selectedCompare.length > 0 && isCompareDrawerMinimized && (
        <div className="fixed bottom-6 left-6 z-40 bg-white dark:bg-dark-card border border-slate-205 dark:border-slate-800 shadow-xl px-5 py-3 rounded-full flex items-center space-x-3 text-xs">
          <span className="font-bold text-slate-900 dark:text-white">Compare Matrix ({selectedCompare.length})</span>
          <button
            id="maximize-compare-drawer"
            onClick={() => setIsCompareDrawerMinimized(false)}
            className="text-primary font-bold hover:underline"
          >
            Show Chart
          </button>
        </div>
      )}

      {/* MODAL: PRODUCT DETAILS POPUP */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNowTrigger}
          isInCart={cart.some(item => item.product.id === selectedProductForDetail.id)}
          allProducts={productsList}
          onSelectProduct={handleOpenProductDetail}
        />
      )}

      {/* SLIDE-IN SHOPPING CART DETAILS DRAWER */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onCheckoutComplete={handleCheckoutComplete}
        coupons={coupons}
      />

      {/* SLIDE-IN STORE WISHLIST OVERLAY DRAWER */}
      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
