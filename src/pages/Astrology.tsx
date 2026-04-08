import { useState, useEffect } from 'react';
import { Copy, ExternalLink, CheckCircle, MapPin } from 'lucide-react';

const ZODIAC_SIGNS = [
  "양자리(Aries)", "황소자리(Taurus)", "쌍둥이자리(Gemini)", "게자리(Cancer)", 
  "사자자리(Leo)", "처녀자리(Virgo)", "천칭자리(Libra)", "전갈자리(Scorpio)", 
  "사수자리(Sagittarius)", "염소자리(Capricorn)", "물병자리(Aquarius)", "물고기자리(Pisces)"
];
const ZODIAC_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const MAJOR_CITIES = [
  "서울 (Seoul, Korea)", "부산 (Busan, Korea)", "인천 (Incheon, Korea)", "대구 (Daegu, Korea)",
  "대전 (Daejeon, Korea)", "광주 (Gwangju, Korea)", "수원 (Suwon, Korea)", "울산 (Ulsan, Korea)",
  "고양 (Goyang, Korea)", "용인 (Yongin, Korea)", "창원 (Changwon, Korea)", "성남 (Seongnam, Korea)",
  "청주 (Cheongju, Korea)", "부천 (Bucheon, Korea)", "전주 (Jeonju, Korea)", "천안 (Cheonan, Korea)",
  "제주 (Jeju, Korea)",
  "도쿄 (Tokyo, Japan)", "오사카 (Osaka, Japan)", "베이징 (Beijing, China)", "상하이 (Shanghai, China)",
  "뉴욕 (New York, USA)", "로스앤젤레스 (Los Angeles, USA)", "샌프란시스코 (San Francisco, USA)",
  "런던 (London, UK)", "파리 (Paris, France)", "시드니 (Sydney, Australia)", "토론토 (Toronto, Canada)"
];

const getSunSign = (month: number, day: number) => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 0;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 1;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 2;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 3;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 4;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 5;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 6;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 7;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 8;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 9;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 10;
  return 11;
};

// SVG Chart Component - Redesigned to be much more complex and detailed
const NatalChartSVG = ({ sunIdx, moonIdx, risingIdx }: { sunIdx: number, moonIdx: number, risingIdx: number }) => {
  const getAngle = (idx: number) => (idx * 30) - 90;
  const getPos = (angleDeg: number, radius: number) => {
    const rad = angleDeg * (Math.PI / 180);
    return { x: 200 + Math.cos(rad) * radius, y: 200 + Math.sin(rad) * radius };
  };

  const sunPos = getPos(getAngle(sunIdx), 130);
  const moonPos = getPos(getAngle(moonIdx), 80);
  const risingPos = risingIdx >= 0 ? getPos(getAngle(risingIdx), 160) : null;
  
  // Random other planets for decoration to fill out the natal chart
  const p1 = getPos(getAngle((sunIdx + 4)%12), 110);
  const p2 = getPos(getAngle((sunIdx + 7)%12), 100);
  const p3 = getPos(getAngle((moonIdx + 5)%12), 140);
  const p4 = getPos(getAngle((risingIdx + 2)%12), 90);

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_20px_rgba(146,144,195,0.4)] filter">
      <defs>
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(146,144,195,0.15)" />
        </radialGradient>
      </defs>
      
      {/* Background Outer Ring */}
      <circle cx="200" cy="200" r="180" fill="url(#ringGlow)" stroke="rgba(146,144,195,0.2)" strokeWidth="1" />
      <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(146,144,195,0.1)" strokeWidth="1" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(146,144,195,0.15)" strokeWidth="1" />
      <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(83,92,145,0.3)" strokeWidth="1" />
      <circle cx="200" cy="200" r="40" fill="none" stroke="rgba(83,92,145,0.1)" strokeWidth="1" />

      {/* Zodiac Glyph Ring */}
      {Array.from({length: 12}).map((_, i) => {
        const p = getPos(i * 30 + 15, 185);
        return <text key={`glyph-${i}`} x={p.x} y={p.y + 4} fontSize="14" fill="rgba(146,144,195,0.6)" textAnchor="middle">{ZODIAC_GLYPHS[i]}</text>
      })}

      {/* 12 House Numbers Ring */}
      {Array.from({length: 12}).map((_, i) => {
        const p = getPos(i * 30 + 15, 155);
        return <text key={`house-${i}`} x={p.x} y={p.y + 3} fontSize="10" fill="rgba(146,144,195,0.3)" textAnchor="middle">{i + 1}</text>
      })}

      {/* Spiderweb Geometric Aspect Lines (Trines, Squares, Sextiles) */}
      <polygon points={`${getPos(0, 140).x},${getPos(0, 140).y} ${getPos(120, 140).x},${getPos(120, 140).y} ${getPos(240, 140).x},${getPos(240, 140).y}`} fill="rgba(146,144,195,0.02)" stroke="rgba(146,144,195,0.2)" strokeWidth="1" />
      <polygon points={`${getPos(90, 140).x},${getPos(90, 140).y} ${getPos(210, 140).x},${getPos(210, 140).y} ${getPos(330, 140).x},${getPos(330, 140).y}`} fill="rgba(83,92,145,0.02)" stroke="rgba(83,92,145,0.3)" strokeWidth="1" />
      <polygon points={`${getPos(45, 140).x},${getPos(45, 140).y} ${getPos(135, 140).x},${getPos(135, 140).y} ${getPos(225, 140).x},${getPos(225, 140).y} ${getPos(315, 140).x},${getPos(315, 140).y}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      
      {/* Custom Planet Aspect Lines */}
      <line x1={sunPos.x} y1={sunPos.y} x2={moonPos.x} y2={moonPos.y} stroke="rgba(146,144,195,0.4)" strokeWidth="1.5" />
      {risingPos && <line x1={moonPos.x} y1={moonPos.y} x2={risingPos.x} y2={risingPos.y} stroke="rgba(146,144,195,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />}
      <line x1={sunPos.x} y1={sunPos.y} x2={p1.x} y2={p1.y} stroke="rgba(255,50,50,0.3)" strokeWidth="1" />
      <line x1={p2.x} y1={p2.y} x2={moonPos.x} y2={moonPos.y} stroke="rgba(50,255,100,0.3)" strokeWidth="1" />
      <line x1={p3.x} y1={p3.y} x2={p1.x} y2={p1.y} stroke="rgba(100,200,255,0.3)" strokeWidth="1" />

      {/* Decorative Planets */}
      <circle cx={p1.x} cy={p1.y} r="10" fill="#1B1A55" stroke="#9290C3" strokeWidth="1" />
      <text x={p1.x} y={p1.y + 3} fontSize="10" fill="#9290C3" textAnchor="middle">☿</text>
      
      <circle cx={p2.x} cy={p2.y} r="10" fill="#1B1A55" stroke="#9290C3" strokeWidth="1" />
      <text x={p2.x} y={p2.y + 3} fontSize="10" fill="#9290C3" textAnchor="middle">♀</text>
      
      <circle cx={p3.x} cy={p3.y} r="10" fill="#1B1A55" stroke="#9290C3" strokeWidth="1" />
      <text x={p3.x} y={p3.y + 3} fontSize="10" fill="#9290C3" textAnchor="middle">♂</text>
      
      <circle cx={p4.x} cy={p4.y} r="10" fill="#1B1A55" stroke="#9290C3" strokeWidth="1" />
      <text x={p4.x} y={p4.y + 4} fontSize="10" fill="#9290C3" textAnchor="middle">♃</text>

      {/* Sun */}
      <circle cx={sunPos.x} cy={sunPos.y} r="18" fill="#070F2B" stroke="#fcd34d" strokeWidth="1.5" />
      <text x={sunPos.x} y={sunPos.y + 6} fontSize="18" fill="#fcd34d" textAnchor="middle">☀️</text>

      {/* Moon */}
      <circle cx={moonPos.x} cy={moonPos.y} r="16" fill="#070F2B" stroke="#93c5fd" strokeWidth="1.5" />
      <text x={moonPos.x} y={moonPos.y + 5} fontSize="16" fill="#93c5fd" textAnchor="middle">🌙</text>

      {/* Rising */}
      {risingPos && (
        <>
          <circle cx={risingPos.x} cy={risingPos.y} r="14" fill="#070F2B" stroke="#c084fc" strokeWidth="1.5" />
          <text x={risingPos.x} y={risingPos.y + 4} fontSize="14" fill="#c084fc" textAnchor="middle">✨</text>
        </>
      )}

      {/* 12 Division Lines (Houses/Zodiac cusps) */}
      {Array.from({length: 12}).map((_, i) => {
        const psq1 = getPos(i * 30, 40);
        const psq2 = getPos(i * 30, 180);
        return <line key={`line-${i}`} x1={psq1.x} y1={psq1.y} x2={psq2.x} y2={psq2.y} stroke="rgba(146,144,195,0.2)" strokeDasharray="2 4" strokeWidth="1" />
      })}

      {/* Center dot */}
      <circle cx="200" cy="200" r="4" fill="rgba(146,144,195,0.8)" />
      <circle cx="200" cy="200" r="15" fill="none" stroke="rgba(146,144,195,0.3)" strokeWidth="1" />
    </svg>
  );
};


export default function Astrology() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const [bYear, setBYear] = useState('1990');
  const [bMonth, setBMonth] = useState('1');
  const [bDay, setBDay] = useState('1');

  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [unknownTime, setUnknownTime] = useState(false);
  
  const [isCalculated, setIsCalculated] = useState(false);
  const [chartData, setChartData] = useState<{ sun: string, moon: string, rising: string, sunIdx: number, moonIdx: number, risingIdx: number } | null>(null);
  const [readingPrompt, setReadingPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedY = localStorage.getItem('lumina_bYear');
    const savedM = localStorage.getItem('lumina_bMonth');
    const savedD = localStorage.getItem('lumina_bDay');
    const savedTime = localStorage.getItem('lumina_birthTime');
    const savedPlace = localStorage.getItem('lumina_birthPlace');
    
    if (savedY) setBYear(savedY);
    if (savedM) setBMonth(savedM);
    if (savedD) setBDay(savedD);
    if (savedTime) setBirthTime(savedTime);
    if (savedPlace) setBirthPlace(savedPlace);
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthPlace) return;

    localStorage.setItem('lumina_bYear', bYear);
    localStorage.setItem('lumina_bMonth', bMonth);
    localStorage.setItem('lumina_bDay', bDay);
    localStorage.setItem('lumina_birthPlace', birthPlace);
    if (!unknownTime && birthTime) localStorage.setItem('lumina_birthTime', birthTime);

    const m = parseInt(bMonth);
    const d = parseInt(bDay);
    
    const sunSignIdx = getSunSign(m, d);
    const hash = parseInt(bYear) + m + d + (birthTime ? parseInt(birthTime.replace(':', '')) : 0);
    const moonSignIdx = (hash + 5) % 12;
    const risingSignIdx = unknownTime ? -1 : (hash + 9) % 12;

    setChartData({
      sun: ZODIAC_SIGNS[sunSignIdx],
      moon: ZODIAC_SIGNS[moonSignIdx],
      rising: unknownTime ? "시간 모름 (미정확)" : ZODIAC_SIGNS[risingSignIdx],
      sunIdx: sunSignIdx,
      moonIdx: moonSignIdx,
      risingIdx: risingSignIdx
    });

    setIsCalculated(true);

    const timeStr = unknownTime ? "태어난 시간은 모름" : `${birthTime}`;
    let prompt = `전문 점성술 리더로서 나의 서양 점성술(네이탈 차트) 리딩을 성심껏 도와주세요.\n\n`;
    prompt += `📍 [나의 출생 데이터]\n- 생년월일: ${bYear}년 ${bMonth}월 ${bDay}일\n- 태어난 시간: ${timeStr}\n- 태어난 장소: ${birthPlace}\n\n`;
    prompt += `이 출생 데이터를 바탕으로 나의 네이탈 차트를 구성하여 핵심 별자리(빅 3: 태양, 달, 상승궁)의 의미와 특징을 쉽게 정리해주고, \n`;
    prompt += `나의 잠재력, 연애/인간관계 스타일, 그리고 삶의 전반적인 운세 흐름(올해 가장 중요하게 생각해야 할 것)에 대해 조언해줘. \n`;
    prompt += `친절하고 긍정적인 방향으로 멘토처럼 조언해주면 감사하겠습니다.`;
    
    setReadingPrompt(prompt);
  };

  const copyToClipboard = () => {
    if (readingPrompt) {
      navigator.clipboard.writeText(readingPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center pb-24">
      <div className="text-center mb-10 mt-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-100 drop-shadow-md tracking-tight mb-3">네이탈 차트 분석</h2>
        <p className="text-brand-300/80 font-light max-w-xl mx-auto">
          정확한 생년월일과 지역을 기입해 출생 점성학 데이터를 확인하고 프롬프트를 발급받으세요.
        </p>
      </div>
      
      {!isCalculated ? (
        <form onSubmit={handleCalculate} className="w-full max-w-md bg-brand-800/40 p-8 sm:p-10 rounded-3xl shadow-2xl border border-brand-500/20 flex flex-col gap-8 backdrop-blur-sm">
          <div>
            <label className="block text-sm font-medium text-brand-300/80 mb-3 uppercase tracking-wider">🗓️ 생년월일 (Date of Birth)</label>
            <div className="flex gap-2">
              <select 
                value={bYear} onChange={(e) => setBYear(e.target.value)}
                className="flex-[2] px-3 py-3 bg-brand-900 border border-brand-500/30 rounded-xl focus:ring-1 focus:ring-brand-300 outline-none transition text-brand-100 font-light text-center appearance-none cursor-pointer"
              >
                {years.map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
              <select 
                value={bMonth} onChange={(e) => setBMonth(e.target.value)}
                className="flex-1 px-3 py-3 bg-brand-900 border border-brand-500/30 rounded-xl focus:ring-1 focus:ring-brand-300 outline-none transition text-brand-100 font-light text-center appearance-none cursor-pointer"
              >
                {months.map(m => <option key={m} value={m}>{m}월</option>)}
              </select>
              <select 
                value={bDay} onChange={(e) => setBDay(e.target.value)}
                className="flex-1 px-3 py-3 bg-brand-900 border border-brand-500/30 rounded-xl focus:ring-1 focus:ring-brand-300 outline-none transition text-brand-100 font-light text-center appearance-none cursor-pointer"
              >
                {days.map(d => <option key={d} value={d}>{d}일</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-brand-300/80 uppercase tracking-wider">⏱️ 태어난 시간 (Time of Birth)</label>
              <label className="flex items-center gap-2 text-[13px] text-brand-300/60 cursor-pointer select-none border border-brand-500/20 bg-brand-900 px-3 py-1 rounded-full hover:bg-brand-500/20 transition">
                <input 
                  type="checkbox" 
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="rounded border-brand-500/50 bg-transparent text-brand-500 focus:ring-brand-500"
                />
                모름
              </label>
            </div>
            <input 
              type="time" 
              disabled={unknownTime}
              required={!unknownTime}
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-4 py-3 bg-brand-900 border border-brand-500/30 rounded-xl focus:ring-1 focus:ring-brand-300 outline-none transition text-brand-100 font-light disabled:opacity-30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-300/80 mb-3 uppercase tracking-wider">📍 태어난 장소 (Place of Birth)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500/80" size={18} />
              <input 
                type="text" 
                list="cities"
                required
                placeholder="도시를 검색하거나 직접 입력 (예: Seoul)"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-brand-900 border border-brand-500/30 rounded-xl focus:ring-1 focus:ring-brand-300 outline-none transition text-brand-100 placeholder-brand-300/30 font-light"
              />
              <datalist id="cities">
                {MAJOR_CITIES.map(city => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>

          <button 
            type="submit"
            className="mt-6 w-full py-4 bg-brand-500 text-white font-medium rounded-2xl shadow-[0_0_20px_rgba(83,92,145,0.3)] hover:bg-brand-300 hover:text-brand-900 transition border border-brand-300/30"
          >
            차트 정보 요약 & 프롬프트 발급
          </button>
        </form>
      ) : (
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* 차트 시각화 및 요약 구역 */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div className="bg-brand-800/30 p-6 rounded-[2rem] border border-brand-500/20 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-6 px-2">
                <h3 className="text-[15px] font-medium text-brand-100 tracking-wide">
                  나의 네이탈 차트
                </h3>
                <button 
                  onClick={() => setIsCalculated(false)}
                  className="text-xs text-brand-300 hover:text-white underline underline-offset-4 transition"
                >
                  정보 수정
                </button>
              </div>

              {/* 디테일해진 시뮬레이션 원형 차트 렌더링 */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 mb-8 relative drop-shadow-2xl">
                {chartData && (
                  <NatalChartSVG sunIdx={chartData.sunIdx} moonIdx={chartData.moonIdx} risingIdx={chartData.risingIdx} />
                )}
              </div>
              
              <div className="w-full grid grid-cols-1 gap-3">
                <div className="bg-brand-900/50 p-4 rounded-2xl border border-brand-500/20 flex items-center shadow-inner gap-4">
                  <span className="text-3xl drop-shadow bg-brand-500/20 p-2 rounded-xl border border-brand-500/30">☀️</span>
                  <div className="text-left flex-1">
                    <p className="text-[11px] font-medium text-brand-300/80 mb-0.5 tracking-wider uppercase">태양 (Sun)</p>
                    <p className="font-medium text-brand-100 text-sm">{chartData?.sun}</p>
                    <p className="text-[10px] text-brand-300/50 mt-1">자아와 정체성, 겉으로 드러나는 성향</p>
                  </div>
                </div>
                <div className="bg-brand-900/50 p-4 rounded-2xl border border-brand-500/20 flex items-center shadow-inner gap-4">
                  <span className="text-3xl drop-shadow bg-brand-500/20 p-2 rounded-xl border border-brand-500/30">🌙</span>
                  <div className="text-left flex-1">
                    <p className="text-[11px] font-medium text-brand-300/80 mb-0.5 tracking-wider uppercase">달 (Moon)</p>
                    <p className="font-medium text-brand-100 text-sm">{chartData?.moon}</p>
                    <p className="text-[10px] text-brand-300/50 mt-1">무의식과 본능, 내면의 안식처</p>
                  </div>
                </div>
                <div className="bg-brand-900/50 p-4 rounded-2xl border border-brand-500/20 flex items-center shadow-inner gap-4">
                  <span className="text-3xl drop-shadow bg-brand-500/20 p-2 rounded-xl border border-brand-500/30">✨</span>
                  <div className="text-left flex-1">
                    <p className="text-[11px] font-medium text-brand-300/80 mb-0.5 tracking-wider uppercase">상승궁 (Rising)</p>
                    <p className="font-medium text-brand-100 text-sm">{chartData?.rising}</p>
                    <p className="text-[10px] text-brand-300/50 mt-1">사회적 페르소나, 첫인상과 신체적 특징</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 프롬프트 구역 */}
          {readingPrompt && (
            <div className="w-full lg:w-[60%] bg-brand-900/95 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_15px_50px_rgba(13,11,33,0.8)] border border-brand-500/40 relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-8 py-2 rounded-full shadow-[0_0_15px_rgba(87,75,219,0.6)] tracking-wide text-[13px] border border-brand-300/50 min-w-[max-content] flex items-center gap-2">
                <span className="animate-twinkle">✨</span> 출생 데이터 추출 완료 <span className="animate-twinkle delay-150">✨</span>
              </div>
              
              <h3 className="text-center font-light text-brand-300/70 mt-4 mb-8 text-sm">
                나만의 출생 정보가 포함된 아래 프롬프트를 복사하여 AI 비서에게 질문해보세요.
              </h3>
              
              <div className="bg-brand-900/80 p-6 sm:p-8 rounded-3xl text-left border border-brand-500/20 shadow-inner flex-1 shadow-lg">
                <pre className="whitespace-pre-wrap text-[15px] text-zinc-300 font-sans leading-relaxed font-light">
                  {readingPrompt}
                </pre>
              </div>
              
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                <button 
                  onClick={copyToClipboard}
                  className="flex justify-center items-center gap-2 px-6 py-4 bg-brand-700 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(67,61,139,0.3)] hover:bg-brand-500 hover:text-brand-900 transition-all border border-brand-300/30"
                >
                  {copied ? <CheckCircle size={18} className="text-green-300" /> : <Copy size={18} />}
                  {copied ? '복사 완료!' : '프롬프트 복사'}
                </button>
                <a 
                  href="https://chatgpt.com/" 
                  target="_blank" rel="noreferrer"
                  className="flex justify-center items-center gap-2 px-6 py-4 bg-[#1a1a1a] text-white font-medium border border-white/10 rounded-xl shadow-xl hover:bg-[#252525] transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22.28 15.54q-.05-.12-.22-.2l-5.6-2.58a.4.4 0 0 0-.31 0l-1.57.75c-1.32-.46-2.58-1-3.76-1.57l1-1.3a.4.4 0 0 0 0-.31L9.24 4.73q-.08-.17-.2-.22A.35.35 0 0 0 8.8 4.6L6 5.86c-1.28.56-2.45 1.15-3.51 1.76a47.5 47.5 0 0 0-1.74 1q-.12.08-.12.2v6.62c0 .41.07 1.05.21 1.93s.32 1.63.53 2.24t.48 1l.24.4A20.2 20.2 0 0 0 6 22.86a.2.2 0 0 0 .15.08.35.35 0 0 0 .22-.05l6.5-5.32c1.23-.37 2.38-.79 3.46-1.27l1.73 1.18a.33.33 0 0 0 .31 0l3.77-2.31c.42-.26.54-.5.34-.73h-.2m-5.49-14a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5h-1.4m0 4a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4m-4 0a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4m8 0a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4M12.8 1.54a.5.5 0 0 0-.5.5V3a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.2"/></svg>
                  ChatGPT <ExternalLink size={14} className="opacity-70" />
                </a>
                <a 
                  href="https://gemini.google.com/" 
                  target="_blank" rel="noreferrer"
                  className="flex justify-center items-center gap-2 px-6 py-4 bg-[#0a2e99] text-white font-medium border border-blue-500/30 rounded-xl shadow-xl hover:bg-[#1e40af] transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>
                  Gemini <ExternalLink size={14} className="opacity-70" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
