import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate sending contact request
    setSuccess(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const contactDetails = [
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      label: "Phone Contact Lines",
      val1: "+268 3450 1703 (Mbabane desk)",
      val2: "+268 7662 3733 (Hotline / WhatsApp)",
      sub: "Available during operating schedules"
    },
    {
      icon: <Mail className="h-5 w-5 text-accent" />,
      label: "Electronic Mail",
      val1: "ajapresd@gmail.com",
      val2: "support@britemanelectronics.com",
      sub: "General ticketing response within 2 hours"
    },
    {
      icon: <MapPin className="h-5 w-5 text-emerald-500" />,
      label: "Physical Address Location",
      val1: "LM Building Unit 10, Somhlolo Road",
      val2: "Next to Lilunga House, SRIC Route, H100",
      sub: "Mbabane, Eswatini"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-left mb-12">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Connect With Our Mbabane Store Team
        </h2>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Have questions about specific configurations, printer drivers, bulk wholesale registry, or delivery times? Send us a ticket or drop by our showroom.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Contact Information & Map */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          <div className="space-y-4">
            {contactDetails.map((c, idx) => (
              <div key={idx} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-start space-x-4 shadow-sm hover:border-slate-350 dark:hover:border-slate-700 transition">
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                  {c.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.label}</h4>
                  <p className="font-mono text-xs text-slate-755 dark:text-slate-300 font-semibold">{c.val1}</p>
                  {c.val2 && <p className="font-mono text-xs text-slate-755 dark:text-slate-300 font-semibold">{c.val2}</p>}
                  <p className="text-[10px] text-slate-400 font-medium">{c.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Map Block */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Mbabane Store Location Map</span>
              </span>
              <span className="text-primary font-bold">SRIC Route</span>
            </div>

            {/* Structured CSS representation of a map since iframe maps may fail standard viewport restrictions */}
            <div className="h-48 bg-slate-150 dark:bg-slate-950 rounded-xl relative overflow-hidden border dark:border-slate-850 flex flex-col items-center justify-center p-4">
              <div className="absolute inset-x-0 h-4 bg-slate-250 dark:bg-slate-900 top-1/3 transform -rotate-2"></div> {/* Somhlolo Road */}
              <div className="absolute inset-y-0 w-4 bg-slate-250 dark:bg-slate-900 left-1/3 transform -rotate-12"></div> {/* SRIC crossing Route */}
              
              {/* Lilunga House representation */}
              <div className="absolute top-1/4 right-1/4 bg-slate-300 dark:bg-slate-800 border dark:border-slate-700 p-2 text-[10px] font-bold rounded shadow-sm text-slate-650">
                🏢 Lilunga House Block
              </div>

              {/* Briteman Services Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center animate-bounce">
                <div className="bg-accent text-white p-2.5 rounded-full shadow-lg border-2 border-white scale-110">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="bg-slate-950 text-white rounded px-2 py-1 text-[9px] font-bold font-display uppercase tracking-wider mt-1 shadow border border-slate-800 whitespace-nowrap">
                  BRITEMAN SERVICES
                </div>
              </div>

              <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-slate-900/95 border dark:border-slate-800 px-2 py-1 rounded text-[10px] text-left text-slate-500">
                📍 LM Building Unit 10, Somhlolo Rd
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>We are situated across from the SRIC head offices next to Lilunga House.</span>
            </div>
          </div>

        </div>

        {/* Right Side: Message form */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-left">
          
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">
              Submit Customer Support Ticket
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Let us know if you require setup support, spare laptop adapters, or volume quotes.</p>
          </div>

          {success ? (
            <div className="bg-emerald-50 dark:bg-slate-900/40 p-10 rounded-2xl border border-emerald-100 dark:border-slate-800 text-center space-y-4">
              <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto text-emerald-600">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Message Dispatched!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-normal">
                Thank you. Your message ticket has been logged into our support database. Our local technicians will review your specifications and email you within 2 hour periods.
              </p>
              <button
                id="reset-contact-form"
                onClick={() => setSuccess(false)}
                className="bg-primary hover:bg-primary-hover text-white text-xs px-5 py-2.5 font-bold rounded-lg cursor-pointer"
              >
                Send Another Ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Your Full Name *</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    placeholder="e.g. Sipho Dlamini"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-850 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Your Email Address *</label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    placeholder="siphod@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-850 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Telephone Contact (Optional)</label>
                  <input
                    id="contact-phone-input"
                    type="text"
                    placeholder="e.g. +268 7662 3733"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-850 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Topic *</label>
                  <select
                    id="contact-subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-850 dark:text-white rounded-xl focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="Product Inquiry">Electronics Product Inquiry</option>
                    <option value="Wholesale Quote">Corporate Wholesale Quotation</option>
                    <option value="Government Tender">Government tender submission</option>
                    <option value="Service Support">Hardware repair service clinic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Detailed Message Ticket *</label>
                <textarea
                  id="contact-message-input"
                  required
                  rows={4}
                  placeholder="Describe specified computer configurations, bulk printers requirements, or help needed..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 text-slate-850 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs py-3.5 rounded-xl font-bold transition shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Submit Ticket</span>
              </button>

            </form>
          )}

          <div className="mt-8 pt-6 border-t dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-455">Or immediate WhatsApp hotlines:</span>
            <a
              id="contact-direct-wa"
              href="https://wa.me/26876623733"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-slate-800 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold flex items-center space-x-1 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Direct Chat</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
