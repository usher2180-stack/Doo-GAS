import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, RefreshCw, Cloud, CloudRain, CloudLightning, CloudSnow, CloudSun, MapPin, Calendar } from 'lucide-react';

interface WeatherData {
  temp: number;
  code: number;
  city: string;
}

const WeatherIcon = ({ code }: { code: number }) => {
  if (code === 0) return <Sun className="w-4 h-4 text-yellow-400" />;
  if (code <= 3) return <CloudSun className="w-4 h-4 text-blue-300" />;
  if (code <= 48) return <Cloud className="w-4 h-4 text-neutral-400" />;
  if (code <= 65 || (code >= 80 && code <= 82)) return <CloudRain className="w-4 h-4 text-blue-500" />;
  if (code <= 77) return <CloudSnow className="w-4 h-4 text-blue-100" />;
  if (code >= 95) return <CloudLightning className="w-4 h-4 text-purple-500" />;
  return <Cloud className="w-4 h-4" />;
};

const LottoBall = ({ number, delay, isDarkMode }: { number: number; delay: number; isDarkMode: boolean }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: delay 
      }}
      className={`
        w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center 
        font-sans font-bold text-lg md:text-2xl text-white
        ${isDarkMode ? 'ball-dark' : 'ball-light'}
      `}
    >
      {number.toString().padStart(2, '0')}
    </motion.div>
  );
};

const LottoSet = ({ numbers, index, isNew, isDarkMode }: { numbers: number[]; index: number; isNew: boolean; isDarkMode: boolean }) => {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 30 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: "spring", damping: 25 }}
      className="w-full max-w-2xl bg-white/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-6 shadow-2xl backdrop-blur-md"
    >
      <div className="w-full flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 opacity-70">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Selection Set {index + 1}</span>
        <span className="text-[10px] font-mono tracking-widest">{new Date().toLocaleDateString()}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:gap-5">
        {numbers.map((num, i) => (
          <LottoBall key={`${index}-${num}-${i}`} number={num} delay={index * 0.05 + i * 0.08} isDarkMode={isDarkMode} />
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lottoSets, setLottoSets] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`),
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`)
        ]);
        const weatherData = await weatherRes.json();
        const geoData = await geoRes.json();
        
        setWeather({
          temp: Math.round(weatherData.current_weather.temperature),
          code: weatherData.current_weather.weathercode,
          city: geoData.locality || geoData.city || '알 수 없는 위치'
        });
      } catch (err) {
        console.error('Failed to fetch weather/location', err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => console.warn('Geolocation access denied')
      );
    }
  }, []);

  const generateLottoNumbers = () => {
    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  };

  const drawAllSets = useCallback(() => {
    setIsDrawing(true);
    setLottoSets([]);
    
    setTimeout(() => {
      const newSets = Array.from({ length: 6 }, () => generateLottoNumbers());
      setLottoSets(newSets);
      setIsDrawing(false);
    }, 150);
  }, []);

  useEffect(() => {
    drawAllSets();
  }, [drawAllSets]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className={`min-h-screen relative flex flex-col items-center transition-all duration-700 font-sans overflow-x-hidden ${isDarkMode ? 'immersive-dark-bg text-[#F8FAFC]' : 'immersive-light-bg text-[#1E293B]'}`}>
        
        {/* Decorative Glow */}
        <div className="glow-effect top-[20%] left-[50%] -translate-x-1/2 opacity-50" />
        <div className="glow-effect top-[80%] left-[20%] opacity-30" />

        {/* Mode Label */}
        <span className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.3em] opacity-40 uppercase">
          {isDarkMode ? 'IMMERSIVE DARK' : 'IMMERSIVE LIGHT'}
        </span>

        {/* Info Widget */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col items-end gap-2 z-50">
          <div className="flex items-center gap-3 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 py-2 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-[11px] font-bold opacity-80">
                <Calendar className="w-3 h-3 text-blue-500" />
                <span>{currentTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</span>
              </div>
              <div className="text-[10px] opacity-50 font-mono tracking-tighter">
                {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </div>
            </div>
            <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1" />
            <div className="flex flex-col items-end">
              {weather ? (
                <>
                  <div className="flex items-center gap-2 text-[11px] font-bold opacity-80">
                    <WeatherIcon code={weather.code} />
                    <span>{weather.temp}°C</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] opacity-60 font-medium">
                    <MapPin className="w-2.5 h-2.5 text-red-400" />
                    <span className="truncate max-w-[80px]">{weather.city}</span>
                  </div>
                </>
              ) : (
                <div className="animate-pulse flex flex-col items-end gap-1">
                  <div className="w-12 h-3 bg-neutral-400/20 rounded" />
                  <div className="w-16 h-2 bg-neutral-400/10 rounded" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="w-full max-w-5xl px-8 py-16 md:py-24 flex flex-col items-center z-10">
          <div className="text-3xl md:text-5xl font-black tracking-[-0.04em] mb-4">LOTTO DREAM</div>
          <div className="h-1 w-12 bg-blue-500 rounded-full mb-12" />
        </header>

        {/* Action Section */}
        <div className="flex flex-col items-center gap-12 w-full max-w-4xl px-6 pb-24 z-10">
          <button
            onClick={drawAllSets}
            disabled={isDrawing}
            id="draw-button"
            className={`px-12 py-5 rounded-full font-bold text-lg transition-all active:scale-95 shadow-2xl flex items-center gap-4 ${isDarkMode ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]' : 'bg-[#1E293B] text-white hover:bg-black'}`}
          >
            <RefreshCw className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>행운의 번호 생성하기</span>
          </button>

          <div className="grid grid-cols-1 gap-8 w-full justify-items-center">
            <AnimatePresence mode="popLayout">
              {!isDrawing && lottoSets.map((numbers, idx) => (
                <LottoSet 
                  key={`set-${idx}`} 
                  index={idx} 
                  numbers={numbers} 
                  isNew={lottoSets.length > 0} 
                  isDarkMode={isDarkMode}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Theme Toggle Floating */}
        <button 
          onClick={toggleDarkMode}
          id="theme-toggle"
          className={`fixed bottom-10 right-10 p-5 rounded-full backdrop-blur-xl border transition-all hover:scale-110 active:scale-90 z-50 ${isDarkMode ? 'bg-white/10 border-white/20 text-yellow-400' : 'bg-black/10 border-black/20 text-blue-600'}`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* Footer */}
        <footer className="w-full max-w-4xl px-8 py-20 mt-auto border-t border-black/5 dark:border-white/5 opacity-40 text-center">
          <div className="text-[12px] font-bold tracking-widest uppercase mb-4 text-blue-500">RECENT ANALYSIS</div>
          <div className="space-y-4 max-w-xs mx-auto">
            <div className="flex justify-between text-[11px] font-mono border-b border-black/5 dark:border-white/5 pb-2">
              <span>제 1121회</span>
              <span className="font-bold">02 18 24 30 32 45</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono border-b border-black/5 dark:border-white/5 pb-2">
              <span>제 1120회</span>
              <span className="font-bold">11 15 20 25 33 41</span>
            </div>
          </div>
          <p className="mt-12 text-[10px] tracking-tight">© 2026 LOTTO DREAM CO. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  );
}
