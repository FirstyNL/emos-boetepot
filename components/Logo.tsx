import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center group cursor-pointer">
      {/* Grotere container */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20 transition-all group-hover:bg-red-700 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-700/30 overflow-hidden">
        
        {/* Icoon: Groot formaat met fijne, strakke lijntjes */}
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:rotate-3"
        >
          {/* Rode kaart op de achtergrond */}
          <rect 
            x="11" 
            y="3" 
            width="9" 
            height="13" 
            rx="1.5" 
            fill="#B91C1C" 
            transform="rotate(15 11 3)"
            stroke="white"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />

          {/* Witte boetebon op de voorgrond */}
          <rect 
            x="4" 
            y="5" 
            width="11" 
            height="15" 
            rx="2" 
            fill="white"
          />

          {/* Fijne, strakke regeltjes op de bon */}
          <line x1="7" y1="9" x2="12" y2="9" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="12" x2="11" y2="12" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="7" y1="15" x2="9" y2="15" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

      </div>
    </div>
  );
}