import React, { useEffect, useRef } from 'react';

export const CyberpunkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Matrix Rain Configuration
    const fontSize = 16;
    const columns = Math.ceil(width / fontSize);
    // Initialize drops randomly across the screen height so it starts fully populated
    const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * (height / fontSize));
    
    // Characters to drop (Binary + Hex + Katakana for cyberpunk feel)
    const chars = "0123456789ABCDEFﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ⚡★";

    const draw = () => {
      // Semi-transparent black to create trail effect
      // Using a very low opacity black allows the trail to linger
      ctx.fillStyle = 'rgba(5, 8, 15, 0.05)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;
      
      // Add glow effect
      ctx.shadowBlur = 8;
      
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Color logic: Vibrant Neon Palette
        const random = Math.random();
        if (random > 0.98) {
          ctx.fillStyle = '#ffffff'; // White highlight
          ctx.shadowColor = '#ffffff';
        } else if (random > 0.9) {
          ctx.fillStyle = '#d946ef'; // Fuchsia-500 (Magenta)
          ctx.shadowColor = '#d946ef';
        } else if (random > 0.8) {
          ctx.fillStyle = '#a855f7'; // Purple-500
          ctx.shadowColor = '#a855f7';
        } else {
          ctx.fillStyle = '#06b6d4'; // Cyan-500
          ctx.shadowColor = '#06b6d4';
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it crosses screen
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      
      // Reset shadow for next frame performance
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen z-0"
    />
  );
};
