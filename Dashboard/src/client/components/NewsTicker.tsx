import React, { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';

const marqueeStyles = `
  @keyframes tickerMarquee {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
  .animate-ticker-marquee {
    display: inline-flex;
    white-space: nowrap;
    animation: tickerMarquee 180s linear infinite;
    will-change: transform;
  }
`;

// Memoized Marquee Row to guarantee absolutely NO re-renders or animation resets
// unless the actual headlines content undergoes changes.
const MarqueeContent = React.memo(({ headlines }: { headlines: string[] }) => {
  // Duplicate the headlines to create a seamless infinite loop
  const displayList = [...headlines, ...headlines];

  return (
    <div className="animate-ticker-marquee flex items-center gap-10">
      {displayList.map((headline, idx) => (
        <span 
          key={`${headline}-${idx}`} 
          className="inline-flex items-center text-white font-black tracking-wide uppercase text-[17.5px] drop-shadow-md whitespace-nowrap"
        >
          {headline}
          <span className="text-white ml-10 font-black shrink-0">•</span>
        </span>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Deep comparison of array contents using joined strings
  return prevProps.headlines.join('|') === nextProps.headlines.join('|');
});

export function NewsTicker() {
  const [headlines, setHeadlines] = useState<string[]>([
    "GLOBAL MARKETS RALLY AS TECH STOCKS HIT RECORD HIGHS AMID AI BOOM",
    "UN CLIMATE SUMMIT REACHES HISTORIC AGREEMENT ON EMISSIONS REDUCTION",
    "SPACEX SUCCESSFULLY LAUNCHES NEXT-GEN SATELLITE CONSTELLATION",
    "MAJOR BREAKTHROUGH IN QUANTUM COMPUTING ANNOUNCED BY RESEARCHERS",
    "EUROPEAN UNION PASSES COMPREHENSIVE AI REGULATION FRAMEWORK",
    "CENTRAL BANKS HINT AT POTENTIAL RATE CUTS IN UPCOMING QUARTER",
    "GLOBAL OIL PRICES STABILIZE FOLLOWING DIPLOMATIC TALKS IN MIDDLE EAST",
    "TECH GIANTS ANNOUNCE JOINT INITIATIVE FOR SUSTAINABLE ENERGY DATA CENTERS",
    "WORLD HEALTH ORGANIZATION REPORTS SIGNIFICANT DROP IN GLOBAL INFECTION RATES",
    "INTERNATIONAL SPACE STATION AVOIDS DEBRIS IN ORBITAL MANEUVER",
    "CRYPTOCURRENCY MARKET SEES SURGE FOLLOWING NEW ETF APPROVALS",
    "NEW CLEAN ENERGY SUBSIDIES TRIGGER INVESTMENT WAVE ACROSS ASIA",
    "SUPPLY CHAIN DISRUPTIONS EASE AS MAJOR PORTS CLEAR BACKLOGS",
    "NOBEL PRIZE IN MEDICINE AWARDED FOR MRNA VACCINE RESEARCH",
    "OLYMPIC COMMITTEE CONFIRMS NEW VENUES FOR 2032 SUMMER GAMES",
  ]);

  // Polling simulation: keep headlines updated or add new breaking news occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time news injection or subtle updates
      setHeadlines(prev => {
        const next = [...prev];
        return next;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Sanitize headlines to ensure absolutely no headline ends with period
  const sanitizedHeadlines = React.useMemo(() => {
    return headlines.map(h => h.trim().replace(/[.!?;:]+$/, ""));
  }, [headlines]);

  return (
    <div className="relative w-full h-10 bg-red-700/95 border-t border-red-500/50 flex items-center z-50 overflow-hidden shrink-0">
      <style>{marqueeStyles}</style>
      
      <div className="flex items-center gap-2.5 bg-black px-4 h-full font-black text-white tracking-widest uppercase shadow-2xl z-10 flex-shrink-0 border-r border-slate-800 text-[17.5px]">
        <Radio className="animate-pulse text-red-500" size={16} />
        WORLD NEWS
      </div>
      
      <div className="flex-1 overflow-hidden h-full flex items-center relative whitespace-nowrap">
        <MarqueeContent headlines={sanitizedHeadlines} />
      </div>
    </div>
  );
}
