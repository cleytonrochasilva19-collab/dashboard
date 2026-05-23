import React, { useEffect, useRef } from 'react';
import { FinancialMetrics } from './components/FinancialMetrics';
import { WorldCupCountdown } from './components/WorldCupCountdown';
import { GoalsCountdown } from './components/GoalsCountdown';
import { SpaceAndAviation } from './components/SpaceAndAviation';
import { CombinedGlobalIndicators } from './components/GlobalIndicators';
import { WorldClockWeather } from './components/WorldClockWeather';
import { CombinedLiveTrends } from './components/LiveTrends';
import { BettingOdds } from './components/BettingOdds';
import { NewsTicker } from './components/NewsTicker';
import { AIRaceTracker } from './components/AIRaceTracker';

export default function App() {
  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden flex flex-col bg-[#0b111e] p-3 gap-3 font-sans text-slate-100 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Top Row (Header) */}
      <div className="h-[20vh] min-h-[140px] flex-shrink-0 flex gap-3 w-full relative z-10">
        <div className="flex-[3] min-w-0 h-full max-h-full overflow-hidden"><FinancialMetrics /></div>
        <div className="flex-[2] min-w-0 h-full max-h-full overflow-hidden"><WorldCupCountdown /></div>
        <div className="flex-[5] min-w-0 h-full max-h-full overflow-hidden"><WorldClockWeather /></div>
      </div>

      {/* Main 4-Column Grid */}
      <div className="flex-1 grid grid-cols-4 gap-3 min-h-0 w-full relative z-10">
        
        {/* Column 1: Goals & ISS */}
        <div className="flex flex-col gap-3 h-full max-h-full overflow-hidden min-h-0">
          <div className="flex-[4] min-h-0"><GoalsCountdown /></div>
          <div className="flex-[6] min-h-0"><SpaceAndAviation /></div>
        </div>

        {/* Column 2: Population & Conflicts (Unified Card) */}
        <div className="h-full max-h-full overflow-hidden min-h-0">
          <CombinedGlobalIndicators />
        </div>

        {/* Column 3: Trends & Audio Streams (Unified Card) */}
        <div className="h-full max-h-full overflow-hidden min-h-0">
          <CombinedLiveTrends />
        </div>

        {/* Column 4: AI Tracker & Betting Odds */}
        <div className="flex flex-col gap-3 h-full max-h-full overflow-hidden min-h-0">
          <div className="flex-[4] min-h-0"><AIRaceTracker /></div>
          <div className="flex-[6] min-h-0"><BettingOdds /></div>
        </div>

      </div>

      {/* Footer Ticker */}
      <div className="flex-shrink-0 relative z-10">
        <NewsTicker />
      </div>


    </div>
  );
}
