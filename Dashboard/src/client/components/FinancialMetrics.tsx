import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoData {
  price: number;
  change24h: number;
}

interface CurrencyData {
  brl: number;
  eur: number;
}

const BtcOfficialLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className="inline-block shrink-0 drop-shadow-md">
    <circle cx="32" cy="32" r="30" fill="#f7931a" />
    <path 
      d="M 39.5,27.5 C 40.8,26.8 41.5,25.5 41.5,24.0 C 41.5,20.8 38.8,20.0 35.0,20.0 L 35.0,16.0 L 33.0,16.0 L 33.0,20.0 L 30.5,20.0 L 30.5,16.0 L 28.5,16.0 L 28.5,20.0 L 23.0,20.0 L 23.0,23.0 L 25.5,23.0 C 26.5,23.0 27.0,23.5 27.0,24.5 L 27.0,39.5 C 27.0,40.5 26.5,41.0 25.5,41.0 L 23.0,41.0 L 23.0,44.0 L 28.5,44.0 L 28.5,48.0 L 30.5,48.0 L 30.5,44.0 L 33.0,44.0 L 33.0,48.0 L 35.0,48.0 L 35.0,44.0 C 39.5,44.0 42.5,42.8 42.5,39.0 C 42.5,36.5 41.0,34.8 38.5,34.0 C 40.5,33.0 41.5,31.5 41.5,29.5 C 41.5,28.5 40.8,27.8 39.5,27.5 Z M 30.5,23.0 L 34.5,23.0 C 37.0,23.0 38.5,23.8 38.5,26.0 C 38.5,28.2 37.0,29.0 34.5,29.0 L 30.5,29.0 L 30.5,23.0 Z M 30.5,32.0 L 35.5,32.0 C 38.0,32.0 39.5,32.8 39.5,35.0 C 39.5,37.2 38.0,38.0 35.5,38.0 L 30.5,38.0 L 30.5,32.0 Z" 
      fill="#ffffff" 
      transform="rotate(14 32 32)" 
    />
  </svg>
);

export function FinancialMetrics() {
  const [btc, setBtc] = useState<CryptoData>({ price: 0, change24h: 0 });
  const [fiat, setFiat] = useState<CurrencyData>({ brl: 0, eur: 0 });
  const [priceHistory, setPriceHistory] = useState<number[]>(Array(20).fill(0));
  const [fiatHistory, setFiatHistory] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    const fetchBtc = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await res.json();
        if (data.bitcoin) {
          setBtc({
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
          });
          setPriceHistory(prev => {
            const hist = prev.some(v => v === 0) ? Array(20).fill(data.bitcoin.usd) : prev;
            return hist;
          });
        }
      } catch (e) {
        console.error('Failed to fetch BTC', e);
      }
    };

    const fetchFiat = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates) {
          setFiat({
            brl: data.rates.BRL,
            eur: data.rates.EUR > 0 ? 1 / data.rates.EUR : 0,
          });
          setFiatHistory(prev => {
            const hist = prev.some(v => v === 0) ? Array(20).fill(data.rates.BRL) : prev;
            return hist;
          });
        }
      } catch (e) {
        console.error('Failed to fetch Fiat', e);
      }
    };

    fetchBtc();
    fetchFiat();
    const interval = setInterval(() => {
      fetchBtc();
      fetchFiat();
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const [liveBtcPrice, setLiveBtcPrice] = useState(btc.price);
  const [liveFiatBrl, setLiveFiatBrl] = useState(fiat.brl);
  const [liveFiatEur, setLiveFiatEur] = useState(fiat.eur);
  
  useEffect(() => {
    setLiveBtcPrice(btc.price);
    if (!btc.price) return;
    
    // Simulate real-time fluctuations
    const jitter = setInterval(() => {
      setLiveBtcPrice(prev => {
        const newPrice = prev * (1 + (Math.random() - 0.5) * 0.0001);
        setPriceHistory(curr => [...curr.slice(1), newPrice]);
        return newPrice;
      });
    }, 2500);
    return () => clearInterval(jitter);
  }, [btc.price]);

  useEffect(() => {
    setLiveFiatBrl(fiat.brl);
    if (!fiat.brl) return;
    
    // Simulate real-time fluctuations for fiat
    const fiatJitter = setInterval(() => {
      setLiveFiatBrl(prev => {
        const newPrice = prev * (1 + (Math.random() - 0.5) * 0.0001);
        setFiatHistory(curr => [...curr.slice(1), newPrice]);
        return newPrice;
      });
    }, 2500);
    return () => clearInterval(fiatJitter);
  }, [fiat.brl]);

  useEffect(() => {
    setLiveFiatEur(fiat.eur);
    if (!fiat.eur) return;
    
    // Simulate real-time fluctuations for EUR
    const eurJitter = setInterval(() => {
      setLiveFiatEur(prev => {
        return prev * (1 + (Math.random() - 0.5) * 0.0001);
      });
    }, 2500);
    return () => clearInterval(eurJitter);
  }, [fiat.eur]);

  // Generate SVG Sparkline Path
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const range = maxPrice - minPrice || 1;
  const sparklinePath = priceHistory.map((p, i) => {
    const x = (i / (priceHistory.length - 1)) * 100;
    const y = 100 - ((p - minPrice) / range) * 80 - 10; // 10% padding top/bottom
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const minFiat = Math.min(...fiatHistory);
  const maxFiat = Math.max(...fiatHistory);
  const fiatRange = maxFiat - minFiat || 1;
  const fiatSparklinePath = fiatHistory.map((p, i) => {
    const x = (i / (fiatHistory.length - 1)) * 100;
    const y = 100 - ((p - minFiat) / fiatRange) * 80 - 10;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const isBrlUp = liveFiatBrl >= fiat.brl;

  return (
    <div className="grid grid-cols-2 gap-2 h-full">
      {/* BTC Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl pt-2 pb-3 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col justify-between relative">
        <div className="flex items-center gap-2 text-[#f7931a] text-sm font-black tracking-widest uppercase mb-1 z-10 relative">
          <BtcOfficialLogo size={28} />
          BITCOIN (BTC/USD)
        </div>
        <div className="text-3xl font-black text-white tracking-tight z-10 relative">
          ${liveBtcPrice > 0 ? liveBtcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
        </div>
        <div className={`flex items-center gap-1 mt-1 text-[11px] font-bold uppercase tracking-wider z-10 relative ${btc.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {btc.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(btc.change24h).toFixed(2)}% (24H)</span>
        </div>

        {/* SVG Sparkline */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 z-0 pointer-events-none">
           <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d={sparklinePath} fill="none" stroke={btc.change24h >= 0 ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinejoin="round" />
             <path d={`${sparklinePath} L 100 100 L 0 100 Z`} fill={btc.change24h >= 0 ? 'url(#greenGradient)' : 'url(#redGradient)'} stroke="none" />
             <defs>
               <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
               </linearGradient>
               <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
               </linearGradient>
             </defs>
           </svg>
        </div>
      </div>

      {/* USD Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl pt-2 pb-3 px-3 shadow-2xl h-full max-h-full overflow-hidden flex flex-col justify-between relative">
        <div className="flex items-center gap-1.5 text-sky-400 text-sm font-black tracking-widest uppercase mb-1 z-10 relative">
          <DollarSign className="text-sky-400" size={28} strokeWidth={2.5} />
          US DOLLAR (USD/BRL)
        </div>
        <div className="text-3xl font-black text-white tracking-tight z-10 relative">
          R$ {liveFiatBrl > 0 ? liveFiatBrl.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) : '---'}
        </div>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider z-10 relative">
          <span>Global Live</span>
          <span className="bg-sky-950/40 border border-sky-500/30 px-1.5 py-0.5 rounded text-sky-300 font-bold">EUR/USD: ${liveFiatEur > 0 ? liveFiatEur.toFixed(2) : '---'}</span>
        </div>

        {/* SVG Sparkline */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 z-0 pointer-events-none">
           <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
             <path d={fiatSparklinePath} fill="none" stroke={isBrlUp ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinejoin="round" />
             <path d={`${fiatSparklinePath} L 100 100 L 0 100 Z`} fill={isBrlUp ? 'url(#fiatGreenGradient)' : 'url(#fiatRedGradient)'} stroke="none" />
             <defs>
               <linearGradient id="fiatGreenGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
               </linearGradient>
               <linearGradient id="fiatRedGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
               </linearGradient>
             </defs>
           </svg>
        </div>
      </div>
    </div>
  );
}
