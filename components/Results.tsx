import React, { useEffect, useState } from 'react';
import { SurveyData, AnalysisResult } from '../types';
import { analyzeExitSurvey } from '../services/geminiService';
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb, TrendingUp, RefreshCw, Search } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface ResultsProps {
  data: SurveyData;
  onRestart: () => void;
  apiKey: string;
}

const Results: React.FC<ResultsProps> = ({ data, onRestart, apiKey }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      // Simulate slight network delay for better UX flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      const analysis = await analyzeExitSurvey(data, apiKey);
      setResult(analysis);
      setLoading(false);
    };

    fetchAnalysis();
  }, [data, apiKey]);

  const satData = Object.entries(data.satisfaction).map(([key, value]) => ({
    name: key,
    value: value,
  }));

  // NPS Calculation helpers
  const npsRadius = 56;
  const npsCircumference = 2 * Math.PI * npsRadius;
  const npsOffset = npsCircumference - (data.nps / 10) * npsCircumference;
  const npsColor = data.nps >= 9 ? "#4ade80" : data.nps >= 7 ? "#facc15" : "#f87171";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-pulse">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="w-8 h-8 text-purple-400" />
            </div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">Gemini AI가 데이터를 분석 중입니다</h3>
            <p className="text-gray-400 text-sm">퇴사 원인과 조직 문화 데이터를 심층 진단하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md py-4 z-20 border-b border-white/5 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
            Insight Report
          </h2>
          <p className="text-gray-400 text-sm mt-1 ml-8">AI Based Exit Interview Analysis</p>
        </div>
        <div className="flex flex-col items-start sm:items-end">
             <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 text-xs font-mono mb-1">
                Gemini 3.0 Pro
            </div>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Card 1: Summary & Root Cause (Visual Emphasis) */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-10 -mt-10 blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                    <AlertTriangle className="text-yellow-500 w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">Executive Summary</h3>
                    <p className="text-purple-200/90 text-sm font-medium leading-relaxed break-keep">
                        {result?.summary}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div className="bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Root Cause (근본 원인)
                     </h4>
                     <p className="text-gray-200 text-sm font-medium leading-relaxed flex-1">
                        {result?.rootCause}
                     </p>
                </div>
                <div className="bg-black/40 p-5 rounded-xl border border-white/5 flex flex-col h-full hover:border-white/10 transition-colors">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Sentiment (감정)
                     </h4>
                     <div className="flex items-center justify-center flex-1 py-2">
                        <span className="text-xl text-gray-300 font-light italic text-center leading-normal">
                            "{result?.sentiment}"
                        </span>
                     </div>
                </div>
            </div>
        </div>

        {/* Card 2: Detailed Diagnosis */}
        <div className="col-span-1 lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search className="text-blue-400 w-5 h-5" />
                심층 진단 리포트 (Detailed Diagnosis)
            </h3>
            <div className="bg-black/20 rounded-xl p-6 border-l-2 border-blue-500/50">
                <p className="text-gray-300 leading-7 text-sm whitespace-pre-wrap font-light">
                    {result?.detailedDiagnosis}
                </p>
            </div>
        </div>

        {/* Card 3: Quantitative Data */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[320px] shadow-md">
             <h3 className="text-sm font-semibold text-gray-400 mb-6 w-full text-left flex items-center gap-2">
                <TrendingUp size={16}/> 항목별 만족도 분석
             </h3>
             <div className="w-full flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={satData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis 
                            dataKey="name" 
                            tick={{fontSize: 11, fill: '#6b7280'}} 
                            interval={0} 
                            tickFormatter={(val) => val.split(' ')[0]} // Show only first word for space
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis hide domain={[0, 6]} /> {/* Slightly higher domain for label space if needed */}
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        />
                        <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
                            {satData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value < 3 ? '#ef4444' : entry.value >= 4 ? '#8b5cf6' : '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-6 grid grid-cols-2 gap-2">
                {satData.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                        <span className="text-gray-400 truncate mr-2">{d.name}</span>
                        <span className={`font-bold ${d.value < 3 ? 'text-red-400' : 'text-white'}`}>{d.value}</span>
                    </div>
                ))}
             </div>
        </div>

         {/* Card 4: NPS Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative min-h-[320px] shadow-md">
             <h3 className="text-sm font-semibold text-gray-400 mb-8 w-full text-left">NPS Score (순 추천 지수)</h3>
             <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 128 128">
                    {/* Background Circle */}
                    <circle 
                        cx="64" cy="64" r={npsRadius} 
                        stroke="#1f2937" 
                        strokeWidth="8" 
                        fill="none" 
                        className="opacity-50"
                    />
                    {/* Progress Circle */}
                    <circle 
                        cx="64" cy="64" r={npsRadius} 
                        stroke={npsColor}
                        strokeWidth="8" 
                        fill="none" 
                        strokeLinecap="round"
                        strokeDasharray={npsCircumference} 
                        strokeDashoffset={npsOffset}
                        className="transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold text-white tracking-tighter drop-shadow-lg">{data.nps}</span>
                    <span className="text-xs text-gray-500 mt-2 font-medium tracking-wide">OUT OF 10</span>
                </div>
             </div>
             <div className="mt-8 text-center">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${
                    data.nps >= 9 
                    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]' 
                    : data.nps >= 7 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(250,204,21,0.2)]' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.2)]'
                }`}>
                    {data.nps >= 9 ? "Promoter (적극 추천)" : data.nps >= 7 ? "Passive (중립)" : "Detractor (비판)"}
                </span>
             </div>
        </div>

        {/* Card 5: Action Strategies */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border border-white/10 rounded-2xl p-6 shadow-md">
             <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Lightbulb className="text-amber-400 w-5 h-5" />
                Strategic Actions (실행 전략)
            </h3>
            <div className="space-y-4">
                {result?.strategies.map((strategy, idx) => (
                    <div key={idx} className="flex gap-4 bg-black/40 p-5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-black/60 transition-all group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-bold border border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                            {idx + 1}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-200 text-sm leading-relaxed font-medium">{strategy}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>

      <div className="flex justify-center pb-8 pt-4">
        <button
            onClick={onRestart}
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black hover:bg-gray-100 transition-all text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105"
        >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500"/>
            새로운 설문 시작하기
        </button>
      </div>
    </div>
  );
};

export default Results;