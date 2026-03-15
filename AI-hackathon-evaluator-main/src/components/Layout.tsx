import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isFullScreenPage = location.pathname === '/' || location.pathname === '/login' || location.pathname.startsWith('/team') || location.pathname.startsWith('/admin');

  if (isFullScreenPage) {
    return (
      <main
        className="w-full min-h-screen"
      >
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30 selection:text-primary-foreground">
      {/* Animated Abstract Background Shapes */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 20, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[100px]" 
        />
      </div>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
