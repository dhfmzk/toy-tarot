import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL_CARDS = 78;

const TAROT_NAMES = [
  "바보(The Fool)", "마법사(The Magician)", "여사제(High Priestess)", "여황제(The Empress)",
  "황제(The Emperor)", "교황(The Hierophant)", "연인(The Lovers)", "전차(The Chariot)",
  "힘(Strength)", "은둔자(The Hermit)", "운명의 수레바퀴(Wheel of Fortune)", "정의(Justice)",
  "매달린 사람(The Hanged Man)", "죽음(Death)", "절제(Temperance)", "악마(The Devil)",
  "탑(The Tower)", "별(The Star)", "달(The Moon)", "태양(The Sun)", "심판(Judgement)", "세계(The World)"
];

const getCardName = (id: number) => {
  if (id < 22) return TAROT_NAMES[id];
  const suits = ["지팡이(Wands)", "컵(Cups)", "검(Swords)", "펜타클(Pentacles)"];
  const suitIdx = Math.floor((id - 22) / 14);
  const value = (id - 22) % 14 + 1;
  const suitName = suits[suitIdx];
  const valueName = value === 1 ? "에이스" : value === 11 ? "시종" : value === 12 ? "기사" : value === 13 ? "여왕" : value === 14 ? "왕" : `${value}`;
  return `${suitName} ${valueName}`;
};

const generateDeck = (allowReversed: boolean) => Array.from({ length: TOTAL_CARDS }, (_, i) => ({ 
  id: i, 
  name: getCardName(i),
  isReversed: allowReversed ? Math.random() > 0.5 : false
})).sort(() => Math.random() - 0.5);

export interface DrawnCard {
  id: number;
  name: string;
  isReversed: boolean;
}

interface TarotSpreadProps {
  allowReversed: boolean;
  onReadingComplete: (drawnCards: DrawnCard[]) => void;
}

export default function TarotSpread({ allowReversed, onReadingComplete }: TarotSpreadProps) {
  const [deck, setDeck] = useState<DrawnCard[]>([]);
  const [phase, setPhase] = useState<'DRAWING' | 'REVEAL'>('DRAWING');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeck(generateDeck(allowReversed));
    setDrawnCards([]);
    setPhase('DRAWING');
  }, [allowReversed]);

  const handleDrawCard = (card: DrawnCard) => {
    if (phase !== 'DRAWING') return;
    if (drawnCards.length >= 24) return;
    
    if (!drawnCards.find(c => c.id === card.id)) {
      setDrawnCards([...drawnCards, card]);
    }
  };

  const handleFinish = () => {
    if (drawnCards.length === 0) return;
    setPhase('REVEAL');
    setTimeout(() => onReadingComplete(drawnCards), 800);
  };

  const drawRandom = (count: number) => {
    const available = deck.filter(c => !drawnCards.find(dc => dc.id === c.id));
    const newlyDrawn: DrawnCard[] = [];
    for(let i=0; i<count; i++) {
        if(available.length > 0) {
            newlyDrawn.push(available.pop()!);
        }
    }
    setDrawnCards([...drawnCards, ...newlyDrawn]);
  };

  const scrollDeck = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[600px] py-10 sm:py-16 px-4 relative bg-transparent overflow-x-hidden">

      {(phase === 'DRAWING' || phase === 'REVEAL') && (
        <div className="mb-6 text-center z-20 flex flex-col items-center gap-4">
           <h3 className={`text-xl md:text-2xl font-light text-brand-100 tracking-widest drop-shadow ${phase === 'DRAWING' ? 'animate-pulse' : ''}`}>
             {phase === 'DRAWING' ? `당신의 직감으로 카드를 선택하세요` : '운명의 카드가 선택되었습니다'}
           </h3>
           
           {phase === 'DRAWING' && (
             <div className="flex gap-4">
               <button onClick={() => drawRandom(1)} className="text-xs sm:text-sm bg-brand-800/50 hover:bg-brand-500/40 text-brand-300 px-4 py-2 rounded-full border border-brand-500/30 transition shadow-md hover:text-white">자동 1장 뽑기 ✨</button>
               <button onClick={() => drawRandom(3)} className="text-xs sm:text-sm bg-brand-800/50 hover:bg-brand-500/40 text-brand-300 px-4 py-2 rounded-full border border-brand-500/30 transition shadow-md hover:text-white">자동 3장 뽑기 💫</button>
             </div>
           )}
        </div>
      )}

      {/* Deck Spread - Horizontal Natural Overlap using Scroll */}
      {phase === 'DRAWING' && (
        <div className="w-full relative mb-12 flex flex-col items-center max-w-[100vw]">
          
          <div className="flex items-center justify-center w-full max-w-6xl mx-auto px-2 sm:px-6">
            <button 
              onClick={() => scrollDeck(-300)}
              className="hidden md:flex shrink-0 z-50 w-12 h-12 mr-2 bg-brand-900/90 border border-brand-500/50 rounded-full items-center justify-center text-brand-300 hover:text-white hover:bg-brand-700 shadow-xl transition-all backdrop-blur-sm"
              aria-label="왼쪽으로 스크롤"
            >
              <ChevronLeft size={24} />
            </button>

            <div ref={scrollRef} className="flex-1 overflow-x-auto custom-scrollbar pt-8 pb-14 px-4 sm:px-8 max-w-[90vw] md:max-w-[70vw]">
              <div className="flex w-max items-center h-[180px]">
              {deck.map((card, i) => {
                if (drawnCards.find(c => c.id === card.id)) return null;
                
                return (
                  <motion.div
                    key={card.id}
                    layoutId={`card-${card.id}`}
                    onClick={() => handleDrawCard(card)}
                    style={{
                      marginLeft: i === 0 ? '0px' : '-55px', // overlapping negative margin
                      zIndex: i
                    }}
                    whileHover={{ 
                      y: -25, 
                      scale: 1.15,
                      zIndex: 1000, 
                      transition: { duration: 0.2 } 
                    }}
                    className={`relative w-[85px] h-[130px] sm:w-[100px] sm:h-[150px] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-brand-800 border-2 border-brand-500 hover:border-brand-300 cursor-pointer shadow-[4px_0_15px_rgba(23,21,59,0.9)] rounded-xl flex justify-center items-center shrink-0 origin-bottom transform-gpu`}
                  >
                     <span className="text-brand-300/40 text-2xl font-light">✧</span>
                  </motion.div>
                );
              })}
              </div>
            </div>
            
            <button 
              onClick={() => scrollDeck(300)}
              className="hidden md:flex shrink-0 z-50 w-12 h-12 ml-2 bg-brand-900/90 border border-brand-500/50 rounded-full items-center justify-center text-brand-300 hover:text-white hover:bg-brand-700 shadow-xl transition-all backdrop-blur-sm"
              aria-label="오른쪽으로 스크롤"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <p className="text-center text-xs text-brand-300/70 mt-4 font-light bg-brand-900/50 px-4 py-1.5 rounded-full border border-brand-500/30">좌/우 여백의 화살표 버튼을 누르거나 자유롭게 스크롤하여 직감이 이끄는 카드를 뽑아주세요. (최대 24장)</p>
        </div>
      )}

      {/* Selected Cards Slots (Dynamic Grid) */}
      <div className={`grid grid-cols-2 ${drawnCards.length >= 10 ? 'md:grid-cols-5 lg:grid-cols-6' : drawnCards.length >= 7 ? 'sm:grid-cols-4 md:grid-cols-4' : drawnCards.length >= 4 ? 'sm:grid-cols-4 lg:grid-cols-5' : 'sm:grid-cols-3'} gap-4 sm:gap-6 mb-20 z-20 w-full max-w-5xl justify-center justify-items-center transition-all duration-500`}>
        <AnimatePresence>
        {drawnCards.map((card, i) => {
          return (
            <motion.div 
               key={`slot-${card.id}`} 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex flex-col items-center w-full max-w-[140px]"
            >
              <span className="text-[10px] sm:text-xs font-light text-brand-300/60 mb-3 tracking-widest uppercase">Card {i + 1}</span>
              <div className="w-full aspect-[2/3] border border-brand-500/20 rounded-2xl flex items-center justify-center bg-brand-800/30 shadow-inner relative perspective-1000">
                  <motion.div
                    layoutId={`card-${card.id}`}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: phase === 'REVEAL' ? 0 : 180 }}
                    transition={{ duration: 0.9, type: 'spring', damping: 15 }}
                    className="w-full h-full rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform-style-3d relative"
                  >
                    {/* Back of Card */}
                    <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)] w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-brand-800 border-2 border-brand-500/80 rounded-2xl flex items-center justify-center">
                       <span className="text-brand-300/40 text-3xl font-light">✧</span>
                    </div>
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden w-full h-full bg-brand-900 border-2 border-brand-300/80 rounded-2xl flex flex-col items-center justify-center p-2 text-center gap-2">
                       <span className="text-3xl sm:text-4xl filter drop-shadow-lg">{card.isReversed ? '🔽' : '🔼'}</span>
                       <span className="font-semibold text-[11px] sm:text-[13px] leading-tight mt-1 text-brand-100 drop-shadow">{card.name}</span>
                       <span className="text-[9px] sm:text-[10px] text-brand-300/60 font-light">{card.isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}</span>
                    </div>
                  </motion.div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {/* Empty Placeholder explicitly just 1 at the end to hint you can drop more */}
        {phase === 'DRAWING' && drawnCards.length < 24 && (
            <motion.div 
               layout 
               className="flex flex-col items-center w-full max-w-[140px] opacity-70"
            >
              <span className="text-[10px] sm:text-xs font-light text-brand-300/30 mb-3 tracking-widest uppercase">Card {drawnCards.length + 1}</span>
              <div className="w-full aspect-[2/3] border border-dashed border-brand-500/40 rounded-2xl flex items-center justify-center bg-transparent drop-shadow-sm">
                 <span className="text-brand-500/50 font-light text-2xl">+</span>
              </div>
            </motion.div>
        )}
      </div>

       {/* Floating complete button via Portal to escape transform containing blocks */}
       {typeof document !== 'undefined' && createPortal(
         <AnimatePresence>
           {phase === 'DRAWING' && drawnCards.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 30, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 30, x: '-50%' }}
                onClick={handleFinish}
                className="fixed bottom-[40px] md:bottom-[60px] left-1/2 -translate-x-1/2 z-[9999] px-8 py-5 bg-brand-700 animate-float text-white font-bold text-lg rounded-full shadow-[0_10px_40px_rgba(13,11,33,0.9)] hover:bg-brand-500 hover:shadow-[0_15px_50px_rgba(87,75,219,0.5)] transition-all border border-brand-500/50 flex items-center gap-3 drop-shadow-2xl whitespace-nowrap"
              >
                <span className="animate-twinkle">✨</span> {drawnCards.length}장으로 선택 완료 및 리딩받기 <span className="animate-twinkle delay-150">✨</span>
              </motion.button>
           )}
         </AnimatePresence>,
         document.body
       )}

    </div>
  );
}
