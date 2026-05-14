import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, RefreshCw } from 'lucide-react';

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

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
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
