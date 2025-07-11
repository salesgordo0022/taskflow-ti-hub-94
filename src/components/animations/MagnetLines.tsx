import React, { useRef, useEffect, useState } from 'react';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  style?: React.CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  lineColor = 'tomato',
  lineWidth = '0.8vmin',
  lineHeight = '5vmin',
  baseAngle = 0,
  style = {},
}) => {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 }); // Normalizado (0-1)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const lines = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cx = (c + 0.5) / columns;
      const cy = (r + 0.5) / rows;
      // ângulo magnético para o mouse
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const highlight = dist < 0.15 ? 1 : 0;
      lines.push(
        <div
          key={`line-${r}-${c}`}
          style={{
            position: 'absolute',
            left: `calc(${cx * 100}% - ${lineWidth}/2)` ,
            top: `calc(${cy * 100}% - ${lineHeight}/2)` ,
            width: lineWidth,
            height: lineHeight,
            background: highlight ? 'gold' : lineColor,
            borderRadius: '1vmin',
            transform: `rotate(${baseAngle + angle}deg)`,
            opacity: highlight ? 1 : 0.7,
            boxShadow: highlight ? '0 0 8px 2px gold' : undefined,
            pointerEvents: 'none',
            transition: 'background 0.2s, opacity 0.2s, box-shadow 0.2s',
          }}
        />
      );
    }
  }
  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {lines}
    </div>
  );
};

export default MagnetLines; 