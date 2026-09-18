import React, { useEffect } from 'react';
import { motion } from 'motion/react';

// A stylized sneaker SVG icon
const Sneaker = ({ className, flipped }: { className?: string; flipped?: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
    style={{ transform: flipped ? 'scaleX(-1)' : 'none' }}
  >
    <path d="M21.75 13.5l-3.25-1.5c-.75-.35-1.5-1.25-1.75-2l-.5-2.5c-.25-1.25-1.5-2.25-2.75-2.25h-3c-1.5 0-2.75 1.25-2.75 2.75v1.75c0 1.25-1 2.25-2.25 2.25H4.25C2.5 12 1 13.5 1 15.25v2.25c0 .75.5 1.25 1.25 1.25h16.25c1.25 0 2.25-1 2.25-2.25v-1.75c0-.5-.5-1-.5-1.25z" />
  </svg>
);

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Failsafe timer to ensure app loads even if animation bugs out
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[99999] bg-[#0D0D0F] flex items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
    >
      {/* Central "V" */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
        animate={{ 
          scale: [0.5, 1, 1, 1.25], 
          opacity: [0, 1, 1, 1], 
          filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'] 
        }}
        transition={{ 
          duration: 2.5, 
          ease: 'easeOut',
          times: [0, 0.4, 0.68, 1] // 0.68 of 2.5s is 1.7s (exactly when sneakers cross)
        }}
        className="absolute font-black tracking-tighter font-['Syne',sans-serif] flex items-center justify-center"
        style={{ fontSize: '25vw' }}
      >
        <span className="text-zinc-500 relative drop-shadow-2xl">
          V
          
          {/* Reflection Sweep */}
          <motion.span
            initial={{ backgroundPosition: '200% 0' }}
            animate={{ backgroundPosition: '-200% 0' }}
            transition={{ 
              duration: 1.2, 
              delay: 1.6, // Sweeps exactly when they cross
              ease: 'easeInOut' 
            }}
            className="absolute inset-0 bg-clip-text text-transparent pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.8) 60%, transparent 80%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8))'
            }}
          >
            V
          </motion.span>
        </span>
      </motion.div>

      {/* Sneaker 1 (Starts Left, crosses center, splashes Right) */}
      <motion.div
        initial={{ x: '-100vw', y: '50vh', rotate: -30, opacity: 0, scale: 0.5 }}
        animate={{ 
          x: ['-100vw', '0vw', '100vw'], 
          y: ['50vh', '0vh', '-50vh'], 
          rotate: [-30, 0, 45],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2.2, 
          ease: "easeInOut", 
          delay: 0.6,
          times: [0, 0.5, 1]
        }}
        className="absolute w-40 h-40 text-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]"
      >
        <Sneaker className="w-full h-full" />
      </motion.div>

      {/* Sneaker 2 (Starts Right, crosses center, splashes Left) */}
      <motion.div
        initial={{ x: '100vw', y: '50vh', rotate: 30, opacity: 0, scale: 0.5 }}
        animate={{ 
          x: ['100vw', '0vw', '-100vw'], 
          y: ['50vh', '0vh', '-50vh'], 
          rotate: [30, 0, -45],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 0.8]
        }}
        transition={{ 
          duration: 2.2, 
          ease: "easeInOut", 
          delay: 0.6,
          times: [0, 0.5, 1]
        }}
        className="absolute w-40 h-40 text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]"
        onAnimationComplete={() => {
          setTimeout(() => {
            onComplete();
          }, 400); // Small delay after they fly off before removing splash screen
        }}
      >
        <Sneaker className="w-full h-full" flipped />
      </motion.div>
    </motion.div>
  );
};
