
import { useEffect, useState } from 'react';

interface Raindrop {
  id: number;
  left: number;
  duration: number;
  delay: number;
}

const RainBackground = () => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  useEffect(() => {
    const generateRaindrops = () => {
      const drops: Raindrop[] = [];
      for (let i = 0; i < 100; i++) {
        drops.push({
          id: i,
          left: Math.random() * 100,
          duration: Math.random() * 2 + 1, // 1-3 seconds
          delay: Math.random() * 5, // 0-5 second delay
        });
      }
      setRaindrops(drops);
    };

    generateRaindrops();
  }, []);

  return (
    <div className="rain-container">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: `${drop.left}%`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default RainBackground;
