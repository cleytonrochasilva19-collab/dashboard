import { useEffect, useState } from 'react';
import { Users, AlertTriangle, MapPin, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

export function CombinedGlobalIndicators() {
    return (
        <div className="h-full max-h-full overflow-hidden bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 shadow-2xl flex flex-col min-h-0 gap-3">
            <WorldPopulationMetrics />
            <div className="h-px bg-slate-800/80 w-full flex-shrink-0"></div>
            <GlobalConflictTracker />
        </div>
    );
}

function WorldPopulationMetrics() {
    const [population, setPopulation] = useState(8102353072);
    const [births, setBirths] = useState(167151);
    const [deaths, setDeaths] = useState(70657);

    useEffect(() => {
        const popInterval = setInterval(() => {
            const newBirths = Math.floor(Math.random() * 4) + 2;
            const newDeaths = Math.floor(Math.random() * 2) + 1;

            setBirths(prev => prev + newBirths);
            setDeaths(prev => prev + newDeaths);
            setPopulation(prev => prev + (newBirths - newDeaths));
        }, 1200);

        return () => clearInterval(popInterval);
    }, []);

    return (
        <div className="flex flex-col justify-center min-h-0 flex-shrink-0">
            {/* 1. World Population Metrics */}
            <div className="flex items-center gap-2 text-slate-200 text-[13px] font-black tracking-widest uppercase mb-1.5 shrink-0">
                <Users className="text-purple-400" size={24} />
                WORLD POPULATION METRICS
            </div>

            <div className="text-center mb-1.5 shrink-0">
                <div className="text-[2.75rem] font-black text-white tracking-tighter tabular-nums drop-shadow-md leading-none py-0.5">
                    {population.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Current World Population</div>
            </div>

            <div className="flex justify-center gap-6 mt-1 shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-green-400 font-extrabold text-sm tabular-nums">+{births.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Births Today</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-red-400 font-extrabold text-sm tabular-nums">+{deaths.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Deaths Today</span>
                </div>
            </div>
        </div>
    );
}

function GlobalConflictTracker() {
    const [flights, setFlights] = useState(13349);

    useEffect(() => {
        const flightInterval = setInterval(() => {
            setFlights(prev => prev + Math.floor(Math.random() * 5) - 2);
        }, 2500);

        return () => clearInterval(flightInterval);
    }, []);

    const activeConflicts = [
        { region: "Eastern Europe", status: "Critical" },
        { region: "Middle East", status: "Critical" },
        { region: "Sudan", status: "Elevated" },
        { region: "Myanmar", status: "Moderate" }
    ];

    return (
        <div className="flex flex-col justify-between min-h-0 flex-1 overflow-hidden">
            {/* 2. Global Conflict Tracker - Strict Sequential Layout */}
            <div className="flex-[4] flex flex-col min-h-0 gap-2 pb-1 overflow-hidden">
                <div className="flex items-center gap-2 text-slate-200 text-[13px] font-black tracking-widest uppercase flex-shrink-0">
                    <AlertTriangle className="text-red-500" size={18} />
                    GLOBAL CONFLICT TRACKER
                </div>

                <div className="flex flex-col gap-1.5 flex-grow min-h-0">
                    {/* SVG Vector Map on TOP */}
                    <div className="w-full flex-grow bg-slate-950/40 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[100px]">
                        <svg viewBox="0 0 100 72" className="absolute inset-0 w-full h-full opacity-80 fill-slate-950/75 stroke-cyan-500/40 stroke-[0.8]">
                            {/* Greenland */}
                            <path d="M 38 8 L 46 6 L 44 14 L 38 12 Z" />
                            {/* Iceland */}
                            <path d="M 35 15 L 37 15 L 36 17 Z" />
                            {/* UK & Ireland */}
                            <path d="M 38 21 L 39 19 L 40 21 Z" />
                            {/* Scandinavia */}
                            <path d="M 44 13 L 46 10 L 48 10 L 49 14 L 46 17 Z" />
                            {/* North America */}
                            <path d="M 2 12 L 8 10 L 14 10 L 26 8 L 30 11 L 34 12 L 32 16 L 36 21 L 28 26 L 24 33 L 18 31 L 12 25 L 8 25 L 3 17 Z" />
                            {/* Central America */}
                            <path d="M 24 33 L 26 35 L 28 35 Z" />
                            {/* South America */}
                            <path d="M 25 35 L 29 37 L 31 43 L 29 55 L 26 65 L 22 69 L 20 69 L 21 61 L 22 51 L 24 41 Z" />
                            {/* Europe */}
                            <path d="M 39 21 L 43 17 L 48 16 L 51 22 L 48 26 L 44 28 L 41 26 Z" />
                            {/* Africa */}
                            <path d="M 40 38 C 40 38, 41 36, 42 36 C 46 34, 52 35, 54 38 C 56 42, 58 46, 55 53 C 52 58, 48 64, 46 67 C 45 69, 44 67, 44 65 C 42 58, 40 50, 40 38 Z" />
                            {/* Madagascar */}
                            <path d="M 56 58 L 57 62 L 55 62 Z" />
                            {/* Asia */}
                            <path d="M 51 22 L 55 18 L 65 14 L 75 14 L 85 16 L 90 20 L 92 26 L 90 32 L 85 35 L 78 38 L 74 38 L 70 33 L 64 33 L 58 35 L 54 35 Z" />
                            {/* India */}
                            <path d="M 65 33 L 67 36 L 68 36 L 68 33 Z" />
                            {/* Japan */}
                            <path d="M 89 24 L 91 28 L 90 30 Z" />
                            {/* Indochina & SE Asia */}
                            <path d="M 72 35 L 75 42 L 77 44 L 74 45 Z" />
                            {/* Indonesia & Philippines */}
                            <path d="M 75 46 L 79 48 L 81 48 M 80 43 L 81 45 Z" />
                            {/* Australia */}
                            <path d="M 72 54 L 78 52 L 82 54 L 81 60 L 75 62 L 71 58 Z" />
                            {/* New Zealand */}
                            <path d="M 83 62 L 84 65 L 83 66 Z" />
                            {/* Antarctica */}
                            <path d="M 10 70 L 90 70 L 85 71 L 15 71 Z" />
                        </svg>

                        {/* Surgical Tactical Blips with Radial Pulse Radar Waves */}
                        <div className="absolute top-[30%] left-[47%] flex items-center justify-center">
                            <motion.div 
                                className="absolute w-4 h-4 rounded-full border border-red-500 bg-red-500/10"
                                animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: "easeOut" }}
                            />
                            <motion.div 
                                className="w-1.5 h-1.5 rounded-full bg-red-500 relative z-10" 
                                animate={{ opacity: [1.0, 0.4, 1.0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: [0.4, 0, 0.6, 1] }}
                            />
                        </div>

                        <div className="absolute top-[43%] left-[54%] flex items-center justify-center">
                            <motion.div 
                                className="absolute w-4 h-4 rounded-full border border-red-500 bg-red-500/10"
                                animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: "easeOut", delay: 2.0 }}
                            />
                            <motion.div 
                                className="w-1.5 h-1.5 rounded-full bg-red-500 relative z-10" 
                                animate={{ opacity: [1.0, 0.4, 1.0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: [0.4, 0, 0.6, 1], delay: 2.0 }}
                            />
                        </div>

                        <div className="absolute top-[53%] left-[48%] flex items-center justify-center">
                            <motion.div 
                                className="absolute w-4 h-4 rounded-full border border-orange-500 bg-orange-500/10"
                                animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: "easeOut", delay: 4.0 }}
                            />
                            <motion.div 
                                className="w-1.5 h-1.5 rounded-full bg-orange-500 relative z-10" 
                                animate={{ opacity: [1.0, 0.4, 1.0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: [0.4, 0, 0.6, 1], delay: 4.0 }}
                            />
                        </div>

                        <div className="absolute top-[44%] left-[71%] flex items-center justify-center">
                            <motion.div 
                                className="absolute w-3.5 h-3.5 rounded-full border border-yellow-500 bg-yellow-500/10"
                                animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: "easeOut", delay: 6.0 }}
                            />
                            <motion.div 
                                className="w-1 h-1 rounded-full bg-yellow-500 relative z-10" 
                                animate={{ opacity: [1.0, 0.4, 1.0] }}
                                transition={{ repeat: Infinity, duration: 8.0, ease: [0.4, 0, 0.6, 1], delay: 6.0 }}
                            />
                        </div>

                        <MapPin size={36} className="text-slate-700/20 absolute opacity-10" />
                    </div>

                    {/* List UNDERNEATH stacked in 2x2 Grid with Scaled-Up bold text */}
                    <div className="grid grid-cols-2 gap-2 flex-shrink-0 overflow-y-auto pr-1">
                        {activeConflicts.map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-950/60 py-1.5 px-2.5 rounded-md border border-slate-800/50">
                                <span className="text-slate-200 text-[13px] font-bold tracking-wide truncate pr-1">{c.region}</span>
                                <span className={`text-xs uppercase font-black px-3 py-1 rounded shrink-0 ${c.status === 'Critical' ? 'bg-[#ff0000]/20 text-[#ff0000] border border-[#ff0000]/40' :
                                    c.status === 'Elevated' ? 'bg-[#ff6600]/20 text-[#ff6600] border border-[#ff6600]/40' :
                                        'bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]/40'
                                    }`}>
                                    {c.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Live Commercial Flights (Compact Visuals) */}
            <div className="flex-[1] flex flex-col justify-end pt-2 overflow-hidden border-t border-slate-800/80 mt-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-black tracking-widest uppercase mb-1 flex-shrink-0">
                    <Plane className="text-blue-500" size={28} strokeWidth={2.5} />
                    LIVE COMMERCIAL FLIGHTS
                </div>
                <div className="flex items-end justify-between flex-grow min-h-0 pb-1">
                    <div className="flex flex-col justify-end">
                        <div className="text-3xl font-black text-white tracking-tighter leading-none">
                            {flights.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Airborne globally</div>
                    </div>
                    <div className="flex gap-1.5 items-end h-full max-h-8">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 bg-blue-500/80 rounded-t-sm"
                                style={{
                                    height: `${25 + (i * 12) + Math.random() * 20}%`,
                                    transition: 'height 0.5s ease'
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
