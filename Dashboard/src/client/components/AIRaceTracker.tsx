import { useEffect, useState, useMemo } from 'react';
import { Cpu, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIModel {
  rank: number;
  name: string;
  provider: string;
  marketShare: number;
  promptsPerSec: number;
  trend: 'up' | 'down' | 'stable';
}

const INITIAL_AI_DATA: AIModel[] = [
  { rank: 1, name: 'ChatGPT', provider: 'OpenAI', marketShare: 58.5, promptsPerSec: 58500, trend: 'stable' },
  { rank: 2, name: 'Gemini', provider: 'Google', marketShare: 22.5, promptsPerSec: 22500, trend: 'stable' },
  { rank: 3, name: 'Claude', provider: 'Anthropic', marketShare: 6.5, promptsPerSec: 6500, trend: 'stable' },
  { rank: 4, name: 'Copilot', provider: 'Microsoft', marketShare: 3.5, promptsPerSec: 3500, trend: 'stable' },
  { rank: 5, name: 'DeepSeek', provider: 'DeepSeek', marketShare: 3.5, promptsPerSec: 3500, trend: 'stable' }
];

const BRAND_THEMES: Record<string, {
  accentColor: string;
  barColor: string;
  dotColor: string;
}> = {
  ChatGPT: {
    accentColor: 'text-violet-400',
    barColor: 'bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500',
    dotColor: 'bg-violet-400'
  },
  Gemini: {
    accentColor: 'text-cyan-400',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    dotColor: 'bg-cyan-400'
  },
  Claude: {
    accentColor: 'text-amber-400',
    barColor: 'bg-gradient-to-r from-amber-500 to-orange-400',
    dotColor: 'bg-amber-400'
  },
  Copilot: {
    accentColor: 'text-teal-400',
    barColor: 'bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500',
    dotColor: 'bg-teal-400'
  },
  DeepSeek: {
    accentColor: 'text-blue-400',
    barColor: 'bg-gradient-to-r from-blue-600 to-sky-400',
    dotColor: 'bg-blue-400'
  }
};

export function AIRaceTracker() {
  const [models, setModels] = useState<AIModel[]>(INITIAL_AI_DATA);

  useEffect(() => {
    const trackerInterval = setInterval(() => {
      setModels(prev => {
        // Generate raw values within realistic ranges with slight overlaps to allow dynamic rank swaps
        const rawShares: Record<string, number> = {
          ChatGPT: 55.0 + Math.random() * 7.0,
          Gemini: 20.0 + Math.random() * 5.0,
          Claude: 3.0 + Math.random() * 5.5,
          Copilot: 2.0 + Math.random() * 5.5,
          DeepSeek: 2.0 + Math.random() * 5.5
        };

        const totalRaw = Object.values(rawShares).reduce((sum, val) => sum + val, 0);

        const fluctuated = prev.map(m => {
          // Normalize share to sum to exactly 100.0%
          const newShare = (rawShares[m.name] / totalRaw) * 100.0;
          let newPrompts = m.promptsPerSec;

          // Set dynamic prompts proportionally based on their normalized share
          if (m.name === 'ChatGPT') {
            newPrompts = Math.floor(newShare * 1000 + (Math.random() - 0.5) * 2000);
          } else if (m.name === 'Gemini') {
            newPrompts = Math.floor(newShare * 1000 + (Math.random() - 0.5) * 1500);
          } else if (m.name === 'Claude') {
            newPrompts = Math.floor(newShare * 1000 + (Math.random() - 0.5) * 800);
          } else if (m.name === 'Copilot') {
            newPrompts = Math.floor(newShare * 1000 + (Math.random() - 0.5) * 500);
          } else if (m.name === 'DeepSeek') {
            newPrompts = Math.floor(newShare * 1000 + (Math.random() - 0.5) * 500);
          }

          const shareJitter = newShare - m.marketShare;

          return {
            ...m,
            marketShare: newShare,
            promptsPerSec: newPrompts,
            trend: shareJitter > 0 ? ('up' as const) : ('down' as const)
          };
        });

        // Sort by market share to assign ranks dynamically
        const sorted = [...fluctuated].sort((a, b) => b.marketShare - a.marketShare);
        return sorted.map((m, index) => ({
          ...m,
          rank: index + 1
        }));
      });
    }, 5000); // 5 seconds cycle

    return () => clearInterval(trackerInterval);
  }, []);

  const memoizedModels = useMemo(() => {
    return models;
  }, [models]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl pt-5 pb-2.5 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col justify-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 border-b border-slate-800/80 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 text-blue-400 text-[12.5px] font-black tracking-widest uppercase">
          <Cpu className="text-blue-500" size={16} />
          AI DOMINANCE TRACKER
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-sm text-red-500 font-black uppercase tracking-widest leading-none">LIVE</span>
        </div>
      </div>

      {/* Leaderboard content */}
      <div className="flex-1 flex flex-col justify-start gap-2 w-full mt-2">
        <AnimatePresence mode="popLayout">
          {memoizedModels.slice(0, 3).map((model, index) => {
            const isRank1 = model.rank === 1;

            return (
              <motion.div 
                layout
                key={model.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                className={`bg-slate-950/60 rounded-xl px-3.5 border border-slate-800/50 hover:bg-slate-950/80 flex flex-col justify-between gap-1 transition-colors duration-300
                  ${isRank1 ? 'pt-3 pb-2.5' : 'py-2'}
                `}
              >
                {/* Row 1: Left (Name, Rank, Provider) and Right (Share, P/S) */}
                <div className="flex justify-between items-center w-full">
                  {/* Rank, Name, Provider */}
                  <div className="flex items-center gap-2 truncate max-w-[55%]">
                    <span className={`${BRAND_THEMES[model.name]?.accentColor || 'text-blue-400'} font-mono font-black text-sm md:text-base min-w-[20px]`}>
                      #{model.rank}
                    </span>
                    <div className="flex flex-col truncate justify-center">
                      <span className="text-white font-black text-base md:text-lg truncate uppercase tracking-wide leading-none mb-1">
                        {model.name}
                      </span>
                      <span className="text-slate-500 text-[10px] font-bold truncate leading-none uppercase">
                        BY {model.provider}
                      </span>
                    </div>
                  </div>

                  {/* Market Share and Prompts */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end justify-center">
                      <div className="flex items-center gap-1 text-white font-mono text-base md:text-lg font-black leading-none mb-1">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={model.marketShare}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.5, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {model.marketShare.toFixed(2)}%
                          </motion.span>
                        </AnimatePresence>
                        {model.trend === 'up' ? (
                           <ArrowUpRight size={15} className="text-green-400 animate-pulse" />
                        ) : (
                           <ArrowDownRight size={15} className="text-red-400 animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 font-extrabold text-[11px] md:text-[12px] uppercase tracking-wider leading-none">
                        <Zap size={11} className="text-yellow-400" />
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={model.promptsPerSec}
                            initial={{ opacity: 0.5, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.5, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {model.promptsPerSec.toLocaleString()}
                          </motion.span>
                        </AnimatePresence>
                        <span className="font-mono"> P/S</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Dynamic Progress Bar */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/40 relative">
                  <motion.div
                    className={`h-full rounded-full ${BRAND_THEMES[model.name]?.barColor || 'bg-blue-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.pow(model.marketShare / 100, 0.4) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
