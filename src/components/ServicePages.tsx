import React, { useState, useEffect } from 'react';
import { Laptop, ClipboardList, PenTool, Truck, RefreshCw, Printer, Sparkles, PhoneCall, CheckSquare } from 'lucide-react';

interface ServicePagesProps {
  onTabChange: (tab: string) => void;
}

export default function ServicePages({ onTabChange }: ServicePagesProps) {
  const [serviceItems, setServiceItems] = useState(() => {
    const saved = localStorage.getItem('briteman_services');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "it-solutions",
        title: "Business IT Solutions",
        desc: "Comprehensive desktop, server room, and network router setups for corporate offices throughout Manzini and Matsapha. Includes structured cabling, firewall installations, and standard Microsoft environment prep.",
        details: ["Corporate active directories", "TP-Link / Cisco networking", "Active backup routines", "SLA Support contracts"]
      },
      {
        id: "school-supply",
        title: "School Technology Supply",
        desc: "Empowering Eswatini's student classrooms. We supply bulk student laptops, teaching projectors, printer paper stations, and kids retro educational consoles to schools with specialized school-ledger credit limits.",
        details: ["Bulk educational laptops", "TPM secure teaching laptops", "Projector & smartboards", "Retro learning nodes"]
      },
      {
        id: "delivery-pickup",
        title: "Secure Delivery & Manzini Pickup",
        desc: "Fast, secure transit directly to any school district or industrial office in Ezulwini, Manzini, Siteki, and Piggs Peak. Alternatively, enjoy free, immediate over-the-counter pickups at Unit 10, The Hub.",
        details: ["Manzini Pickup: FREE", "Same Day Ezulwini Delivery", "Tracked Courier packages", "VAT invoice attached"]
      },
      {
        id: "printer-solutions",
        title: "Printer Cartridge-Free Solutions",
        desc: "Official distribution of Canon PIXMA and Epson EcoTanks. We consult on bulk ink tank conversions, reducing annual overhead expenses by up to 90%. Authorized maintenance and genuine ink refills.",
        details: ["EcoTank conversions", "Canon wireless ink-tank sets", "Genuine brand bottled ink", "Fast repair assistance"]
      }
    ];
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('briteman_services');
      if (saved) {
        try { setServiceItems(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('services-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('services-updated', handleUpdate as EventListener);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro Header */}
      <div className="text-left mb-12">
        <div className="inline-flex items-center space-x-1.5 bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold text-primary dark:text-blue-400">
          <Sparkles className="h-4 w-4" />
          <span>Core IT Capabilities</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-2">
          Professional Services & Technology Solutions
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          More than simply a laptop shop. Briteman Services acts as a robust technology implementation partner, provisioning infrastructure assets with fully dedicated customer satisfaction SLAs.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {serviceItems.map((s) => (
          <div
            id={`service-block-${s.id}`}
            key={s.id}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-left space-y-4 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300"
          >
            <div className="p-3.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border dark:border-slate-800">
              {s.image ? (
                <img src={s.image} alt={s.title} className="h-6 w-6 object-cover rounded-lg" />
              ) : (
                <Laptop className="h-6 w-6 text-primary" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>

            <div className="pt-3 border-t dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Service parameters include</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {s.details.map((d, i) => (
                  <div key={i} className="flex items-center space-x-1.5">
                    <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Conversion panel */}
      <div className="bg-gradient-to-r from-primary via-blue-950 to-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-tight">
            Need customized technology setups for your Manzini office?
          </h3>
          <p className="text-sm text-slate-300 font-light">
            Our technology technicians design customized configurations with APC load-shedding backup circuits, bulk HP EliteBooks, and multi-user configurations to fit unique operational budgets.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              id="services-quote-cta"
              onClick={() => onTabChange('wholesale')}
              className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-xl font-bold text-xs transition uppercase tracking-wider cursor-pointer"
            >
              Request Custom Quote
            </button>

            <button
              id="services-contact-cta"
              onClick={() => onTabChange('contact')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-xs transition uppercase tracking-wider cursor-pointer"
            >
              Speak to IT Technician
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
