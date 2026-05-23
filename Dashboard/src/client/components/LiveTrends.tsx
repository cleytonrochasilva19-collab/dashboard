import { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Music, Hash, Search } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface TrendItem {
  topic: string;
  metric: string;
  value: number;
}

interface SongItem {
  rank: number;
  title: string;
  artist: string;
  streams: number;
}const INITIAL_X_TRENDS: TrendItem[] = [
  { topic: 'ArtificialIntelligence', metric: 'posts', value: 1205432 },
  { topic: 'WorldCup2026', metric: 'posts', value: 954921 },
  { topic: 'Bitcoin', metric: 'posts', value: 842031 },
  { topic: 'SpaceXStarship', metric: 'posts', value: 720894 },
  { topic: 'SuperComputing', metric: 'posts', value: 687456 },
  { topic: 'QuantumNet', metric: 'posts', value: 641235 },
  { topic: 'GreenHydrogen', metric: 'posts', value: 592810 },
  { topic: 'FusionPower', metric: 'posts', value: 541092 },
  { topic: 'CryptoMarket', metric: 'posts', value: 498302 },
  { topic: 'CyberSecurity', metric: 'posts', value: 462104 },
  { topic: 'DeepLearning', metric: 'posts', value: 421098 },
  { topic: 'Robotics', metric: 'posts', value: 395123 },
  { topic: 'RenewableGrid', metric: 'posts', value: 374092 },
  { topic: 'ElectricVehicles', metric: 'posts', value: 342187 },
  { topic: 'Metaverse', metric: 'posts', value: 312056 },
  { topic: 'Web3Dev', metric: 'posts', value: 295412 },
  { topic: 'BioTech', metric: 'posts', value: 274091 },
  { topic: 'Nanotechnology', metric: 'posts', value: 251042 },
  { topic: 'MarsRover', metric: 'posts', value: 228941 },
  { topic: 'SolidStateBattery', metric: 'posts', value: 211093 },
  { topic: 'SmartCities', metric: 'posts', value: 195421 },
  { topic: 'NeuromorphicChips', metric: 'posts', value: 178942 },
  { topic: 'Genomics', metric: 'posts', value: 154302 },
  { topic: 'AgriTech', metric: 'posts', value: 139540 },
  { topic: 'SyntheticBiology', metric: 'posts', value: 125091 },
  { topic: 'CarbonCapture', metric: 'posts', value: 110943 },
  { topic: 'AutonomousDrones', metric: 'posts', value: 98402 },
  { topic: 'VirtualReality', metric: 'posts', value: 87409 },
  { topic: 'AugmentedHuman', metric: 'posts', value: 76092 },
  { topic: 'EdgeComputing', metric: 'posts', value: 65123 }
];

const INITIAL_GOOGLE_TRENDS: TrendItem[] = [
  { topic: 'ChatGPT-5 Release', metric: 'searches', value: 2000000 },
  { topic: 'Nvidia Stock Price', metric: 'searches', value: 1850000 },
  { topic: 'Mars Colonization', metric: 'searches', value: 1600000 },
  { topic: 'Copa America 2026', metric: 'searches', value: 1400000 },
  { topic: 'Quantum Breakthrough', metric: 'searches', value: 1200000 },
  { topic: 'Apple Glasses V2', metric: 'searches', value: 1100000 },
  { topic: 'Google I/O 2026', metric: 'searches', value: 980000 },
  { topic: 'Microsoft Build', metric: 'searches', value: 890000 },
  { topic: 'Superconductivity', metric: 'searches', value: 810000 },
  { topic: 'Solar Eclipse Path', metric: 'searches', value: 740000 },
  { topic: 'Global Warming Stats', metric: 'searches', value: 680000 },
  { topic: 'New Exoplanet Found', metric: 'searches', value: 620000 },
  { topic: 'Generative AI Tools', metric: 'searches', value: 570000 },
  { topic: 'WebAssembly Update', metric: 'searches', value: 520000 },
  { topic: 'TypeScript 6.0', metric: 'searches', value: 480000 },
  { topic: 'Rust Web Frameworks', metric: 'searches', value: 430000 },
  { topic: 'Deno vs Node 2026', metric: 'searches', value: 390000 },
  { topic: 'Zero Knowledge Proofs', metric: 'searches', value: 350000 },
  { topic: 'Framer Motion Pro', metric: 'searches', value: 320000 },
  { topic: 'Vite 7 Features', metric: 'searches', value: 290000 },
  { topic: 'Next.js 16 App Router', metric: 'searches', value: 260000 },
  { topic: 'Tailwind v4 Setup', metric: 'searches', value: 230000 },
  { topic: 'Postgres Vector DB', metric: 'searches', value: 210000 },
  { topic: 'Redis Open Source Fork', metric: 'searches', value: 190000 },
  { topic: 'WebGPU Benchmarks', metric: 'searches', value: 170000 },
  { topic: 'Docker Desktop Free', metric: 'searches', value: 150000 },
  { topic: 'Kubernetes Simplified', metric: 'searches', value: 130000 },
  { topic: 'Linux Kernel 6.15', metric: 'searches', value: 110000 },
  { topic: 'Serverless Edge Functions', metric: 'searches', value: 95000 },
  { topic: 'Hacker News Feed', metric: 'searches', value: 80000 }
];

const INITIAL_SONGS: SongItem[] = [
  { rank: 1, title: 'Blinding Lights', artist: 'The Weeknd', streams: 9845120 },
  { rank: 2, title: 'Cruel Summer', artist: 'Taylor Swift', streams: 9452109 },
  { rank: 3, title: 'Shape of You', artist: 'Ed Sheeran', streams: 9121405 },
  { rank: 4, title: 'As It Was', artist: 'Harry Styles', streams: 8820489 },
  { rank: 5, title: 'Starboy', artist: 'The Weeknd ft. Daft Punk', streams: 8590312 },
  { rank: 6, title: 'Believer', artist: 'Imagine Dragons', streams: 8223984 },
  { rank: 7, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', streams: 7932104 },
  { rank: 8, title: 'Perfect', artist: 'Ed Sheeran', streams: 7654321 },
  { rank: 9, title: 'Bad Habits', artist: 'Ed Sheeran', streams: 7345612 },
  { rank: 10, title: 'Levitating', artist: 'Dua Lipa', streams: 7123987 },
  { rank: 11, title: 'Flowers', artist: 'Miley Cyrus', streams: 6897543 },
  { rank: 12, title: 'Save Your Tears', artist: 'The Weeknd', streams: 6654321 },
  { rank: 13, title: 'One Dance', artist: 'Drake', streams: 6432109 },
  { rank: 14, title: 'Dynamite', artist: 'BTS', streams: 6210987 },
  { rank: 15, title: 'Closer', artist: 'The Chainsmokers', streams: 5987654 },
  { rank: 16, title: 'Someone You Loved', artist: 'Lewis Capaldi', streams: 5765432 },
  { rank: 17, title: 'Sunflower', artist: 'Post Malone & Swae Lee', streams: 5543210 },
  { rank: 18, title: 'Senorita', artist: 'Shawn Mendes & Camila Cabello', streams: 5321098 },
  { rank: 19, title: 'Rockstar', artist: 'Post Malone', streams: 5109876 },
  { rank: 20, title: 'Circles', artist: 'Post Malone', streams: 4897654 },
  { rank: 21, title: 'Love Yourself', artist: 'Justin Bieber', streams: 4676543 },
  { rank: 22, title: 'Thinking Out Loud', artist: 'Ed Sheeran', streams: 4454321 },
  { rank: 23, title: 'Sorry', artist: 'Justin Bieber', streams: 4232109 },
  { rank: 24, title: 'Radioactive', artist: 'Imagine Dragons', streams: 4010987 },
  { rank: 25, title: 'Wake Me Up', artist: 'Avicii', streams: 3789654 }
];
const formatMetric = (val: number, type: string) => {
  if (val >= 1000000) {
    return `${(val / 1000000).toFixed(2)}M ${type}`;
  }
  return `${(val / 1000).toFixed(0)}K ${type}`;
};

export function CombinedLiveTrends() {
  return (
    <div className="h-full max-h-full overflow-hidden bg-slate-900 border border-slate-800 rounded-xl py-3 px-3 shadow-2xl flex flex-col min-h-0 gap-3">
      <LiveGlobalTrends />
      <div className="h-px bg-slate-800/80 w-full flex-shrink-0"></div>
      <LiveAudioStreams />
    </div>
  );
}

function LiveGlobalTrends() {
  const [xTrends, setXTrends] = useState<TrendItem[]>(INITIAL_X_TRENDS);
  const [googleTrends, setGoogleTrends] = useState<TrendItem[]>(INITIAL_GOOGLE_TRENDS);

  useEffect(() => {
    const trendsInterval = setInterval(() => {
      setXTrends(prev =>
        prev.map(t => {
          const fluctuation = t.value * 0.08 * (Math.random() - 0.5) * 2;
          return {
            ...t,
            value: Math.max(1000, Math.floor(t.value + fluctuation))
          };
        })
      );
      setGoogleTrends(prev =>
        prev.map(t => {
          const fluctuation = t.value * 0.08 * (Math.random() - 0.5) * 2;
          return {
            ...t,
            value: Math.max(1000, Math.floor(t.value + fluctuation))
          };
        })
      );
    }, 4000);

    return () => clearInterval(trendsInterval);
  }, []);

  const sortedXTrends = useMemo(() => {
    return [...xTrends].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [xTrends]);

  const sortedGoogleTrends = useMemo(() => {
    return [...googleTrends].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [googleTrends]);

  return (
      <div className="flex flex-col min-h-0 flex-[4] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-1 border-b border-slate-800/80 pb-1 shrink-0">
              <div className="flex items-center gap-1.5 text-purple-400 text-[12.5px] font-black tracking-widest uppercase">
                  <TrendingUp size={16} />
                  LIVE GLOBAL TRENDS
              </div>
              <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-sm text-red-500 font-black uppercase tracking-widest leading-none">LIVE</span>
              </div>
          </div>

          {/* Main Grid for X and Google Trends */}
          <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
              {/* X Trends Column */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1.5 pb-1.5 border-b border-slate-800/80 flex items-center gap-1.5">
                  <Hash size={14} className="text-slate-400" />
                  X (<span className="text-[#1DA1F2]">TWITTER</span>)
                </h3>
                <motion.ul className="space-y-1.5 w-full flex flex-col">
                    {sortedXTrends.map((trend) => (
                      <motion.li 
                        layout="position"
                        key={trend.topic}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        className="flex justify-between items-center bg-slate-950/50 px-2 py-1 rounded-md border border-slate-800/60 text-sm font-extrabold text-white w-full"
                      >
                        <span className="text-white truncate max-w-[62%]">#{trend.topic}</span>
                        <span className="text-purple-400 font-bold font-mono text-sm whitespace-nowrap">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={trend.value}
                              initial={{ opacity: 0.5, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0.5, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {formatMetric(trend.value, '')}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      </motion.li>
                    ))}
                </motion.ul>
              </div>

              {/* Google Trends Column */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-black uppercase tracking-widest mb-1.5 pb-1.5 border-b border-slate-800/80 flex items-center gap-1.5">
                  <Search size={14} className="text-blue-400" />
                  <span className="bg-gradient-to-r from-red-500 via-green-500 via-yellow-400 via-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x font-black">
                    GOOGLE SEARCH
                  </span>
                </h3>
                <motion.ul className="space-y-1.5 w-full flex flex-col">
                    {sortedGoogleTrends.map((trend) => (
                      <motion.li 
                        layout="position"
                        key={trend.topic}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                        className="flex justify-between items-center bg-slate-950/50 px-2 py-1 rounded-md border border-slate-800/60 text-sm font-extrabold text-white w-full"
                      >
                        <span className="text-white truncate max-w-[62%]">{trend.topic}</span>
                        <span className="text-purple-400 font-bold font-mono text-sm whitespace-nowrap">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={trend.value}
                              initial={{ opacity: 0.5, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0.5, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              {formatMetric(trend.value, '+')}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      </motion.li>
                    ))}
                </motion.ul>
              </div>
          </div>
      </div>
  );
}
function LiveAudioStreams() {
  const [songs, setSongs] = useState<SongItem[]>(INITIAL_SONGS);

  useEffect(() => {
    const songsInterval = setInterval(() => {
      setSongs(prev => {
        const fluctuated = prev.map(s => {
          const fluctuation = s.streams * 0.08 * (Math.random() - 0.5) * 2;
          return {
            ...s,
            streams: Math.max(100000, Math.floor(s.streams + fluctuation))
          };
        });

        const sorted = [...fluctuated].sort((a, b) => b.streams - a.streams);

        return sorted.map((s, index) => ({
          ...s,
          rank: index + 1
        }));
      });
    }, 5000);

    return () => clearInterval(songsInterval);
  }, []);

  const memoizedSongs = useMemo(() => {
    return songs.slice(0, 7);
  }, [songs]);

  return (
    <div className="flex flex-col min-h-0 flex-[6] overflow-hidden pb-1">
      <div className="flex-1 flex flex-col min-h-0 justify-start">
        <div className="flex items-center justify-between mb-1 border-b border-slate-800/80 pb-1 shrink-0">
            <h3 className="text-[11.5px] text-teal-400 uppercase font-black tracking-widest flex items-center gap-1.5">
            <Music size={14} />
            GLOBAL TOP 7 AUDIO STREAMS
            </h3>
            <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-sm text-red-500 font-black uppercase tracking-widest leading-none">LIVE</span>
            </div>
        </div>
        <motion.ul className="flex-1 flex flex-col justify-between overflow-hidden pr-1 w-full mt-1">
            {memoizedSongs.map((track) => (
              <motion.li
                layout="position"
                key={track.title}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
                className="flex items-center justify-between bg-slate-950/50 px-2.5 py-[3px] rounded-md border border-slate-800/60 hover:bg-slate-950/80 w-full"
              >
                <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                  <span className="bg-gradient-to-br from-cyan-400 to-white text-transparent bg-clip-text font-mono font-black text-base min-w-[20px]">
                    #{track.rank}
                  </span>
                  <div className="flex flex-col truncate justify-center py-[2px]">
                    <span className="text-teal-400 font-black text-sm truncate leading-none mb-[2px]">
                      {track.title}
                    </span>
                    <span className="text-white text-xs font-bold truncate leading-none pb-[1px]">
                      {track.artist}
                    </span>
                  </div>
                </div>
                <span className="text-teal-400/90 font-mono text-sm font-black shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={track.streams}
                      initial={{ opacity: 0.5, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {(track.streams / 1000000).toFixed(3)}M
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.li>
            ))}
        </motion.ul>
      </div>
    </div>
  );
}
