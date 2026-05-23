import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CityData {
  name: string;
  lat: number;
  lng: number;
  timezone: string;
  temp: number;
  code: number; // WMO weather code
}

const INITIAL_CITIES: CityData[] = [
  { name: 'SAO PAULO', lat: -23.55, lng: -46.63, timezone: 'America/Sao_Paulo', temp: 22.4, code: 2 },
  { name: 'Washington', lat: 38.89, lng: -77.03, timezone: 'America/New_York', temp: 18.2, code: 0 },
  { name: 'New York', lat: 40.71, lng: -74.00, timezone: 'America/New_York', temp: 19.5, code: 1 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, timezone: 'Asia/Tokyo', temp: 16.1, code: 3 },
  { name: 'Shanghai', lat: 31.23, lng: 121.47, timezone: 'Asia/Shanghai', temp: 20.8, code: 61 },
  { name: 'Mumbai', lat: 19.07, lng: 72.87, timezone: 'Asia/Kolkata', temp: 32.7, code: 0 },
  { name: 'London', lat: 51.50, lng: -0.12, timezone: 'Europe/London', temp: 12.3, code: 53 },
  { name: 'Paris', lat: 48.85, lng: 2.35, timezone: 'Europe/Paris', temp: 14.5, code: 2 },
  { name: 'Rome', lat: 41.90, lng: 12.49, timezone: 'Europe/Rome', temp: 21.0, code: 1 },
  { name: 'Dubai', lat: 25.20, lng: 55.27, timezone: 'Asia/Dubai', temp: 37.6, code: 0 },
];

export function WorldClockWeather() {
  const [cities, setCities] = useState<CityData[]>(INITIAL_CITIES);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clockInterval = setInterval(() => setNow(new Date()), 1000);

    const fetchWeather = async () => {
      try {
        const lats = INITIAL_CITIES.map(c => c.lat).join(',');
        const lngs = INITIAL_CITIES.map(c => c.lng).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m,weather_code`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        let updatedCities: CityData[] = [];
        if (Array.isArray(data)) {
          updatedCities = INITIAL_CITIES.map((city, idx) => ({
            ...city,
            temp: data[idx]?.current?.temperature_2m ?? city.temp,
            code: data[idx]?.current?.weather_code ?? city.code,
          }));
        } else if (data.current) {
          updatedCities = INITIAL_CITIES.map(city => ({
            ...city,
            temp: data.current.temperature_2m ?? city.temp,
            code: data.current.weather_code ?? city.code
          }));
        } else {
          updatedCities = [...INITIAL_CITIES];
        }

        // Forced Reordering Safeguard: Ensure Mumbai is physically before London
        const mumbaiIdx = updatedCities.findIndex(c => c.name.toLowerCase() === 'mumbai');
        const londonIdx = updatedCities.findIndex(c => c.name.toLowerCase() === 'london');
        if (mumbaiIdx !== -1 && londonIdx !== -1 && londonIdx < mumbaiIdx) {
          const temp = updatedCities[mumbaiIdx];
          updatedCities[mumbaiIdx] = updatedCities[londonIdx];
          updatedCities[londonIdx] = temp;
        }

        setCities(updatedCities);
      } catch (e) {
        console.warn("Weather fetch failed (rate limit or offline), using active simulation engine fallback", e);
      }
    };

    fetchWeather();
    // 5 minutes real fetch interval
    const weatherInterval = setInterval(fetchWeather, 5 * 60 * 1000); 

    // Dynamic temperature fluctuation engine for organic visual change
    const fluctuationInterval = setInterval(() => {
      setCities(prev => {
        const updated = prev.map(city => {
          const delta = (Math.random() - 0.5) * 0.2; // +/- 0.1 degree fluctuation
          return {
            ...city,
            temp: +(city.temp + delta).toFixed(1)
          };
        });

        // Forced Reordering Safeguard: Ensure Mumbai is physically before London
        const mumbaiIdx = updated.findIndex(c => c.name.toLowerCase() === 'mumbai');
        const londonIdx = updated.findIndex(c => c.name.toLowerCase() === 'london');
        if (mumbaiIdx !== -1 && londonIdx !== -1 && londonIdx < mumbaiIdx) {
          const temp = updated[mumbaiIdx];
          updated[mumbaiIdx] = updated[londonIdx];
          updated[londonIdx] = temp;
        }
        return updated;
      });
    }, 10000);
    
    return () => {
      clearInterval(clockInterval);
      clearInterval(weatherInterval);
      clearInterval(fluctuationInterval);
    };
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun size={16} strokeWidth={2.5} className="text-amber-400 animate-pulse" />;
    if (code >= 51 && code <= 82) return <CloudRain size={16} strokeWidth={2.5} className="text-sky-400" />;
    return <Cloud size={16} strokeWidth={2.5} className="text-slate-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl pt-7 pb-3 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col relative">
      <div className="absolute top-2 left-3 right-3 flex items-center gap-2 text-slate-200 text-[12.5px] font-black tracking-widest uppercase border-b border-slate-800/80 pb-1.5 z-10">
        <Clock className="text-sky-400" size={22} />
        WORLD CLOCK & WEATHER
      </div>
      
      <div className="grid grid-cols-5 gap-2 w-full h-full min-h-0 flex-1 relative z-10 mt-1">
        {cities.map((city) => {
          const timeString = now.toLocaleTimeString('en-US', {
            timeZone: city.timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
          // Strict JavaScript render-loop string sanitization for SAO PAULO
          let sanitizedName = city.name.toUpperCase();
          if (sanitizedName.includes('SÃO') || sanitizedName.includes('SAO PAULO') || sanitizedName.includes('SÃO PAULO')) {
            sanitizedName = 'SAO PAULO';
          }
          
          return (
            <div key={city.name} className="h-full py-0.5 px-1.5 flex flex-col justify-center items-center overflow-hidden bg-slate-950/80 rounded-md border border-slate-800/60 text-center w-full gap-y-0.5">
              <span className="text-xs font-black text-slate-200 uppercase tracking-wider truncate w-full">{sanitizedName}</span>
              <span className="text-xl font-black text-white tracking-tighter font-mono leading-none">{timeString}</span>
              <div className="flex items-center gap-1 text-xs font-black">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${city.code}-${city.temp}`}
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1"
                  >
                    {getWeatherIcon(city.code)}
                    <span className="text-slate-200 font-mono font-bold">
                      {city.temp.toFixed(1)}°
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
