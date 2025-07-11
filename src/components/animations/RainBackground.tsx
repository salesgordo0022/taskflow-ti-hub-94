
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  text: string;
}

const RainBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      speed: 0.5 + Math.random() * 1.5,
      size: 12 + Math.random() * 8,
      opacity: 0.1 + Math.random() * 0.3,
      color: ['#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
      text: ['01', '10', 'FF', 'AA', '55', '33', 'CC', '99', '66', '00'][Math.floor(Math.random() * 10)]
    });

    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(particle => ({
          ...particle,
          y: particle.y + particle.speed,
          opacity: particle.opacity * 0.995
        })).filter(particle => particle.y < window.innerHeight && particle.opacity > 0.01);

        // Add new particles
        if (updated.length < 50) {
          updated.push(createParticle());
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rain-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute font-mono text-xs select-none pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            fontSize: particle.size,
            opacity: particle.opacity,
            color: particle.color,
            textShadow: `0 0 ${particle.size}px ${particle.color}`,
            transform: `rotate(${Math.sin(particle.y * 0.01) * 5}deg)`
          }}
        >
          {particle.text}
        </div>
      ))}
      
      {/* Scan line effect */}
      <div className="scan-line" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default RainBackground;
