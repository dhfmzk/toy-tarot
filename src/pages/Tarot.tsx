import { useState, useEffect } from 'react';
import { Copy, ExternalLink, CheckCircle, Search } from 'lucide-react';
import TarotSpread, { type DrawnCard } from '../components/TarotSpread';

type QuestionItem = { text: string; icon: string };

const TAROT_QUESTIONS: QuestionItem[] = [
  { text: "나에게 다가올 새로운 인연이 있을까?", icon: "💘" },
  { text: "마음속에 품고 있는 그 사람은 나를 어떻게 생각할까?", icon: "💭" },
  { text: "현재 썸타는 관계, 앞으로 어떻게 발전할까?", icon: "💞" },
  { text: "지나간 연인과 다시 만날 수 있는 가능성은?", icon: "🥀" },
  { text: "앞으로 한 달 안의 애정운 흐름은 어떨까?", icon: "💖" },
  { text: "현재 진행 중인 프로젝트, 성공적으로 마칠 수 있을까?", icon: "📈" },
  { text: "올해 남은 기간 나의 전반적인 재물운은 어떨까?", icon: "💰" },
  { text: "지금 직장을 옮기는 것이 나에게 득이 될까?", icon: "💼" },
  { text: "조만간 다가올 뜻밖의 금전적 행운이 있을까?", icon: "🍀" },
  { text: "직장 내 인간관계 스트레스, 어떻게 풀어나갈까?", icon: "🤝" },
  { text: "오늘 하루의 전반적인 흐름은 어떨까?", icon: "🌅" },
  { text: "최근 나를 괴롭히는 고민, 본질적 원인은 무엇일까?", icon: "🧘" },
  { text: "이번 주, 내가 가장 조심해야 할 것은 무엇일까?", icon: "⚠️" },
  { text: "나의 잠재력을 깨우기 위해 지금 필요한 변화는?", icon: "🦋" },
  { text: "최근 반복되는 무기력함에서 벗어날 방법은?", icon: "⚡" },
  { text: "조만간 나에게 찾아올 즐거운 기회나 소식이 있을까?", icon: "🎁" }
];

export default function Tarot() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [allowReversed, setAllowReversed] = useState(true);
  const [readingPrompt, setReadingPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState<QuestionItem[]>([]);

  const generateRandomQuestions = () => {
    const shuffled = [...TAROT_QUESTIONS].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 3));
  };

  useEffect(() => {
    generateRandomQuestions();
  }, []);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim().length > 0) {
      setSelectedQuestion(customQuestion.trim());
      setReadingPrompt(null);
    }
  };

  const handleSelectQuestion = (q: string) => {
    setSelectedQuestion(q);
    setReadingPrompt(null);
  };

  const handleReadingComplete = (drawnCards: DrawnCard[]) => {
    let prompt = `전문 타로 리더로서, 아래에 나온 제 타로 카드 결과를 신중하고 섬세하게 해석해 주세요.\n\n`;
    prompt += `💡 [내 고민/질문]: "${selectedQuestion}"\n\n`;
    prompt += `🔮 [자유롭게 뽑은 총 ${drawnCards.length}장의 카드 결과]:\n`;
    
    drawnCards.forEach((card, idx) => {
      prompt += `- ${idx + 1}번째 카드: [${card.name}] ${allowReversed ? `/ ${card.isReversed ? '역방향(Reversed)' : '정방향(Upright)'}` : ''}\n`;
    });
    
    prompt += `\n각 카드의 상징${allowReversed ? '과 정위치/역위치 고유 의미' : ''}을(를) 반영하여 질문에 맞는 해석을 해주고, 내 상황을 가장 긍정적으로 풀어나갈 수 있는 통찰력 있는 조언을 부탁드립니다. 결과가 다수일 경우 시간의 흐름(과거-현재-미래)이나 인과관계로 연결하여 하나의 스토리텔링으로 부드럽게 해석해 주시면 좋습니다.`;
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
        <h2 className="text-3xl sm:text-4xl font-bold text-brand-100 drop-shadow-md tracking-tight mb-3">타로 스프레드</h2>
        <p className="text-brand-300/70 font-light">질문을 선택하고 카드를 뽑아 운명의 메시지를 들어보세요</p>
      </div>
      
      {!selectedQuestion && (
        <div className="w-full max-w-2xl bg-brand-800/40 p-8 sm:p-10 rounded-3xl shadow-2xl border border-brand-500/20 mb-8 backdrop-blur-sm">
          
          <div className="flex justify-between items-center mb-10 bg-brand-900/50 p-5 sm:px-6 rounded-2xl border border-brand-500/20 shadow-inner h-auto">
            <div>
              <h3 className="text-[15px] font-medium text-brand-300">역방향 카드 포함하기</h3>
              <p className="text-[11px] sm:text-xs text-brand-300/50 font-light mt-1.5">정위치, 역위치의 고유 의미를 모두 허용할지 결정합니다.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input type="checkbox" className="sr-only peer" checked={allowReversed} onChange={() => setAllowReversed(!allowReversed)} />
              <div className="w-11 h-6 bg-brand-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-brand-500/30"></div>
            </label>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[17px] font-medium text-brand-100 tracking-wide">✨ 고민되는 질문 선택하기</h3>
            <button onClick={generateRandomQuestions} className="text-[13px] font-medium text-brand-300 hover:text-white bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full transition hover:bg-brand-500/30">
              새로운 질문 ↺
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-10">
            {randomQuestions.map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleSelectQuestion(item.text)}
                className="group relative flex items-center gap-4 text-left p-4 sm:p-5 rounded-2xl border border-brand-500/30 bg-brand-800/40 hover:bg-brand-700/60 hover:border-brand-300 transition-all text-brand-100 shadow-lg hover:shadow-[0_0_20px_rgba(87,75,219,0.3)]"
              >
                <div className="w-10 h-10 rounded-full bg-brand-900 border border-brand-500/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  <span className="text-lg animate-twinkle">{item.icon}</span>
                </div>
                <span className="font-medium leading-relaxed drop-shadow-sm flex-1">{item.text}</span>
                <span className="text-brand-300/50 group-hover:text-brand-100 transition-colors shrink-0 text-sm font-light hidden sm:block">선택하기 &rarr;</span>
              </button>
            ))}
          </div>

          <div className="w-full border-t border-brand-500/20 mb-10 relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-sm text-brand-300/50 bg-brand-800 px-4 font-light rounded-full border border-brand-500/20">또는</span>
          </div>
          
          <div>
            <h3 className="text-[17px] font-medium text-brand-100 mb-5 tracking-wide">✏️ 직접 고민 입력하기</h3>
            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-500/80" size={18} />
                <input 
                  type="text" 
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="디테일한 상황과 고민을 입력해주세요"
                  className="w-full pl-14 pr-5 py-4 bg-brand-900/60 border border-brand-500/30 rounded-2xl focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-white placeholder-brand-300/40 font-light shadow-inner"
                />
              </div>
              <button 
                type="submit" 
                disabled={!customQuestion.trim()}
                className="px-8 py-4 bg-brand-700 text-white font-bold rounded-2xl hover:bg-brand-500 hover:text-white transition shadow-[0_0_20px_rgba(67,61,139,0.5)] disabled:opacity-30 disabled:cursor-not-allowed border border-brand-500/50 w-full sm:w-auto shrink-0"
              >
                입력하기
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedQuestion && (
        <div className="w-full relative z-10 flex flex-col items-center">
          <div className="text-center mb-6 flex flex-col items-center">
            <p className="text-brand-300/60 font-light text-sm mb-4">현재 집중하고 있는 질문</p>
            <p className="text-lg sm:text-xl font-light text-brand-100 bg-brand-800/40 border border-brand-500/30 inline-block px-8 py-5 rounded-3xl shadow-xl leading-relaxed max-w-3xl backdrop-blur-md">
              "{selectedQuestion}"
            </p>
            <button 
              onClick={() => setSelectedQuestion(null)} 
              className="mt-6 text-sm text-brand-300 hover:text-white underline underline-offset-4 transition-colors font-light"
            >
              질문 다시 고르기
            </button>
          </div>
          
          <div className="w-full mt-2 bg-brand-800/20 rounded-[2.5rem] border border-brand-500/20 shadow-2xl backdrop-blur-md overflow-hidden xl:px-10">
            <TarotSpread allowReversed={allowReversed} onReadingComplete={handleReadingComplete} />
          </div>
          
          {readingPrompt && (
            <div className="w-full max-w-4xl mt-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <div className="bg-brand-800/40 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-brand-500/30 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-700 text-white px-8 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(67,61,139,0.8)] tracking-wide text-sm border border-brand-300/50 flex items-center justify-center min-w-[max-content]">
                  ✨ 완성된 리딩 프롬프트 ✨
                </div>
                
                <h3 className="text-center font-light text-brand-300/80 mt-4 mb-8 text-sm sm:text-base">
                  프롬프트를 복사한 후, 선호하는 AI 비서를 열어 바로 대화를 시작해보세요.
                </h3>
                
                <div className="bg-brand-900/60 p-6 sm:p-8 rounded-3xl text-left border border-brand-500/20 shadow-inner flex-1 shadow-lg">
                  <pre className="whitespace-pre-wrap text-[15px] text-zinc-300 font-sans leading-relaxed tracking-wide font-light">
                    {readingPrompt}
                  </pre>
                </div>
                
                {/* Fixed Grid for buttons to prevent breaking out bounds */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                  <button 
                    onClick={copyToClipboard}
                    className="flex justify-center items-center gap-2 px-6 py-4 bg-brand-700 text-white font-medium rounded-xl shadow-lg hover:bg-brand-500 hover:text-brand-900 transition-all border border-brand-300/30"
                  >
                    {copied ? <CheckCircle size={18} className="text-green-300" /> : <Copy size={18} />}
                    {copied ? '복사 완료!' : '프롬프트 복사'}
                  </button>
                  <a 
                    href="https://chatgpt.com/" 
                    target="_blank" rel="noreferrer"
                    className="flex justify-center items-center gap-2 px-6 py-4 bg-[#1a1a1a] text-white font-medium border border-white/10 rounded-xl shadow-lg hover:bg-[#252525] transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22.28 15.54q-.05-.12-.22-.2l-5.6-2.58a.4.4 0 0 0-.31 0l-1.57.75c-1.32-.46-2.58-1-3.76-1.57l1-1.3a.4.4 0 0 0 0-.31L9.24 4.73q-.08-.17-.2-.22A.35.35 0 0 0 8.8 4.6L6 5.86c-1.28.56-2.45 1.15-3.51 1.76a47.5 47.5 0 0 0-1.74 1q-.12.08-.12.2v6.62c0 .41.07 1.05.21 1.93s.32 1.63.53 2.24t.48 1l.24.4A20.2 20.2 0 0 0 6 22.86a.2.2 0 0 0 .15.08.35.35 0 0 0 .22-.05l6.5-5.32c1.23-.37 2.38-.79 3.46-1.27l1.73 1.18a.33.33 0 0 0 .31 0l3.77-2.31c.42-.26.54-.5.34-.73h-.2m-5.49-14a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5h-1.4m0 4a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4m-4 0a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4m8 0a.5.5 0 0 0-.5.5v1.4a.5.5 0 0 0 .5.5h1.4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-1.4M12.8 1.54a.5.5 0 0 0-.5.5V3a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.2"/></svg>
                    ChatGPT <ExternalLink size={14} className="opacity-70" />
                  </a>
                  <a 
                    href="https://gemini.google.com/" 
                    target="_blank" rel="noreferrer"
                    className="flex justify-center items-center gap-2 px-6 py-4 bg-[#0a2e99] text-white font-medium border border-blue-500/30 rounded-xl shadow-lg hover:bg-[#1e40af] transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>
                    Gemini <ExternalLink size={14} className="opacity-70" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
