import React from 'react';
import { ArrowRight, Lock, Key } from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart, apiKey, setApiKey }) => {
  const isValidKey = apiKey.length > 10; // Simple validation check

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in py-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
          Exit Interview System
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
          Next Step Insight
        </h1>
        <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
          귀하의 새로운 출발을 응원합니다.<br/>
          지난 여정에서의 소중한 경험과 의견은<br/>
          저희가 더 나은 조직으로 성장하는 밑거름이 됩니다.
        </p>
      </div>

      {/* API Key Input Section */}
      <div className="w-full max-w-sm mx-auto space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <Key className="w-4 h-4 text-purple-400" />
          Gemini API Key
        </label>
        <div className="relative group">
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AI Studio에서 발급받은 키를 입력하세요"
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
          />
          <div className="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
        </div>
        <div className="text-xs text-left">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            API Key가 없으신가요? (Get API Key)
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 bg-black/20 px-4 py-2 rounded-lg">
        <Lock className="w-4 h-4" />
        <span>모든 응답은 철저히 익명으로 처리됩니다.</span>
      </div>

      <button
        onClick={onStart}
        disabled={!isValidKey}
        className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          isValidKey 
            ? 'bg-white text-black hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer' 
            : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/5'
        }`}
      >
        설문 시작하기
        <ArrowRight className={`w-5 h-5 transition-transform ${isValidKey ? 'group-hover:translate-x-1' : ''}`} />
      </button>
    </div>
  );
};

export default Welcome;