import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedNetworkBackgroundProps {
  color: string;
}

const PARTICLE_COUNT = 80;
const MAX_FPS = 30;

const AnimatedNetworkBackground: React.FC<AnimatedNetworkBackgroundProps> = React.memo(({ color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.001,
      vy: (Math.random() - 0.5) * 0.001,
      size: Math.random() * 2 + 1,
    }));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    offscreenCanvasRef.current = document.createElement('canvas');
    offscreenCanvasRef.current.width = dimensions.width;
    offscreenCanvasRef.current.height = dimensions.height;

    const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
    if (!offscreenCtx) return;

    const maxDistance = 0.15;

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
      });
    };

    const drawParticles = () => {
      offscreenCtx.clearRect(0, 0, dimensions.width, dimensions.height);

      particles.forEach((particle) => {
        const x = particle.x * dimensions.width;
        const y = particle.y * dimensions.height;

        offscreenCtx.beginPath();
        offscreenCtx.arc(x, y, particle.size, 0, Math.PI * 2);
        offscreenCtx.fillStyle = `${color}30`;
        offscreenCtx.fill();

        particles.forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            offscreenCtx.beginPath();
            offscreenCtx.moveTo(x, y);
            offscreenCtx.lineTo(otherParticle.x * dimensions.width, otherParticle.y * dimensions.height);
            offscreenCtx.strokeStyle = `${color}${Math.floor((1 - distance / maxDistance) * 40).toString(16).padStart(2, '0')}`;
            offscreenCtx.lineWidth = 0.5;
            offscreenCtx.stroke();
          }
        });
      });

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      if (offscreenCanvasRef.current) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      }
    };

    const animate = (currentTime: number) => {
      if (currentTime - lastUpdateTimeRef.current >= 1000 / MAX_FPS) {
        updateParticles();
        drawParticles();
        lastUpdateTimeRef.current = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, dimensions, particles]);

  return (
    <motion.canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
});

AnimatedNetworkBackground.displayName = 'AnimatedNetworkBackground';

export default AnimatedNetworkBackground;
