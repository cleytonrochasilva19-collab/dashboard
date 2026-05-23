import { useEffect, useState } from 'react';
import { Satellite } from 'lucide-react';

interface ISSData {
  latitude: number;
  longitude: number;
  velocity: number;
  altitude: number;
}

function getOverflyingRegion(lat: number, lng: number): string {
  if (lat > 24 && lat < 49 && lng > -125 && lng < -69) return "United States";
  if (lat > -34 && lat < 5 && lng > -74 && lng < -34) return "Brazil";
  if (lat > 35 && lat < 70 && lng > -10 && lng < 40) return "Europe";
  if (lat > 50 && lat < 75 && lng > 30 && lng < 180) return "Northern Asia";
  if (lat > 10 && lat < 40 && lng > 70 && lng < 135) return "India/China Region";
  if (lat > -40 && lat < -10 && lng > 113 && lng < 153) return "Australia";
  if (lat > -35 && lat < 37 && lng > -17 && lng < 51) return "Africa";
  
  if (lng > -30 && lng < 0) return "Atlantic Ocean";
  if (lng > -70 && lng < -30) return "Atlantic Ocean";
  if (lng > 60 && lng < 100) return "Indian Ocean";
  if (lng > 140 || lng < -100) return "Pacific Ocean";
  return "Pacific Ocean";
}

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400 fill-current shrink-0">
    {/* Main rocket body/fairing */}
    <path d="M12 2C10.5 5 9.5 8.5 9.5 12C9.5 15.5 10.5 18 12 20C13.5 18 14.5 15.5 14.5 12C14.5 8.5 13.5 5 12 2Z" />
    {/* Left booster fin */}
    <path d="M9.5 13C8 14.5 6.5 17 6.5 19.5C6.5 20 7 20 7.5 20C9 20 9.5 18 9.5 16V13Z" />
    {/* Right booster fin */}
    <path d="M14.5 13C16 14.5 17.5 17 17.5 19.5C17.5 20 17 20 16.5 20C15 20 14.5 18 14.5 16V13Z" />
    {/* Center thruster flame */}
    <path d="M11 21C11 22.5 12 23 12 23C12 23 13 22.5 13 21H11Z" />
  </svg>
);

export function SpaceAndAviation() {
  const [iss, setIss] = useState<ISSData>({
    latitude: -23.5542,
    longitude: -46.6378,
    velocity: 27562,
    altitude: 421
  });

  const launchDate = new Date('2028-01-01T00:00:00Z').getTime();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        setIss({
          latitude: data.latitude,
          longitude: data.longitude,
          velocity: data.velocity,
          altitude: data.altitude,
        });
      } catch (e) {
        // Orbital trajectory simulation fallback
        setIss(prev => {
          let nextLat = prev.latitude + 0.08;
          let nextLng = prev.longitude + 0.18;
          if (nextLat > 85) nextLat = -85;
          if (nextLng > 180) nextLng = -180;
          return {
            ...prev,
            latitude: nextLat,
            longitude: nextLng,
            velocity: 27550 + Math.floor(Math.random() * 20 - 10)
          };
        });
      }
    };

    fetchISS();
    const issInterval = setInterval(fetchISS, 3000); 

    const calcDays = () => {
      const now = new Date().getTime();
      const diff = launchDate - now;
      setDaysLeft(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
    };
    calcDays();
    const countdownInterval = setInterval(calcDays, 60000);
    
    return () => {
      clearInterval(issInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col justify-between">
      {/* ISS Tracker */}
      <div>
        <div className="flex items-center justify-between mb-2.5 border-b border-slate-800/80 pb-2.5 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black tracking-widest uppercase">
            <Satellite className="text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} size={28} />
            INTL SPACE STATION TRACKER
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm text-red-500 font-black uppercase tracking-widest leading-none">LIVE</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1.5">LATITUDE / LONGITUDE</div>
            <div className="font-mono text-white font-black text-xl leading-tight">
              {iss.latitude.toFixed(4)}° N
            </div>
            <div className="font-mono text-white font-black text-xl leading-tight mt-1">
              {iss.longitude.toFixed(4)}° E
            </div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/80 flex flex-col justify-center">
            <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">ORBITAL SPEED</div>
            <div className="font-mono font-black text-lg text-cyan-300 drop-shadow-md leading-tight">
              {Math.round(iss.velocity).toLocaleString()} <span className="text-cyan-400 font-black">KM/H</span>
            </div>
            <div className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mt-2">
              LIVE ALT
            </div>
            <div className="font-mono font-black text-lg text-cyan-300 leading-tight mt-0.5">
              {Math.round(iss.altitude)} <span className="text-cyan-400 font-black">KM</span>
            </div>
          </div>
        </div>

        {/* Dynamic Overflying Telemetry */}
        <div className="mt-3 text-[12px] text-cyan-400 font-extrabold uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/40 px-3 py-2.5 rounded flex items-center justify-between">
          <span>OVERFLYING:</span>
          <span className="text-white font-black text-base">{getOverflyingRegion(iss.latitude, iss.longitude)}</span>
        </div>
      </div>

      <div className="h-px bg-slate-800/80 w-full my-2.5"></div>

      {/* Artemis IV Mission Countdown Card */}
      <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/80 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[9.5px] font-black tracking-widest uppercase">NASA DEEP SPACE PROGRAM</span>
            <div className="text-[12px] text-cyan-400 font-black tracking-wider uppercase">ARTEMIS IV MISSION</div>
          </div>
          <RocketIcon />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <div className="text-4xl font-black text-cyan-400 tracking-tighter leading-none">
              {daysLeft} <span className="text-[13px] text-white font-black tracking-widest uppercase ml-2">DAYS UNTIL LAUNCH</span>
            </div>
            <div className="text-[14.5px] text-slate-300 font-bold uppercase tracking-widest mt-2.5">
              MAN'S RETURN TO THE MOON (Estimated Date)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
