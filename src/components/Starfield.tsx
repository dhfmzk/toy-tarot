import { useMemo, useEffect, useState } from 'react';

export default function Starfield() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stars = useMemo(() => {
    // Generate 60 static star positions and animation delays reliably
    return Array.from({ length: 60 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 3}s`,
      size: `${Math.random() * 2 + 1}px`,
      glow: Math.random() > 0.85 ? 'bg-accent shadow-[0_0_8px_rgba(255,229,0,0.8)]' : 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]'
    }));
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star, i) => (
        <div 
          key={i} 
          className={`absolute rounded-full animate-slow-twinkle ${star.glow}`}
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
    </div>
  );
}
