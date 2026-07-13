import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, MessageSquare, CheckCircle, Clock, ZoomIn, ZoomOut, Layers, Navigation, Compass, ExternalLink } from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Interactive map states
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<'blueprint' | 'satellite' | 'streets'>('blueprint');
  const [activePin, setActivePin] = useState<string | null>('briteman');
  const [showDirections, setShowDirections] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState('Mbabane CBD (Swazi Plaza)');

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

  const landmarks = [
    {
      id: 'briteman',
      title: 'Briteman Electronics Showroom',
      desc: 'Unit 10, LM Building, Somhlolo Road. Main computer & printer store.',
      coords: { top: '50%', left: '50%' },
      badge: 'HQ Store',
      color: 'bg-primary text-white'
    },
    {
      id: 'lilunga',
      title: 'Lilunga House',
      desc: 'Major corporate landmark along SRIC Route, Mbabane.',
      coords: { top: '28%', left: '72%' },
      badge: 'Landmark',
      color: 'bg-amber-500 text-white'
    },
    {
      id: 'sric',
      title: 'SRIC Head Offices',
      desc: 'Eswatini Royal Insurance Corporation complex.',
      coords: { top: '70%', left: '25%' },
      badge: 'Landmark',
      color: 'bg-indigo-600 text-white'
    }
  ];

  const directionsMap: Record<string, { time: string; distance: string; steps: string[] }> = {
    'Mbabane CBD (Swazi Plaza)': {
      time: '4 mins drive (1.8 km)',
      distance: '1.8 km',
      steps: [
        'Head northeast from Swazi Plaza toward Somhlolo Road',
        'Continue straight past Independence roundabout onto Somhlolo Rd',
        'Pass Lilunga House on your right',
        'Arrive at LM Building Unit 10 (Briteman Electronics)'
      ]
    },
    'Ezulwini Valley (Corner Plaza)': {
      time: '12 mins drive (11.4 km)',
      distance: '11.4 km',
      steps: [
        'Take MR3 highway northbound toward Mbabane',
        'Take the Mbabane city exit onto Somhlolo Road',
        'Continue down Somhlolo Road past SRIC head offices',
        'Briteman Electronics is on your left at LM Building Unit 10'
      ]
    },
    'Manzini Bus Rank': {
      time: '28 mins drive (32.5 km)',
      distance: '32.5 km',
      steps: [
        'Join MR3 highway west toward Mbabane',
        'Proceed through Mahwalala / Ezulwini toll corridor',
        'Enter Mbabane via Somhlolo Road intersection',
        'Unit 10 LM Building is located right next to Lilunga House'
      ]
    }
  };

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
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Compass className="h-4 w-4 text-accent animate-spin" style={{ animationDuration: '10s' }} />
                <span>Interactive Mbabane Map</span>
              </span>
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => setMapMode('blueprint')}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[10px] cursor-pointer transition ${mapMode === 'blueprint' ? 'bg-primary text-white shadow' : 'text-slate-500'}`}
                >
                  Blueprint
                </button>
                <button
                  onClick={() => setMapMode('satellite')}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[10px] cursor-pointer transition ${mapMode === 'satellite' ? 'bg-primary text-white shadow' : 'text-slate-500'}`}
                >
                  Satellite
                </button>
              </div>
            </div>

            {/* Interactive Map Stage */}
            <div className={`h-64 rounded-2xl relative overflow-hidden border dark:border-slate-850 flex flex-col items-center justify-center p-4 transition-all duration-300 ${
              mapMode === 'satellite' 
                ? 'bg-slate-950 border-emerald-900/50' 
                : 'bg-slate-150 dark:bg-slate-900'
            }`}>
              
              {/* Zoom transform container */}
              <div 
                className="absolute inset-0 transition-transform duration-300 flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Road Grid lines */}
                <div className={`absolute inset-x-0 h-6 top-1/3 transform -rotate-3 transition-colors ${
                  mapMode === 'satellite' ? 'bg-slate-900/80 border-y border-emerald-500/20' : 'bg-slate-250 dark:bg-slate-850'
                }`}>
                  <span className="text-[9px] font-mono text-slate-400 px-3 uppercase tracking-widest">Somhlolo Road (H100)</span>
                </div>

                <div className={`absolute inset-y-0 w-6 left-1/3 transform -rotate-12 transition-colors ${
                  mapMode === 'satellite' ? 'bg-slate-900/80 border-x border-emerald-500/20' : 'bg-slate-250 dark:bg-slate-850'
                }`}></div>

                {/* Landmarks interactive pins */}
                {landmarks.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setActivePin(l.id)}
                    className="absolute cursor-pointer transition transform hover:scale-110 z-20"
                    style={{ top: l.coords.top, left: l.coords.left }}
                  >
                    <div className={`p-2 rounded-full shadow-lg flex items-center justify-center ${l.color} ${activePin === l.id ? 'ring-4 ring-primary/40 animate-pulse' : ''}`}>
                      <MapPin className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Floating Control Toolbar */}
              <div className="absolute top-3 right-3 flex flex-col space-y-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-1 rounded-xl border dark:border-slate-800 shadow z-30">
                <button
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 1.75))}
                  className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
              </div>

              {/* Active Landmark Popup Card overlay */}
              {activePin && (
                <div className="absolute bottom-3 inset-x-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur border dark:border-slate-800 p-3 rounded-xl shadow-xl z-30 text-left flex items-start justify-between space-x-2 animate-fadeIn">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {landmarks.find(l => l.id === activePin)?.title}
                      </span>
                      <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                        {landmarks.find(l => l.id === activePin)?.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {landmarks.find(l => l.id === activePin)?.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDirections(true)}
                    className="bg-accent hover:bg-accent-hover text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 flex items-center space-x-1 cursor-pointer shadow"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Directions</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Directions Modal or Drawer Trigger */}
            <div className="pt-2 flex flex-col space-y-2">
              <button
                id="open-directions-planner"
                onClick={() => setShowDirections(!showDirections)}
                className="w-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <span>Route Navigation & Directions Planner</span>
                </span>
                <span className="font-mono text-[10px] text-accent">Mbabane H100</span>
              </button>

              {showDirections && (
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border dark:border-slate-850 space-y-3 animate-fadeIn text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Choose Starting Point:</span>
                    <select
                      value={selectedOrigin}
                      onChange={(e) => setSelectedOrigin(e.target.value)}
                      className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 dark:text-white cursor-pointer"
                    >
                      {Object.keys(directionsMap).map(origin => (
                        <option key={origin} value={origin}>{origin}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white border-b dark:border-slate-800 pb-2">
                      <span>Estimated Travel Time:</span>
                      <span className="font-mono text-primary">{directionsMap[selectedOrigin].time}</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 pl-4 list-disc font-medium">
                      {directionsMap[selectedOrigin].steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Somhlolo+Road,+Mbabane,+Eswatini"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-xl font-bold text-center flex items-center justify-center space-x-1.5 transition shadow"
                  >
                    <span>Open in Google Maps Navigation</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500 pt-1">
              <Clock className="h-4 w-4 text-slate-400 shrink-0" />
              <span>Free customer parking available right outside LM Building Unit 10.</span>
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

