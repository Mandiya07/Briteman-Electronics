import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ClipboardList, ShieldAlert, CheckCircle2, TrendingUp, Boxes, Briefcase, Plus, RefreshCw, Layers, Percent, Trash2, Tag } from 'lucide-react';
import { Product, Order, WholesaleQuoteRequest, WholesaleProfile, Coupon } from '../types';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  quotes: WholesaleQuoteRequest[];
  registrations: WholesaleProfile[];
  onUpdateStock: (id: string, qty: number) => void;
  onApproveQuote: (id: string, customPrice: number) => void;
  onApproveRegistration: (id: string) => void;
  // Dynamic Coupons Management
  coupons: Coupon[];
  onCreateCoupon: (c: { code: string; percent: number; description: string }) => void;
  onToggleCoupon: (code: string) => void;
  onDeleteCoupon: (code: string) => void;
}

export default function AdminDashboard({
  products,
  orders,
  quotes,
  registrations,
  onUpdateStock,
  onApproveQuote,
  onApproveRegistration,
  coupons = [],
  onCreateCoupon,
  onToggleCoupon,
  onDeleteCoupon
}: AdminDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'wholesale' | 'discounts'>('overview');
  
  // Custom price setter for wholesale quotes
  const [quotePrices, setQuotePrices] = useState<{ [key: string]: number }>({});
  
  // New coupon creation form states
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState(10);
  const [newDesc, setNewDesc] = useState('');

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

  // Metrics calculators
  const lifetimeSales = (orders || []).reduce((acc, curr) => acc + (curr.total || 0), 0) + 148500; // adding seed sales
  const outstandingRequestsCount = quotes.filter(q => q.status === 'Pending').length;
  const pendingRegsCount = registrations.filter(r => r.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Title */}
      <div className="flex flex-wrap justify-between items-end gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <span className="text-xs font-black text-red-500 uppercase tracking-widest block font-mono">🔑 SYSTEM ADMINISTRATIVE COMMAND</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-0.5">
            Briteman Electronics Admin Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure stock thresholds, audit customer invoices, and authorize wholesale bidding codes.</p>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border dark:border-slate-800">
          {[
            { id: 'overview', icon: <TrendingUp className="h-3.8 w-3.8" />, label: 'Overview' },
            { id: 'inventory', icon: <Boxes className="h-3.8 w-3.8" />, label: 'Inventory' },
            { id: 'orders', icon: <ClipboardList className="h-3.8 w-3.8" />, label: 'Orders' },
            { id: 'wholesale', icon: <Briefcase className="h-3.8 w-3.8" />, label: 'Wholesale Hub' },
            { id: 'discounts', icon: <Percent className="h-3.8 w-3.8 text-accent" />, label: 'Coupon Management' }
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

      {/* DASHBOARD STATISTICS CARDS HEADER PANEL */}
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

      {/* VIEW DETERMINATOR */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recharts Analytics Progression */}
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

          {/* Quick Logs rightside */}
          <div className="lg:col-span-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-left flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">System Diagnostics</span>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">API Core Database Server</p>
                    <p className="text-[11px] text-slate-455 font-mono">STATUS: 200 OK / IN-MEMORY</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-3 border-t dark:border-slate-850">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Gemini Recommendation Engine</p>
                    <p className="text-[11px] text-slate-455 font-mono">MODEL: gemini-2.5-flash / Active</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-3 border-t dark:border-slate-850">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Vite Reverse Proxy</p>
                    <p className="text-[11px] text-slate-455 font-mono">PORT: 3000 Ingress Routing</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-850 mt-6 text-xs text-slate-500 leading-normal">
              🔒 Admin actions are persistent within current container runtime thread logic.
            </div>
          </div>

        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Product stock quantities ledger</span>
            <span className="text-xs text-slate-400 font-mono">Adjust real-time numbers instantly</span>
          </div>

          <table className="w-full text-xs text-slate-750 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="p-4 text-left">Product Code</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Availability</th>
                <th className="p-4 text-center">Adjustment Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {products.map(p => (
                <tr key={p.id}>
                  <td className="p-4 font-mono font-bold text-primary">{p.sku}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
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
                        id={`inv-dec-${p.id}`}
                        onClick={() => onUpdateStock(p.id, p.stock - 1)}
                        className="h-7 w-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 border dark:border-slate-700 font-bold rounded flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-xs px-2">{p.stock}</span>
                      <button
                        id={`inv-inc-${p.id}`}
                        onClick={() => onUpdateStock(p.id, p.stock + 1)}
                        className="h-7 w-7 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 border dark:border-slate-700 font-bold rounded flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            <table className="w-full text-xs text-slate-750 dark:text-slate-300">
              <thead className="bg-slate-150 dark:bg-slate-900 text-[10px] uppercase font-bold text-slate-500">
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
          )}
        </div>
      )}

      {activeTab === 'wholesale' && (
        <div className="space-y-8 text-left">
          
          {/* Wholesale Bidding list */}
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
                                id={`assign-price-${q.id}`}
                                type="number"
                                placeholder="Enter Price"
                                value={quotePrices[q.id] || ''}
                                onChange={(e) => handlePriceChange(q.id, Number(e.target.value))}
                                className="w-24 p-1.5 bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs rounded-lg"
                              />
                            </div>
                            <button
                              id={`approve-quote-btn-${q.id}`}
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

                    {/* Items table requested */}
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

          {/* Wholesale registrations */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b dark:border-slate-850">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Wholesale account credentials registration approvals</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Authorise silver, gold, and platinum wholesale licenses.</p>
            </div>

            {registrations.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <p>No business registration tickets exist in current thread lists.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-slate-755 dark:text-slate-300">
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{r.companyName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{r.email}</p>
                      </td>
                      <td className="p-4 font-semibold">{r.contactPerson}</td>
                      <td className="p-4 text-center font-mono text-primary font-semibold">{r.businessType}</td>
                      <td className="p-4 text-center">
                        {r.status === 'Approved' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            ✓ ACTIVE ACCOUNT
                          </span>
                        ) : (
                          <button
                            id={`approve-reg-btn-${r.id}`}
                            onClick={() => onApproveRegistration(r.id)}
                            className="bg-primary hover:bg-primary-hover text-white text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                          >
                            Authorize Gold Tier
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* DISCOUNTS AND COUPONS MANAGEMENT TAB */}
      {activeTab === 'discounts' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 p-6 rounded-3xl shadow-sm text-left">
            <h3 className="text-lg font-black uppercase text-slate-905 dark:text-white flex items-center mb-2">
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
                  id="admin-new-coupon-code"
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
                  id="admin-new-coupon-percent"
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
                    id="admin-new-coupon-desc"
                    type="text"
                    placeholder="e.g. 15% Mobile Money Discount"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                  <button
                    id="admin-new-coupon-submit-btn"
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white rounded-xl px-5 py-2.5 font-black uppercase text-[11px] shrink-0 cursor-pointer shadow-md"
                  >
                    Add Code
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 font-mono text-left bg-slate-50 dark:bg-slate-905/30">
              <span className="text-[10px] uppercase font-black text-slate-400 block font-mono">⚡ LIVE COMMERCIAL DISCOUNTS</span>
              <h4 className="text-sm font-bold text-slate-905 dark:text-white">Active Promotional System Rules</h4>
            </div>

            {coupons.length === 0 ? (
              <div className="p-16 text-center text-slate-450">
                <p>No coupon discount rates currently declared in active listing arrays.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-slate-755 dark:text-slate-300 text-left">
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
                    <tr key={c.code} className="hover:bg-slate-50/55 dark:hover:bg-slate-900/30">
                      <td className="p-4">
                        <span className="font-mono font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-lg uppercase">
                          {c.code}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{c.percent}% OFF</td>
                      <td className="p-4 text-slate-500">{c.description}</td>
                      <td className="p-4 text-center">
                        <button
                          id={`toggle-coupon-btn-${c.code}`}
                          onClick={() => onToggleCoupon(c.code)}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer ${
                            c.active
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-450'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-450'
                          }`}
                        >
                          {c.active ? '● Active' : '○ Suspended'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          id={`delete-coupon-btn-${c.code}`}
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
            )}
          </div>

        </div>
      )}

    </div>
  );
}
