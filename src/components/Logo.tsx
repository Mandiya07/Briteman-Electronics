import React, { useState, useEffect } from 'react';
import { getCloudLogo } from '../lib/firebase';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    getCloudLogo().then((url) => {
      if (url) setCustomLogoUrl(url);
    });

    const handleStorageChange = () => {
      const updated = localStorage.getItem('briteman_custom_logo');
      setCustomLogoUrl(updated);
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event listener for instant updates within tab
    window.addEventListener('logo-updated', handleStorageChange as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logo-updated', handleStorageChange as EventListener);
    };
  }, []);

  const scaleClasses = {
    sm: 'scale-90 origin-left',
    md: 'scale-100',
    lg: 'scale-110 origin-left'
  };

  if (customLogoUrl) {
    return (
      <div className={`flex items-center space-x-2.5 select-none ${scaleClasses[size]} ${className}`}>
        <img src={customLogoUrl} alt="Briteman Services Logo" className="h-10 sm:h-12 w-auto object-contain rounded-xl border border-blue-900/10 shadow-sm bg-white p-1" />
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2.5 select-none ${scaleClasses[size]} ${className}`}>
      {/* Monitor + Swirl Graphic */}
      <div className="relative flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-900 rounded-xl border border-blue-900/20 shadow-sm p-1.5 shrink-0">
        <svg viewBox="0 0 64 64" className="w-full h-full text-blue-700" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Monitor Screen Frame */}
          <rect x="12" y="16" width="36" height="26" rx="2" stroke="currentColor" strokeWidth="3" fill="#ffffff" />
          {/* Monitor Stand Base */}
          <path d="M22 42L18 50H38L34 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 50H40" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Swirl / Signal Antenna on top left */}
          <path d="M6 14C8 10 14 8 20 12C24 15 22 20 18 18C15 16 17 11 12 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Red decorative button/dot */}
          <circle cx="28" cy="40" r="2.5" fill="#dc2626" />
        </svg>
      </div>

      {/* Typography: BRITEMAN SERVICES */}
      <div className="flex flex-col">
        <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-blue-700 dark:text-blue-400 leading-none">
          BRITEMAN
        </span>
        <span className="font-sans font-black text-[11px] sm:text-xs tracking-[0.2em] text-red-600 uppercase mt-0.5 leading-none">
          SERVICES
        </span>
      </div>
    </div>
  );
}
