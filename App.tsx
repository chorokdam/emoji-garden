import React, { useState, useEffect, useCallback } from 'react';
import { fetchRiddles } from './services/geminiService';
import { Riddle, GameState, GameSession } from './types';
import { Button } from './components/Button';

// --- Interfaces for Props ---

interface HeaderProps {
  score: number;
  round: number;
  total: number;
}

interface HowToPlayModalProps {
  onClose: () => void;
}

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

interface GamePlayScreenProps {
  riddle: Riddle;
  onAnswer: (answer: string) => void;
}

interface GameOverScreenProps {
  session: GameSession;
  onRestart: () => void;
}

// --- Components ---

const Header = ({ score, round, total }: HeaderProps) => (
  <div className="flex justify-between items-center w-full mb-8 px-2">
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500">ROUND {round}/{total}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-400">SCORE</span>
      <span className="text-lg font-bold text-emerald-600">{score}</span>
    </div>
  </div>
);

const HowToPlayModal = ({ onClose }: HowToPlayModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
    <div className="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-6">게임 방법</h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">✨</div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">AI의 이모지 퀴즈</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              인공지능이 영화, 드라마, 노래 제목을<br/>이모지로 표현합니다.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-center mb-3">
            <span className="text-3xl inline-block hover:scale-110 transition-transform duration-300">🦁 👑</span>
          </div>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full shadow-sm">라이온 킹</span>
            <span className="px-3 py-1 bg-white border border-slate-200 text-slate-400 text-xs rounded-full">알라딘</span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">🌿</div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">잠깐의 휴식</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              총 5문제가 출제됩니다.<br/>가볍게 즐겨보세요.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onClose} fullWidth>시작하기</Button>
    </div>
  </div>
);

const StartScreen = ({ onStart, isLoading }: StartScreenProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto animate-fade-in">
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
      
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 w-full text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto text-emerald-600">
          🧩
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">이모지 스낵 퀴즈</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          잠시 쉬어가는 시간,<br/>
          AI가 만드는 퀴즈를 풀어보세요.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button onClick={onStart} fullWidth disabled={isLoading}>
            {isLoading ? "준비하는 중..." : "퀴즈 시작하기"}
          </Button>
          <Button onClick={() => setShowHelp(true)} variant="ghost" fullWidth disabled={isLoading}>
            게임 방법 보기
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium tracking-widest text-slate-400 uppercase">Powered by Google Gemini</span>
      </div>
    </div>
  );
};

const GamePlayScreen = ({ riddle, onAnswer }: GamePlayScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Reset state when riddle changes
  useEffect(() => {
    setSelectedOption(null);
    setIsExiting(false);
  }, [riddle.id]);

  const handleSelection = (option: string) => {
    if (selectedOption) return; 
    setSelectedOption(option);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onAnswer(option);
      }, 300); // Wait for exit animation
    }, 800); // Show result for 0.8s
  };

  return (
    <div 
      key={riddle.id}
      className={`w-full max-w-sm mx-auto transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-fade-in'}`}
    >
      
      {/* Question Card */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-6 text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold tracking-wide uppercase mb-6">
          {riddle.category}
        </div>
        <div className="text-5xl mb-8 tracking-widest min-h-[60px] flex items-center justify-center scale-110">
          {riddle.emojis}
        </div>
        <h2 className="text-lg font-semibold text-slate-800">{riddle.question}</h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {riddle.options.map((option, idx) => {
          let btnStyle = "bg-white text-slate-600 hover:bg-slate-50 border-slate-200 hover:border-slate-300";
          let icon = null;

          if (selectedOption) {
            if (option === riddle.correctAnswer) {
              btnStyle = "bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-100 ring-offset-2 shadow-md";
              icon = "✨";
            } else if (option === selectedOption) {
              btnStyle = "bg-slate-100 text-slate-400 border-slate-200";
            } else {
              btnStyle = "opacity-40 bg-white border-slate-100";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelection(option)}
              disabled={!!selectedOption}
              className={`
                relative p-4 rounded-2xl font-medium text-[15px] border transition-all duration-200
                ${btnStyle}
              `}
            >
              {option}
              {icon && <span className="absolute right-4 animate-pulse">{icon}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const GameOverScreen = ({ session, onRestart }: GameOverScreenProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `🧩 이모지 스낵 퀴즈\n제 점수는 ${session.score}점입니다! (총 5문제)\n\n#이모지퀴즈 #초록담`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto animate-fade-in">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 w-full">
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold mb-3">
            GAME OVER
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">{session.score}점</h1>
          <p className="text-slate-400 text-sm">총 5문제 중 {session.history.filter(h => h.isCorrect).length}개 정답</p>
        </div>

        <div className="space-y-3 mb-8">
          {session.history.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100/50">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-xl flex-shrink-0 w-8 text-center">{item.riddle.emojis}</span>
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-medium truncate ${item.isCorrect ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                    {item.riddle.correctAnswer}
                  </span>
                </div>
              </div>
              <div>
                 {item.isCorrect ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs text-emerald-600">O</div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-xs text-rose-500">X</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onRestart} fullWidth>다시 시작하기</Button>
          <Button onClick={handleShare} variant="secondary" fullWidth>
            {copied ? "복사되었습니다! ✨" : "점수 공유하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [session, setSession] = useState<GameSession>({
    score: 0,
    round: 1,
    history: []
  });

  const startGame = useCallback(async () => {
    setGameState(GameState.LOADING);
    try {
      // Confirm 5 questions
      const newRiddles = await fetchRiddles(5);
      setRiddles(newRiddles);
      setCurrentRiddleIndex(0);
      setSession({ score: 0, round: 1, history: [] });
      setGameState(GameState.PLAYING);
    } catch (e) {
      setGameState(GameState.ERROR);
    }
  }, []);

  const handleAnswer = (answer: string) => {
    const currentRiddle = riddles[currentRiddleIndex];
    if (!currentRiddle) return;

    const isCorrect = answer === currentRiddle.correctAnswer;
    const points = isCorrect ? 100 : 0;
    
    setSession(prev => ({
      ...prev,
      score: prev.score + points,
      history: [...prev.history, {
        riddle: currentRiddle,
        userAnswer: answer,
        isCorrect
      }]
    }));

    if (currentRiddleIndex + 1 < riddles.length) {
      setCurrentRiddleIndex(prev => prev + 1);
      setSession(prev => ({ ...prev, round: prev.round + 1 }));
    } else {
      setGameState(GameState.GAME_OVER);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        {gameState === GameState.IDLE && (
          <StartScreen onStart={startGame} isLoading={false} />
        )}
        
        {gameState === GameState.LOADING && (
          <StartScreen onStart={() => {}} isLoading={true} />
        )}

        {gameState === GameState.PLAYING && riddles.length > 0 && (
          <div className="animate-fade-in">
            <Header score={session.score} round={session.round} total={riddles.length} />
            <GamePlayScreen 
              riddle={riddles[currentRiddleIndex]} 
              onAnswer={handleAnswer} 
            />
          </div>
        )}

        {gameState === GameState.GAME_OVER && (
          <GameOverScreen session={session} onRestart={startGame} />
        )}

        {gameState === GameState.ERROR && (
           <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-[32px] shadow-sm">
             <h2 className="text-lg font-bold text-slate-800 mb-2">문제가 발생했어요</h2>
             <p className="text-slate-500 text-sm mb-6">일시적인 오류입니다. 다시 시도해주세요.</p>
             <Button onClick={startGame}>다시 시도</Button>
           </div>
        )}
      </div>
    </div>
  );
}
