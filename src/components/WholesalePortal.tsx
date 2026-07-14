import React, { useState } from 'react';
import { 
  Upload, ChevronRight, FileSpreadsheet, Send, ShieldCheck, 
  CheckSquare, Briefcase, Landmark, School, Award, Sparkles, 
  FolderUp, HelpCircle, Phone, Mail, Clock, Shield, Search, 
  CircleDollarSign, Users, Trash2, CheckCircle2, AlertCircle, FileText,
  Truck
} from 'lucide-react';
import { Product, WholesaleQuoteRequest, WholesaleProfile } from '../types';

interface WholesalePortalProps {
  products: Product[];
  onSubmitQuote: (quoteData: any) => void;
  onSubmitRegistration: (regData: any) => void;
  quotes: WholesaleQuoteRequest[];
  registrations: WholesaleProfile[];
}

export default function WholesalePortal({
  products,
  onSubmitQuote,
  onSubmitRegistration,
  quotes = [],
  registrations = []
}: WholesalePortalProps) {
  
  // Registration States
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState<'Retailer' | 'School' | 'College' | 'Government Department' | 'Corporate'>('Corporate');
  const [regSuccess, setRegSuccess] = useState(false);

  // Quote States
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number; notes?: string }[]>([]);
  const [tempProduct, setTempProduct] = useState(products[0]?.id || '');
  const [tempQty, setTempQty] = useState(10);
  const [tempNotes, setTempNotes] = useState('');

  // File Upload states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Search Quote Status
  const [searchEmail, setSearchEmail] = useState('');
  const [searched, setSearched] = useState(false);

  // Pricing helper variables
  const VAT_RATE = 0.15;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleAddItem = () => {
    if (!tempProduct) return;
    const existingIdx = selectedItems.findIndex(i => i.productId === tempProduct);
    if (existingIdx !== -1) {
      const updated = [...selectedItems];
      updated[existingIdx].quantity += tempQty;
      if (tempNotes) {
        updated[existingIdx].notes = updated[existingIdx].notes 
          ? `${updated[existingIdx].notes}, ${tempNotes}`
          : tempNotes;
      }
      setSelectedItems(updated);
    } else {
      setSelectedItems([...selectedItems, { productId: tempProduct, quantity: tempQty, notes: tempNotes }]);
    }
    setTempNotes('');
  };

  const handleRemoveItem = (idx: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !email || !phone) return;

    onSubmitRegistration({
      companyName,
      contactPerson,
      email,
      phone,
      businessType
    });

    setRegSuccess(true);
    // Let user stay pending or search afterwards
    setSearchEmail(email); 
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCompany || !quoteEmail || (selectedItems.length === 0 && !uploadedFile)) return;

    const itemsFormatted = selectedItems.map(item => {
      const prod = products.find(p => p.id === item.productId);
      return {
        productName: prod ? prod.name : 'Unknown Product',
        quantity: item.quantity,
        notes: item.notes
      };
    });

    onSubmitQuote({
      companyName: quoteCompany,
      email: quoteEmail,
      phone: quotePhone,
      businessType: 'Wholesale Client',
      message: notes,
      items: itemsFormatted,
      uploadedFileList: uploadedFile || undefined
    });

    setSearchEmail(quoteEmail);
    setQuoteSuccess(true);
    
    // Clear quote build states
    setQuoteCompany('');
    setQuotePhone('');
    setSelectedItems([]);
    setNotes('');
    setUploadedFile(null);
  };

  // Filter quotes and approvals for live dynamic search & tracking
  const matchingQuotes = quotes.filter(q => 
    q.email.toLowerCase().includes(searchEmail.toLowerCase().trim()) || 
    q.companyName.toLowerCase().includes(searchEmail.toLowerCase().trim())
  );

  const matchingRegs = registrations.filter(r => 
    r.email.toLowerCase().includes(searchEmail.toLowerCase().trim()) || 
    r.companyName.toLowerCase().includes(searchEmail.toLowerCase().trim())
  );

  return (
    <div id="wholesale-portal-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. SECTION: HERO HEADER */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden text-left border border-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/25 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-accent/20 border border-accent/20 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-accent uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DIRECT BULK SUPPLY CHANNEL</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Corporate, School & Government Procurement Portal
          </h1>
          
          <p className="text-sm sm:text-base text-slate-350 leading-relaxed font-light max-w-3xl">
            Welcome to the official <b>Briteman Services</b> commercial desk in Manzini. Register your organization or dispatch your RFQ requirements lists directly to our specialist bidding coordinators. We supply verified grade-A hardware and power infrastructure solutions to ministries, educational institutes, and independent retailers across Eswatini.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 text-xs font-mono">
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.8 rounded-xl border border-white/10">
              <Phone className="h-4 w-4 text-accent" />
              <span>Commercial Line: +268 3450 1703</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.8 rounded-xl border border-white/10">
              <Mail className="h-4 w-4 text-accent" />
              <span>Email: tender@briteman.sz</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTION: WHOLESALE BENEFITS (Requested Feature) */}
      <div className="space-y-6 text-left">
        <div>
          <span className="text-xs font-mono font-black text-primary uppercase tracking-widest block">★ PREMIUM INCENTIVE SCALE</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1">
            Registered Wholesale Benefits
          </h2>
          <p className="text-sm text-slate-400">Unlock specialized commercial protections, optimized tax billing ledgers, and priority support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Benefit 1: Volume Discounts */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm hover:translate-y-[-2px] transition duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl w-fit text-primary">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Volume Discounts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlock sliding-scale markdowns based on unit quantities. Save <b>5%</b> on orders of 5+, <b>10%</b> for 10+, and up to <b>15%</b> on massive bulk counts of 25+ units.
            </p>
            <div className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-1 rounded w-fit">
              UP TO 15% VALUE OFFSET
            </div>
          </div>

          {/* Benefit 2: Special Pricing */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm hover:translate-y-[-2px] transition duration-300">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl w-fit text-accent">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Special Pricing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We offer exclusive customized pricing matrices for authorized colleges, school clinics, and NGOs to meet statutory budget schedules and tender allowances.
            </p>
            <div className="text-[10px] font-mono text-accent font-bold bg-accent/15 px-2 py-1 rounded w-fit">
              CUSTOM PROCUREMENT BID RATES
            </div>
          </div>

          {/* Benefit 3: Dedicated Account Manager */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm hover:translate-y-[-2px] transition duration-300">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl w-fit text-emerald-500">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Dedicated Account Manager</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A personal coordinator on The Hub assists with administrative paperwork, local government compliance audits, and custom equipment upgrades.
            </p>
            <div className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-100/30 px-2 py-1 rounded w-fit">
              1-ON-1 DESK SERVICE
            </div>
          </div>

          {/* Benefit 4: Fast Fulfillment */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm hover:translate-y-[-2px] transition duration-300">
            <div className="p-3 bg-violet-50 dark:bg-violet-950/40 rounded-xl w-fit text-violet-500">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Fast Fulfillment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wholesale accounts occupy an isolated express pick lane in our central Manzini showroom. Guaranteed next-day courier delivery or immediate local staging.
            </p>
            <div className="text-[10px] font-mono text-violet-600 font-bold bg-violet-100/30 px-2 py-1 rounded w-fit">
              PRE-SORTED ASSEMBLY LINE
            </div>
          </div>

        </div>
      </div>

      {/* 3. SECTION: DYNAMIC SECTIONS GRID - REGISTER PROFILE & SUBMIT QUOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: STUNNING QUOTE REQUEST CENTER (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-left space-y-6 shadow-sm">
          <div>
            <div className="flex items-center space-x-2 text-primary font-bold">
              <FileSpreadsheet className="h-5 w-5" />
              <span className="text-xs uppercase font-mono font-black">PROCUREMENTS BID DESK</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mt-1">
              Request Quotations
            </h3>
            <p className="text-xs text-slate-400">
              Submit custom equipment requirements via our interactive quotation matrix or snap and drop your complete spreadsheet draft directly.
            </p>
          </div>

          {quoteSuccess ? (
            <div className="bg-emerald-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-emerald-100 dark:border-slate-800 text-center space-y-4">
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-xl">
                ✓
              </div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Quotation Ticket Logged!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Your request details have been dispatched. We will review inventory stocks and apply our pro-forma custom pricing. Live quote tracking details have been refreshed below.
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  id="search-recently-quote-btn"
                  onClick={() => {
                    setQuoteSuccess(false);
                    // Scroll to tracker below
                    const tracker = document.getElementById('live-custom-price-tracker');
                    if (tracker) tracker.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-emerald-600 hover:bg-emerald-750 text-white text-xs px-4 py-2 font-bold rounded-xl cursor-pointer"
                >
                  Track Quote Status
                </button>
                <button
                  id="reset-quote-form"
                  onClick={() => setQuoteSuccess(false)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs px-4 py-2 font-bold rounded-xl cursor-pointer hover:bg-slate-200"
                >
                  Configure Another RFP
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-5">
              
              {/* Contact subgrid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-550 mb-1">Company / Institution *</label>
                  <input
                    id="quote-org-input-new"
                    value={quoteCompany}
                    onChange={(e) => setQuoteCompany(e.target.value)}
                    type="text"
                    required
                    placeholder="e.g. Ebuhleni Health Clinic Hub"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-550 mb-1">Representative Corporate Email *</label>
                  <input
                    id="quote-email-input-new"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="procurement@clinic.gov.sz"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              {/* Multi-item Dynamic Bidding Line selector */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border dark:border-slate-800/80 text-xs">
                <span className="font-extrabold text-slate-800 dark:text-white block mb-2 uppercase tracking-wide text-[10px]">
                  Build Custom Multi-Line Request
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="text-[10px] text-slate-400 block mb-1">Model Selection</label>
                    <select
                      id="wholesale-bulk-device-select"
                      value={tempProduct}
                      onChange={(e) => setTempProduct(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[10px] text-slate-400 block mb-1">Batch Units</label>
                    <input
                      id="wholesale-batch-units"
                      type="number"
                      min="1"
                      value={tempQty}
                      onChange={(e) => setTempQty(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-center font-bold text-xs rounded-lg"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      id="add-custom-wholesale-product-line"
                      type="button"
                      onClick={handleAddItem}
                      className="w-full bg-primary hover:bg-primary-hover text-white font-bold p-2.5 rounded-lg text-xs cursor-pointer"
                    >
                      Add Line
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-[10px] text-slate-450 block mb-1">Customizations / Extra Hardware Configuration (Optional):</label>
                  <input
                    id="wholesale-line-notes-input"
                    type="text"
                    placeholder="e.g. Requires Ubuntu LTS setup, 16GB memory boost, or matching charger bundles."
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    className="w-full p-2 bg-white dark:bg-slate-950 border dark:border-slate-800 text-xs rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Added Items Table */}
              {selectedItems.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner bg-slate-50/50">
                  <table className="w-full text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-[9px] uppercase font-bold text-slate-450 border-b dark:border-slate-800">
                      <tr>
                        <th className="p-3 text-left">Hardware Item</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-left">Hardware Notes</th>
                        <th className="p-3 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {selectedItems.map((item, idx) => {
                        const prod = products.find(p => p.id === item.productId);
                        return (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-slate-900 dark:text-white">{prod ? prod.name : 'Unknown'}</td>
                            <td className="p-3 text-center font-black font-mono bg-slate-100/30 dark:bg-slate-900/30 text-primary">{item.quantity} units</td>
                            <td className="p-3 text-slate-500 italic max-w-xs truncate">{item.notes || 'Standard'}</td>
                            <td className="p-3 text-center">
                              <button
                                id={`delete-quote-line-btn-${idx}`}
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-red-500 hover:text-red-700 p-1 rounded transition"
                                title="Remove Line"
                              >
                                <Trash2 className="h-4 w-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DRAG-AND-DROP FILE UPLOADER (Requested Feature: Upload procurement lists) */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500">
                  Or Upload Direct Procurement Word/Excel/PDF Files *
                </span>
                
                <div
                  id="drag-and-drop-container-wholesale"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-accent bg-orange-50/10'
                      : uploadedFile
                        ? 'border-emerald-500 bg-emerald-50/5 dark:bg-slate-900/80'
                        : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 bg-slate-50/30 dark:bg-slate-950/20'
                  }`}
                >
                  <FolderUp className={`h-10 w-10 mb-2 ${uploadedFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                  
                  {uploadedFile ? (
                    <div className="text-xs space-y-1">
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold block uppercase tracking-wider text-[10px]">✓ Procurement List Verified!</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-bold block bg-white dark:bg-slate-900 p-2 rounded-lg border dark:border-slate-800 shadow-sm max-w-sm truncate mx-auto">{uploadedFile}</span>
                      <button
                        id="remove-uploaded-procurement-list"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-[10px] text-red-500 underline mt-2 block mx-auto font-semibold cursor-pointer"
                      >
                        Delete and load new file
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 space-y-1">
                      <p className="font-bold">Drag and drop your spreadsheet or official RFP document here</p>
                      <p className="text-[10px] text-slate-450 font-normal">Accepting Excel, PDF, CSV, or Word (Maximum 15MB)</p>
                      
                      <div className="pt-2">
                        <input
                          id="wholesale-list-uploader-input"
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="wholesale-list-uploader-input"
                          className="inline-block bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-250 px-4 py-2 rounded-xl text-[10px] font-bold cursor-pointer transition shadow-xs"
                        >
                          Select File from Computer
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special message input box */}
              <div>
                <label className="block text-xs font-semibold text-slate-550 mb-1">Logistics / Budgetary Remarks</label>
                <textarea
                  id="wholesale-quote-notes"
                  rows={2}
                  placeholder="Insert special instructions, e.g., 'Requires split delivery to Matsapha and Ezulwini' or 'Subject to Ministry of Finance vote clearances'."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <button
                id="dispatch-quotation-bidding-rfq"
                type="submit"
                disabled={selectedItems.length === 0 && !uploadedFile}
                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedItems.length === 0 && !uploadedFile
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border dark:bg-slate-800 dark:text-slate-650'
                    : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/15'
                }`}
              >
                <Send className="h-4 w-4" />
                <span>Dispatch Quotation Ticket</span>
              </button>

            </form>
          )}

        </div>

        {/* RIGHT COMPONENT: WHOLESALE ACCOUNT REGISTRATION (5 Columns) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-left flex flex-col justify-between shadow-xs h-full">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-accent font-bold">
                <Landmark className="h-5 w-5" />
                <span className="text-xs uppercase font-mono font-black">ACCUSTAT VERIFICATION</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mt-1">
                Wholesale Registration
              </h3>
              <p className="text-xs text-slate-400">
                Establish corporate buyer credentials to unlock standard Silver, Gold, or tier-one pricing keys.
              </p>
            </div>

            {regSuccess ? (
              <div className="bg-emerald-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-emerald-200 dark:border-slate-850 text-center space-y-4">
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 font-bold text-lg">
                  ✓
                </div>
                <h4 className="font-bold text-emerald-800 dark:text-emerald-400">Registration Lodged</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Dossier received! Our Manzini accounts supervisor is reviewing commercial tax registry certificates. We've initiated a tracking session for you.
                </p>
                
                <button
                  id="reg-check-status-direct-btn"
                  onClick={() => {
                    setRegSuccess(false);
                    const tracker = document.getElementById('live-custom-price-tracker');
                    if (tracker) tracker.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-accent hover:bg-accent-hover text-white text-xs px-4 py-2 font-bold rounded-xl cursor-pointer"
                >
                  Verify Registration Status
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-550 mb-1 font-sans">Organization Legal Name *</label>
                  <input
                    id="wholesale-reg-company-name-new"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    type="text"
                    required
                    placeholder="e.g. Manzini Educational Trust Dept"
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-550 mb-1">Primary Representative *</label>
                  <input
                    id="wholesale-reg-rep-new"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    type="text"
                    required
                    placeholder="e.g. Sipho Dlamini (Procurement Lead)"
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-550 mb-1">Institutional Category *</label>
                  <select
                    id="wholesale-reg-business-type-new"
                    value={businessType}
                    onChange={(e: any) => setBusinessType(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none text-xs font-bold"
                  >
                    <option value="Retailer">Retailer (Local Electronics Showroom)</option>
                    <option value="School">School (Secondary / Learning Academy)</option>
                    <option value="College">College (Tertiary / University Lab)</option>
                    <option value="Government Department">Government Department / Ministry Agency</option>
                    <option value="Corporate">Corporate (Enterprise / Private Sector Office)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-550 mb-1">Email *</label>
                    <input
                      id="wholesale-reg-email-new"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      placeholder="finance@school.ac.sz"
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-550 mb-1">Telephone Line *</label>
                    <input
                      id="wholesale-reg-phone-new"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      required
                      placeholder="+268 7602 1100"
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                    />
                  </div>
                </div>

                <button
                  id="submit-wholesale-registration-btn-new"
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-hover text-white text-xs py-3.5 rounded-xl font-bold transition shadow-md shadow-accent/10 cursor-pointer"
                >
                  Apply for Wholesale Code
                </button>

              </form>
            )}
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-850 mt-6 space-y-1 text-xs shadow-xs text-left">
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center space-x-1 uppercase text-[10px] tracking-wide font-mono text-primary">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Sovereign Security Guarantee</span>
            </span>
            <p className="text-slate-450 text-[10.5px] leading-relaxed">
              Approved corporate clients receive a personalized <b>Corporate Buyer Code</b> that auto-clears tax percentages and triggers specialized bulk credit billing.
            </p>
          </div>
        </div>

      </div>

      {/* 4. SECTION: CODES & DYNAMIC CUSTOM PRICING TRACKER (Requested Feature: Receive Custom Pricing) */}
      <div id="live-custom-price-tracker" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 text-left relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              <span>● MULTI-TENANT VERIFIED LEDGER</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1.5">
              Live Custom Pricing & RFQ Tracker
            </h3>
            <p className="text-xs text-slate-400">
              Assigned custom contract rates and corporate approvals refresh automatically below. Enter your company email to search your records.
            </p>
          </div>

          {/* Search bar inputs */}
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              id="tracker-email-search-input"
              type="text"
              placeholder="Enter Organization Email or Name"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 text-white text-xs border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Live matching matrix displays */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10">
          
          {/* Tracker Column A: RFQ Bids & Custom Quoted Prices */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Bidding quote sheets &amp; Custom Negotiated Pricing</span>
            
            {matchingQuotes.length === 0 ? (
              <div className="bg-slate-950/40 p-12 rounded-2xl text-center border border-white/5 space-y-2">
                <AlertCircle className="h-6 w-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">No quotation tickets matched your query.</p>
                <p className="text-[10px] text-slate-600">Enter your email or submit a new proposal builder above to generate matching listings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchingQuotes.map((q) => (
                  <div key={q.id} className="bg-slate-950/70 p-5 rounded-2xl border border-white/5 space-y-4 shadow-sm hover:border-white/10 transition">
                    
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] bg-slate-900 border border-white/10 text-slate-400 px-2 py-0.5 rounded-md font-mono font-bold">
                          RFQ ID: {q.id}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{q.companyName}</h4>
                        <p className="text-[10px] text-slate-500">Representative: {q.email} | {q.phone}</p>
                      </div>

                      <div className="text-right">
                        {q.status === 'Approved' ? (
                          <div className="text-right space-y-1">
                            <span className="inline-flex bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Approved Customized Rate
                            </span>
                            <div className="text-lg font-black font-mono text-emerald-400">
                              E{q.assignedPrice?.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="text-right space-y-1">
                            <span className="inline-flex bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                              Awaiting Showroom Bid
                            </span>
                            <div className="text-[10px] text-slate-500 italic block">
                              Recalculating stock bundles...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black font-mono block">Procured Items checklist</span>
                      
                      {q.items && q.items.length > 0 ? (
                        <div className="space-y-1.5 text-slate-350">
                          {q.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                              <span className="font-light">• {item.productName}:</span>
                              <span className="font-bold font-mono text-white text-[11px] shrink-0">{item.quantity} units</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-slate-450 italic text-[11px]">
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                          <span>Checklist uploaded in Background: <b>{q.uploadedFileList || 'Excel-Procurement.xlsx'}</b></span>
                        </div>
                      )}
                    </div>

                    {q.status === 'Approved' && (
                      <div className="pt-2 border-t border-white/5 flex flex-wrap justify-between items-center text-[11px] gap-2">
                        <span className="text-emerald-500/90 font-bold block">✓ Custom contract approved by Manzini Accounts Hub</span>
                        
                        <a
                          id={`quote-whatsapp-checkout-${q.id}`}
                          href={`https://wa.me/26876623733?text=${encodeURIComponent(`Hi Briteman, I would like to finalize our custom approved quote Reference: ${q.id} for the total negotiated sum of E${q.assignedPrice?.toLocaleString()}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-500 hover:bg-emerald-650 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider cursor-pointer"
                        >
                          <span>Direct Order via WhatsApp</span>
                        </a>
                      </div>
                    )}

                  </div>
                ))}

                {/* Helpful instructions */}
                <p className="text-[10px] text-slate-500 text-left pt-2">
                  * Tip: Test live pricing! Navigate to the <b>Admin panel</b> linked in the footer, go to the <b>Wholesale Hub</b> tab, type an <b>Approved Price Quote</b> for any of these RFQs and click 'Approve Bid', then return here to witness the status refresh with the custom contract price live.
                </p>
              </div>
            )}
          </div>

          {/* Tracker Column B: Wholesale Profile Silver/Gold Tiers */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Wholesale Profile Review &amp; Tier Assignments</span>
            
            {matchingRegs.length === 0 ? (
              <div className="bg-slate-950/40 p-12 rounded-2xl text-center border border-white/5 space-y-2">
                <Shield className="h-6 w-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">No profile registrations matched your query.</p>
                <p className="text-[10px] text-slate-600">Apply utilizing the registration form to enable Gold profile tracking.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matchingRegs.map((r) => (
                  <div key={r.id} className="bg-slate-950/70 p-5 rounded-2xl border border-white/5 space-y-3.5 shadow-sm hover:border-white/10 transition">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-slate-900 border border-white/10 text-slate-400 px-2 py-0.5 rounded font-mono">
                          REG: {r.id}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{r.companyName}</h4>
                        <p className="text-[10px] text-slate-450">{r.businessType}</p>
                      </div>

                      {r.status === 'Approved' ? (
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-black uppercase px-2 py-1 rounded-md animate-pulse">
                          ✓ GOLD CODES GRANTED
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-md">
                          PENDING SLA REVIEW
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-normal space-y-1">
                      <p><b>Manager:</b> {r.contactPerson}</p>
                      <p><b>Direct Hotline:</b> {r.phone}</p>
                      <p><b>Assigned SLA:</b> {r.status === 'Approved' ? '30-Day Credit Authorized' : 'Legal documents pending'}</p>
                    </div>

                    {r.status === 'Approved' ? (
                      <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/15 rounded-lg text-[10px] text-emerald-400 font-medium">
                        ★ Code active: <b>BRITE-BULK-GOLD-26</b> is linked to your billing email. Enjoy automatic showroom custom catalog pricing.
                      </div>
                    ) : (
                      <div className="p-2.5 bg-slate-900/60 border border-white/5 rounded-lg text-[10px] text-slate-550 italic">
                        Our Manzini compliance officer is verifying tax letters. Review status can be speed-approved inside the Admin console in seconds.
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
