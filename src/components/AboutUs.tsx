import React from 'react';
import { Target, Eye, ShieldCheck, Heart, Landmark, MapPin, Clock, Award, Sparkles } from 'lucide-react';

export default function AboutUs() {
  const milestones = [
    { year: "2018", title: "Inception in Manzini", desc: "Started as a small computer maintenance and laptop trading retail stall. Set up shop next to The Hub." },
    { year: "2021", title: "Wholesale Expansion", desc: "Certified as direct resellers for HP and Dell, initiating volume technology supplies to colleges and government institutions." },
    { year: "2024", title: "Printer & UPS Division", desc: "Formed dedicated divisions for battery backups (APC UPS) and multi-function ink-tank systems (Epson, Canon)." },
    { year: "2026", title: "Smart E-Commerce Portal", desc: "Launched full digital shopping capabilities and AI product recommendations tailored to Eswatini specs." }
  ];

  const values = [
    { icon: <ShieldCheck className="h-5 w-5 text-primary" />, label: "Genuine Guarantee", sub: "Only 100% factory original brand imports. No cheap clones, ever." },
    { icon: <Clock className="h-5 w-5 text-accent" />, label: "Reliable SLA Deliveries", sub: "Same day dispatch to Ezulwini, next-day to Matsapha and Manzini." },
    { icon: <Award className="h-5 w-5 text-emerald-500" />, label: "Native Warranty Care", sub: "Full local exchange or repair processing directly in our The Hub clinic." },
    { icon: <Landmark className="h-5 w-5 text-indigo-500" />, label: "Government Trust", sub: "Fully registered tax compliance, official vendor numbers, and formal quotes." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Intro Header */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-1.5 bg-primary/10 px-3 py-1 bg-primary/5 rounded-full text-xs font-semibold text-primary dark:text-blue-400 mb-2">
          <Sparkles className="h-4 w-4" />
          <span>Our Company Story</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          About Briteman Services
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Eswatini's premium multi-channel electronics retailer and contract wholesaler, supplying computing excellence from Manzini to all outer zones.
        </p>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-center">
        
        {/* Story copy left */}
        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Supplying Eswatini With Authentic, Grade-A Electronics Since 2018
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Founded with a single core mission—to bring world-class hardware standards to Manzini shoppers—<b>Briteman Services</b> (branded to our clients as <b>Briteman Electronics</b>) has grown to become Eswatini's most trustworthy computer supply partner. 
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            By avoiding unreliable gray imports and maintaining absolute commercial transparency, we construct durable procurement channels for government agencies, private corporate suites, leading colleges, and local retail shoppers. Our highly trained Manzini engineers inspect each device, certify brand new and premium pre-owned conditions, and setup customized software to ensure your office transitions seamlessly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-start space-x-3 shadow-sm">
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Our Mission</h4>
                <p className="text-slate-400 text-[11px] mt-1">To provision affordable, high-end laptops, printers, and backup systems with impeccable local support.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-start space-x-3 shadow-sm">
              <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Our Vision</h4>
                <p className="text-slate-400 text-[11px] mt-1">To bridge digital divides across Eswatini by deploying durable smart networks and learning computers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info card right */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase pb-3 border-b dark:border-slate-800">
            Physical Store Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 text-xs">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Manzini Branch:</span>
                  <span className="text-slate-500 block mt-0.5 leading-normal">
                    P.O.BOX C1901, THE HUB<br />
                    Manzini, Eswatini
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Mbabane Branch:</span>
                  <span className="text-slate-500 block mt-0.5 leading-normal">
                    LM Building Unit 10, Somhlolo Road<br />
                    Next to Lilunga House, SRIC Route, H100<br />
                    Mbabane, Eswatini
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-xs border-t dark:border-slate-800 pt-4">
              <Clock className="h-5 w-5 text-accent shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Operating Hours:</span>
                <div className="text-slate-500 mt-1 space-y-0.5">
                  <p>📅 Monday - Friday: <b className="font-semibold text-slate-800 dark:text-white font-mono">08:00 AM - 05:00 PM</b></p>
                  <p>📅 Saturday: <b className="font-semibold text-slate-800 dark:text-white font-mono">08:30 AM - 01:00 PM</b></p>
                  <p>📅 Sunday: <span className="text-red-500 font-semibold uppercase">Closed</span></p>
                  <p>📅 Public Holidays: <b className="font-semibold text-slate-800 dark:text-white font-mono">08:00 AM - 02:00 PM</b></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-800 flex justify-between items-center text-xs">
            <div className="text-left">
              <span className="text-slate-400">Direct Office Lines:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white block mt-1">+268 3450 1703</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white block mt-0.5">+268 7662 3733</span>
            </div>
            <span className="text-3xl text-emerald-500 select-none">🇸🇿</span>
          </div>
        </div>

      </div>

      {/* Core Values Section */}
      <div className="mb-16 border-t dark:border-slate-800 pt-10">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-8 uppercase tracking-widest">
          Foundational Values We Defend
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl w-fit">
                {v.icon}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{v.label}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">{v.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Company Milestones */}
      <div className="border-t dark:border-slate-800 pt-10 mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-8 uppercase tracking-widest">
          Company Milestones
        </h3>
        
        <div className="relative border-l border-slate-250 dark:border-slate-750 ml-4 md:ml-12 space-y-8">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-6 md:pl-10 text-left">
              <span className="absolute -left-3 top-0.5 bg-primary dark:bg-accent ring-4 ring-white dark:ring-dark-bg text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                {m.year}
              </span>
              <h4 className="font-bold text-slate-950 dark:text-white text-sm md:text-base">{m.title}</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
