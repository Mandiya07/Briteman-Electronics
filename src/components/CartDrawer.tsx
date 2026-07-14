import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle, Calculator, Landmark, ShieldCheck, Tag, CreditCard } from 'lucide-react';
import { CartItem, Product, Coupon } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onCheckoutComplete: (orderDetails: any) => void;
  coupons?: Coupon[];
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckoutComplete,
  coupons = []
}: CartDrawerProps) {
  
  // Checkout flow states
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'completed'>('cart');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money (MTN MoMo)');
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [lastAssignedOrderId, setLastAssignedOrderId] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  const discountAmount = appliedDiscount ? (subtotal * (appliedDiscount.percent / 100)) : 0;
  
  // Eswatini standard taxes/courier estimates
  const estVAT = subtotal * 0.15; // 15% VAT
  const deliveryEstimatesFee = subtotal > 15000 ? 0 : 50; // free above E15,000 corporate threshold
  const orderTotal = subtotal + estVAT + deliveryEstimatesFee - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = coupon.trim().toUpperCase();
    
    // Check against live dynamic coupons array
    const liveMatch = coupons.find(c => c.code === code && c.active);
    
    if (liveMatch) {
      setAppliedDiscount({ code: liveMatch.code, percent: liveMatch.percent });
    } else {
      // Fallback matching
      if (code === 'BRITEMAN10') {
        setAppliedDiscount({ code: 'BRITEMAN10', percent: 10 });
      } else if (code === 'WELCOME5') {
        setAppliedDiscount({ code: 'WELCOME5', percent: 5 });
      } else if (code === 'MOMOFLASH') {
        setAppliedDiscount({ code: 'MOMOFLASH', percent: 15 });
      } else {
        setCouponError('Invalid or inactive coupon code sequence.');
      }
    }
  };

  const handleExecuteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) return;

    const itemsFormatted = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const details = {
      customerName: name,
      email,
      phone,
      address,
      items: itemsFormatted,
      total: orderTotal,
      paymentMethod
    };

    // Trigger parent hook (performs server POST `/api/orders`)
    onCheckoutComplete(details);

    // Simulated local success states
    const mockOrderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    setLastAssignedOrderId(mockOrderId);
    setCheckoutStep('completed');
    onClearCart();
  };

  const paymentSpecsDetails = () => {
    if (paymentMethod.includes('Bank Transfer')) {
      return (
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 text-[11px] text-slate-500 font-mono space-y-1 mt-2 text-left">
          <p className="font-bold text-slate-700 dark:text-slate-350">FNB Eswatini Corporate Account Details</p>
          <p>Account Name: Briteman Services Ltd</p>
          <p>Account Number: 62451294821</p>
          <p>Branch Code: 280164 (Manzini Central)</p>
          <p className="font-semibold text-accent">Use order number as reference</p>
        </div>
      );
    }
    if (paymentMethod.includes('Mobile Money')) {
      return (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-250 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-400 font-mono space-y-1 mt-2 text-left">
          <p className="font-bold">MTN Mobile Money Merchant Payment</p>
          <p>Momo Merchant Code: 512833</p>
          <p>Billed Registered Name: Briteman Electronics</p>
          <p className="font-semibold text-accent">Send proof of MoMo payment to +268 7662 3733</p>
        </div>
      );
    }
    if (paymentMethod.includes('Credit/Debit')) {
      return (
        <div className="bg-slate-50 dark:bg-slate-905 p-3 rounded-xl border dark:border-slate-800 text-left mt-2 space-y-2">
          <p className="font-bold text-[11px] text-slate-700 dark:text-slate-350 flex items-center">
            <CreditCard className="h-4.5 w-4.5 text-accent mr-1.5" />
            <span>Secure Card Checkout Gate (Visa / Mastercard)</span>
          </p>
          <div className="space-y-1.5">
            <input 
              id="card-number-input"
              type="text" 
              placeholder="Card Number: 4111 2222 3333 4444" 
              className="w-full p-2 bg-white dark:bg-slate-950 border dark:border-slate-800 text-xs font-mono rounded-lg focus:outline-none"
              maxLength={19}
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                id="card-expiry-input"
                type="text" 
                placeholder="MM / YY" 
                className="w-full p-2 bg-white dark:bg-slate-950 border dark:border-slate-800 text-xs font-mono rounded-lg focus:outline-none"
                maxLength={5}
              />
              <input 
                id="card-cvv-input"
                type="password" 
                placeholder="CVV / CVC" 
                className="w-full p-2 bg-white dark:bg-slate-950 border dark:border-slate-800 text-xs font-mono rounded-lg focus:outline-none"
                maxLength={3}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">🔒 Encrypted SSL settlement tunnel authorized via SRIC secure.</p>
        </div>
      );
    }
    return (
      <div className="text-[11px] text-slate-400 mt-2 text-left">
        🏡 Bring cash directly to Unit 10, The Hub, Manzini showroom context during office pick-up.
      </div>
    );
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 bg-black/60 flex justify-end">
      <div className="bg-white dark:bg-dark-card w-full max-w-md h-full flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 shadow-2xl relative transition-all duration-300">
        
        {/* Header Drawer */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-display font-black text-slate-950 dark:text-white uppercase tracking-tight text-base">
              {checkoutStep === 'cart' ? 'Shopping Cart' : checkoutStep === 'details' ? 'Secure Checkout' : 'Order Confirmed'}
            </span>
          </div>
          <button
            id="cart-close-drawer-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Inner Step views */}
        {checkoutStep === 'cart' ? (
          /* STEP 1: CART LIST */
          <div className="flex-1 overflow-y-auto p-5 text-left flex flex-col justify-between">
            {cart.length === 0 ? (
              <div className="my-auto text-center space-y-4 py-12 opacity-80">
                <span className="text-4xl block">🛒</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Your Storage Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-normal">
                  No electronics added yet! Browse laptops, original printers, power APC backups, or kid's gaming modules under the Shop Products tab.
                </p>
                <button
                  id="cart-return-shop"
                  onClick={onClose}
                  className="bg-primary text-white text-xs px-5 py-2.5 font-bold rounded-xl cursor-pointer"
                >
                  Return to Warehouse
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
                {cart.map((item, idx) => (
                  <div key={item.product.id} className={`flex items-center space-x-3 text-xs ${idx > 0 ? 'pt-4' : ''}`}>
                    <img src={item.product.image} alt="" className="h-14 w-14 rounded-lg object-cover bg-slate-50 shrink-0 border" />
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                        {item.product.brand}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate mt-1">{item.product.name}</h4>
                      <span className="font-bold text-slate-900 dark:text-white block mt-0.5 font-mono">E{item.product.price.toLocaleString()}</span>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center space-x-1">
                      <button
                        id={`cart-qty-dec-${item.product.id}`}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="h-6 w-6 bg-slate-50 border dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-bold font-mono text-xs px-2">{item.quantity}</span>
                      <button
                        id={`cart-qty-inc-${item.product.id}`}
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="h-6 w-6 bg-slate-50 border dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white rounded flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      id={`cart-remove-item-${item.product.id}`}
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom summary and promo coupon checks */}
            {cart.length > 0 && (
              <div className="border-t dark:border-slate-850 pt-5 space-y-4">
                
                {/* Coupon inputs box */}
                <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border dark:border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Apply Store Promotion Coupon</span>
                  <div className="flex space-x-2">
                    <input
                      id="cart-coupon-input"
                      type="text"
                      placeholder="e.g. WELCOME5"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-lg p-1.5 uppercase font-mono text-center text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      id="cart-coupon-apply"
                      onClick={handleApplyCoupon}
                      className="bg-primary text-white text-xs px-3.5 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-primary-hover"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedDiscount && (
                    <div className="text-emerald-500 font-bold text-[10px] mt-1.5 flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{appliedDiscount.code} added successfully (-{appliedDiscount.percent}% discount)!</span>
                    </div>
                  )}
                  {couponError && (
                    <span className="text-red-500 text-[10px] block mt-1">{couponError}</span>
                  )}
                </div>

                {/* Subtotals breakdowns table */}
                <div className="text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-350">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-900 dark:text-white font-bold">E{subtotal.toLocaleString()}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-500 font-bold">
                      <span>Promo Discount:</span>
                      <span>-E{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Eswatini VAT (15%):</span>
                    <span>E{estVAT.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b dark:border-slate-850">
                    <span>Shipping Courier Fee:</span>
                    <span>{deliveryEstimatesFee === 0 ? 'FREE (Threshold)' : `E${deliveryEstimatesFee}`}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-950 dark:text-white pt-1">
                    <span>TOTAL ORDER:</span>
                    <span>E{orderTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  id="checkout-step2-btn"
                  onClick={() => setCheckoutStep('details')}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>Proceed to Shipping Delivery</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : checkoutStep === 'details' ? (
          /* STEP 2: SHIPPING AND PAYMENT FORM details */
          <form onSubmit={handleExecuteCheckout} className="flex-1 overflow-y-auto p-5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Full Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="e.g. Sipho Dlamini"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Primary Email Contacts *</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="siphod@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Telephone Contact *</label>
                <input
                  id="checkout-phone"
                  type="text"
                  required
                  placeholder="e.g. +268 7662 3733"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Physical Delivery Street Address *</label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  placeholder="Street / Office location code, e.g. Lilunga House block, The Hub, Manzini"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              {/* Payment selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Preferred Settlement Option *</label>
                <select
                  id="checkout-payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-850 dark:text-white rounded-xl focus:outline-none text-xs cursor-pointer"
                >
                  <option value="Mobile Money (MTN MoMo)">MTN Mobile Money Wallet</option>
                  <option value="Bank Transfer (EFT)">FNB Bank EFT Transfer</option>
                  <option value="Credit / Debit Card Payment">Credit / Debit Card (Visa/Mastercard)</option>
                  <option value="Cash on Pickup">Cash Payment on Pickup in Manzini</option>
                </select>
                
                {/* Dynamically render billing coordinates */}
                {paymentSpecsDetails()}
              </div>

            </div>

            {/* Bottom summary and submittal */}
            <div className="pt-5 border-t dark:border-slate-850 space-y-3 mt-6">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>Final Invoice value:</span>
                <span className="text-lg text-primary dark:text-accent font-black">E{orderTotal.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  id="checkout-step1-back-btn"
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-820 font-bold py-3 rounded-xl text-xs text-center cursor-pointer"
                >
                  Back to item list
                </button>
                <button
                  id="execute-checkout-submit"
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl text-xs text-center cursor-pointer shadow-md shadow-accent/15"
                >
                  Authorize Order
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* STEP 3: ORDER COMPLETED SUCCESS STATE */
          <div className="flex-1 p-6 text-center space-y-5 flex flex-col justify-center">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full w-fit mx-auto animate-pulse">
              <CheckCircle className="h-10 w-10" />
            </div>

            <h3 className="text-xl font-extrabold text-emerald-800 dark:text-emerald-400">Order Dispatched to Warehouse!</h3>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-850 text-xs space-y-2 leading-relaxed">
              <p className="font-semibold">Invoice Details:</p>
              <p className="font-mono text-slate-400">Assigned ID: <b className="text-slate-800 dark:text-white">{lastAssignedOrderId}</b></p>
              <p>Delivery Route: {address}</p>
              <p>Verification Hotlines: +268 7662 3733</p>
            </div>

            <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
              Wonderful! Thank you for supporting <b>Briteman Services</b>. Our logistics couriers will gather items from the The Hub database and prep dispatch within 30 minutes.
            </p>

            <button
              id="confirm-checkout-close-btn"
              onClick={() => {
                setCheckoutStep('cart');
                onClose();
              }}
              className="bg-primary text-white text-xs px-6 py-3 font-bold rounded-xl cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
