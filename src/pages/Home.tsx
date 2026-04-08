import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in zoom-in-95 duration-1000">
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Main Central Mascot */}
        <div className="mb-4 scale-90 sm:scale-100">
          <Mascot size="lg" />
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-brand-100 drop-shadow-lg">
          별의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-white">속삭임</span>을<br className="hidden sm:block" /> AI로 해석하다.
        </h1>
        
        <p className="text-lg sm:text-xl text-brand-300 mb-14 font-light max-w-2xl mx-auto leading-relaxed">
          타로 카드의 신비로운 통찰과 네이탈 차트의 깊이 있는 분석을 통해,<br className="hidden sm:block" />
          완벽하게 구성된 프롬프트를 발급받고 AI 마스터와 대화하세요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link 
            to="/tarot" 
            className="group relative flex flex-col items-center justify-center p-10 bg-brand-800/40 border border-brand-500/30 rounded-[2.5rem] hover:bg-brand-800/60 transition-all duration-300 shadow-2xl overflow-hidden hover:scale-[1.02] hover:border-brand-300/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[50px] group-hover:bg-brand-500/40 transition-all"></div>
            <span className="text-5xl mb-6 relative z-10 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">🔮</span>
            <span className="text-2xl font-bold text-white mb-2 relative z-10">타로 리딩</span>
            <span className="text-brand-300 font-light text-sm relative z-10">내면의 질문을 던져보세요</span>
          </Link>
          
          <Link 
            to="/astrology" 
            className="group relative flex flex-col items-center justify-center p-10 bg-brand-800/40 border border-brand-500/30 rounded-[2.5rem] hover:bg-brand-800/60 transition-all duration-300 shadow-2xl overflow-hidden hover:scale-[1.02] hover:border-brand-300/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[50px] group-hover:bg-brand-500/40 transition-all"></div>
            <span className="text-5xl mb-6 relative z-10 filter drop-shadow-md group-hover:scale-110 transition-transform duration-300">✨</span>
            <span className="text-2xl font-bold text-white mb-2 relative z-10">점성술 네이탈 차트</span>
            <span className="text-brand-300 font-light text-sm relative z-10">태어난 밤하늘을 기록하세요</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
