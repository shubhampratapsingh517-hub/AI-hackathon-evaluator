import React, { useEffect, useRef } from 'react';

const InteractiveParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseSize: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 1.5 + 1;
        this.size = this.baseSize;
        
        const rand = Math.random();
        if (rand < 0.4) {
             this.color = 'rgba(34, 211, 238, '; // Cyan-400
        } else if (rand < 0.8) {
             this.color = 'rgba(192, 132, 252, '; // Purple-400
        } else {
             this.color = 'rgba(244, 114, 182, '; // Pink-400
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary check with hard reset to prevent sticking
        if (this.x < 0) { this.x = 0; this.vx *= -1; }
        else if (this.x > width) { this.x = width; this.vx *= -1; }
        if (this.y < 0) { this.y = 0; this.vy *= -1; }
        else if (this.y > height) { this.y = height; this.vy *= -1; }

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceSq = dx * dx + dy * dy;
        const mouseDistanceSq = mouseDistance * mouseDistance;

        if (distanceSq < mouseDistanceSq) {
            const distance = Math.sqrt(distanceSq);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            
            const directionX = forceDirectionX * force * this.size * 2;
            const directionY = forceDirectionY * force * this.size * 2;

            this.x -= directionX * 0.8; 
            this.y -= directionY * 0.8;
            
            if (this.size < this.baseSize * 2.5) {
                this.size += 0.1;
            }
        } else {
            if (this.size > this.baseSize) {
                this.size -= 0.05;
            }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + '0.8)';
        
        // Glow effect (only for larger/hovered particles to save perf)
        if (this.size > this.baseSize * 1.2) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color + '1)';
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset after drawing
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 15000), 80); // Medium density
    const connectionDistance = 140;
    const connectionDistanceSq = connectionDistance * connectionDistance;
    const mouseDistance = 200;
    const mouseDistanceSq = mouseDistance * mouseDistance;

    let mouse = { x: -1000, y: -1000 };

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < connectionDistanceSq) {
            const distance = Math.sqrt(distanceSq);
            ctx.beginPath();
            const opacity = (1 - distance / connectionDistance) * 0.15;
            
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            gradient.addColorStop(0, particles[i].color + opacity + ')');
            gradient.addColorStop(1, particles[j].color + opacity + ')');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1; 
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distanceSq = dx * dx + dy * dy;
        
        if (distanceSq < mouseDistanceSq) {
            const distance = Math.sqrt(distanceSq);
            ctx.beginPath();
            const opacity = (1 - distance / mouseDistance) * 0.4;
            ctx.strokeStyle = particles[i].color + opacity + ')';
            ctx.lineWidth = 2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      }

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-1 pointer-events-none mix-blend-screen"
      style={{ background: 'transparent' }}
    />
  );
};

export default InteractiveParticleBackground;
