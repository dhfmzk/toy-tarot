import { useState } from 'react';

const MESSAGES = [
  "별들은 당신의 길을 비추고 있어요. ✨",
  "당신의 솔직한 직감을 믿으세요!",
  "오늘도 우주의 기운이 당신과 함께합니다. 🔮",
  "어떤 결과가 나오든, 당신이 언제나 주인공이에요.",
  "잠시 심호흡을 하고 편안하게 마음을 가져보세요.",
  "조용한 밤하늘처럼 마음을 가라앉혀요. 🌙"
];

interface MascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Mascot({ className = "", size = "md" }: MascotProps) {
  const [messageIdx, setMessageIdx] = useState(0);

  const handleClick = () => {
    setMessageIdx((prev) => (prev + 1) % MESSAGES.length);
  };

  const sizeClasses = {
    sm: "w-[70px] h-[70px]",
    md: "w-[120px] h-[120px]",
    lg: "w-[160px] h-[160px]"
  };

  return (
    <div className={`relative flex flex-col items-center justify-center group ${className}`}>
      {/* Speech Bubble */}
      <div className="bg-brand-800 text-brand-100 text-sm font-medium px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(13,11,33,1)] border border-brand-500/50 mb-3 relative animate-in fade-in cursor-default hover:bg-brand-700 transition-colors">
         {MESSAGES[messageIdx]}
         {/* Triangle tip pointing down */}
         <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-t-8 border-t-brand-500/50 border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
         <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 border-t-[7px] border-t-brand-800 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent group-hover:border-t-brand-700 transition-colors"></div>
      </div>

      {/* Mascot SVG (Lumi) */}
      <div onClick={handleClick} className={`${sizeClasses[size]} animate-float cursor-pointer relative drop-shadow-[0_0_20px_rgba(107,99,228,0.5)] hover:scale-105 hover:drop-shadow-[0_0_30px_rgba(107,99,228,0.8)] transition-all`} aria-label="도우미 캐릭터 루미">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          
          {/* Ambient Sparkles */}
          <path d="M10 50 L12 55 L17 57 L12 59 L10 64 L8 59 L3 57 L8 55 Z" fill="#FFE500" className="animate-twinkle" />
          <path d="M85 30 L87 35 L92 37 L87 39 L85 44 L83 39 L78 37 L83 35 Z" fill="#ABA6FA" className="animate-twinkle" style={{ animationDelay: '1s' }} />

          {/* Body */}
          <path d="M50 35 C20 35 15 65 15 85 C15 97 30 92 50 92 C70 92 85 97 85 85 C85 65 80 35 50 35 Z" fill="#E6E5FA" />
          
          {/* Eyes (With pure CSS blink) */}
          <g className="animate-blink origin-[50%_65px]">
             <path d="M35 60 Q 40 60 40 65 Q 40 70 35 70 Q 30 70 30 65 Q 30 60 35 60 Z" fill="#0D0B21" />
             <path d="M65 60 Q 70 60 70 65 Q 70 70 65 70 Q 60 70 60 65 Q 60 60 65 60 Z" fill="#0D0B21" />
             {/* Catchlights */}
             <circle cx="37" cy="63" r="2.5" fill="white" />
             <circle cx="67" cy="63" r="2.5" fill="white" />
          </g>

          {/* Blushes */}
          <circle cx="25" cy="72" r="7" fill="#FFB6C1" opacity="0.6" />
          <circle cx="75" cy="72" r="7" fill="#FFB6C1" opacity="0.6" />
          
          {/* Smile */}
          <path d="M45 74 Q 50 80 55 74" stroke="#0D0B21" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Magical Hat */}
          <path d="M20 45 L50 5 L80 45 Z" fill="#201D4C" />
          <path d="M8 45 C 50 60 92 45 92 45" stroke="#39337F" strokeWidth="5" strokeLinecap="round" />
          
          {/* Moon on Hat */}
          <path d="M48 18 C 55 18 58 23 51 28 C 59 25 58 15 48 18 Z" fill="#FFE500" />
        </svg>
      </div>
    </div>
  );
}
