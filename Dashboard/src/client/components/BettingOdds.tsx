import { useEffect, useState, useMemo } from 'react';
import { Dices, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface OddsEvent {
  id: string;
  sport: string;
  match: string;
  team1: string;
  team2: string;
  odds1: number;
  odds2: number;
  trend: 'up' | 'down' | 'stable';
}
const CACHE_BUSTER = Date.now() + 2; // Updated cache-busting timestamp
// 6 specific sporting matchups
const EVENT_POOL: OddsEvent[] = [
  { id: '1', sport: 'BASKETBALL', match: 'NBA FINALS', team1: 'Thunder', team2: 'Knicks', odds1: 1.85, odds2: 1.95, trend: 'stable' },
  { id: '2', sport: 'FOOTBALL', match: 'WORLD CUP 2026 - FINAL', team1: 'Spain', team2: 'France', odds1: 2.30, odds2: 2.20, trend: 'stable' },
  { id: '3', sport: 'UFC WHITE HOUSE', match: 'Co-main Event', team1: 'Pereira', team2: 'Gane', odds1: 1.80, odds2: 2.05, trend: 'stable' },
  { id: '4', sport: 'FOOTBALL', match: 'LIBERTADORES - FINAL', team1: 'Flamengo', team2: 'Palmeiras', odds1: 1.87, odds2: 3.45, trend: 'stable' },
  { id: '5', sport: 'FOOTBALL', match: 'CHAMPIONS LEAGUE - FINAL', team1: 'Arsenal', team2: 'PSG', odds1: 2.10, odds2: 1.75, trend: 'stable' },
  { id: '6', sport: 'TENNIS', match: 'ROLAND ROS - FINAL', team1: 'Sinner', team2: 'Zverev', odds1: 1.90, odds2: 1.90, trend: 'stable' }
];

export function BettingOdds() {
  const [events, setEvents] = useState<OddsEvent[]>(EVENT_POOL);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic Betting Events logic
  useEffect(() => {
    const oddsInterval = setInterval(() => {
      setEvents(prev => prev.map(ev => {
        // Mantenha algumas odds neutras (stable)
        const fluctuate = Math.random() > 0.5;
        if (!fluctuate) return { ...ev, trend: 'stable' };

        // Oscilação pequena: -0.05 a +0.05
        const shift = (Math.random() * 0.1) - 0.05;
        const newOdds1 = Math.max(1.01, ev.odds1 + shift);
        const newOdds2 = Math.max(1.01, ev.odds2 - shift);

        return {
          ...ev,
          odds1: newOdds1,
          odds2: newOdds2,
          trend: shift > 0 ? 'up' : 'down' // Gera as setas ↗ (up) e ↘ (down) e cores
        };
      }));
    }, 3000);

    // Carousel auto-rotate sliding window through all 6 events
    const rotateInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % 6);
    }, 8000);

    return () => {
      clearInterval(oddsInterval);
      clearInterval(rotateInterval);
    };
  }, []);

  // Show 5 events at a time using wrapping logic
  const memoizedDisplayEvents = useMemo(() => {
    return [
      events[currentIndex],
      events[(currentIndex + 1) % events.length],
      events[(currentIndex + 2) % events.length],
      events[(currentIndex + 3) % events.length],
      events[(currentIndex + 4) % events.length],
    ];
  }, [events, currentIndex]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col relative">
      <div className="absolute top-0 right-0 -mr-6 -mt-6 text-green-500/10 pointer-events-none">
        <Dices size={100} />
      </div>

      <div className="flex items-center justify-between mb-2 border-b border-slate-800/80 pb-2 relative z-10">
        <div className="flex items-center gap-2 text-slate-200 text-[12.5px] font-black tracking-widest uppercase">
          <Dices className="text-orange-400" size={16} />
          LIVE SPORTS ODDS
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-sm text-red-500 font-black uppercase tracking-widest leading-none">LIVE</span>
        </div>
      </div>

      <motion.ul className="flex-1 flex flex-col justify-between gap-1 relative z-10 w-full">
        <AnimatePresence mode="popLayout">
          {memoizedDisplayEvents.map((ev) => (
            <motion.li
              layout="position"
              key={ev.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                layout: { type: "spring", stiffness: 220, damping: 28 }
              }}
              style={{ width: '100%' }}
              className="bg-slate-950/50 rounded-lg px-2.5 py-2.5 border border-slate-800/50 flex justify-between items-center gap-2.5 hover:bg-slate-950/80 transition-colors duration-300"
            >
              <div className="flex flex-col w-[54%] flex-shrink-0">
                <span className="text-xs text-slate-300 font-bold tracking-widest uppercase mb-0.5 truncate">{ev.sport} <span className="text-white/30 px-0.5">•</span> {ev.match}</span>
                <div className="flex gap-1 text-[16px] font-black text-orange-400 items-center">
                  <span className="w-22 truncate font-bold">{ev.team1}</span>
                  <span className="text-slate-400 text-[10.5px] font-black">vs</span>
                  <span className="w-22 truncate font-bold text-right">{ev.team2}</span>
                </div>
              </div>

              <div className="flex gap-1.5 flex-shrink-0 justify-end">
                <div className={`px-2 py-1 rounded border min-w-[50px] text-center flex items-center justify-center gap-0.5 ${ev.trend === 'up' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800/50 border-slate-700 text-white'}`}>
                  {ev.trend === 'up' && <ArrowUpRight size={12} className="text-green-400" />}
                  <span className="font-mono text-[13px] font-extrabold">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ev.odds1}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {ev.odds1.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
                <div className={`px-2 py-1 rounded border min-w-[50px] text-center flex items-center justify-center gap-0.5 ${ev.trend === 'down' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800/50 border-slate-700 text-white'}`}>
                  {ev.trend === 'down' && <ArrowDownRight size={12} className="text-red-400" />}
                  <span className="font-mono text-[13px] font-extrabold">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ev.odds2}
                        initial={{ opacity: 0.5, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.5, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {ev.odds2.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
