import { useEffect, useState } from 'react';
import { CalendarDays, Trophy } from 'lucide-react';

export function WorldCupCountdown() {
  const openingMatchDate = new Date('2026-06-11T19:00:00Z').getTime();
  const finalMatchDate = new Date('2026-07-19T17:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      let distance = openingMatchDate - now;
      let targetIsFinal = false;

      if (distance < 0) {
        distance = finalMatchDate - now;
        targetIsFinal = true;
      }
      
      setIsFinal(targetIsFinal);

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center bg-slate-950 border border-slate-800/80 rounded-lg p-2 min-w-[56px]">
      <span className="text-2xl font-mono font-black text-yellow-400 tracking-tighter">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs uppercase tracking-widest text-white font-black mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl pt-2 pb-3 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col justify-between relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 text-yellow-400/20 opacity-50">
        <Trophy size={200} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-slate-300 text-sm font-black tracking-widest uppercase">
            <CalendarDays className={isFinal ? "text-yellow-400" : "text-blue-500"} size={28} strokeWidth={2.5} />
            {isFinal ? "ROAD TO FINAL" : "ROAD TO OPENING"}
          </div>
          <Trophy className="text-yellow-400" size={48} strokeWidth={2.5} />
        </div>
        
        <div className="mt-auto">
          <h2 className="text-lg font-black text-white mb-1.5 leading-none uppercase tracking-tight">
            WORLD CUP 2026<br />
            <span className="text-sm text-yellow-400">
              {isFinal ? "THE GRAND FINAL" : "KICK-OFF"}
            </span>
          </h2>
          
          <div className="flex gap-2 pb-2">
            <TimeUnit label="Days" value={timeLeft.days} />
            <div className="text-xl font-bold text-slate-600 self-start mt-1">:</div>
            <TimeUnit label="Hours" value={timeLeft.hours} />
            <div className="text-xl font-bold text-slate-600 self-start mt-1">:</div>
            <TimeUnit label="Mins" value={timeLeft.minutes} />
            <div className="text-xl font-bold text-slate-600 self-start mt-1">:</div>
            <TimeUnit label="Secs" value={timeLeft.seconds} />
          </div>
        </div>
      </div>
    </div>
  );
}
