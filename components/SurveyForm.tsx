import React, { useState } from 'react';
import { SurveyData, Step } from '../types';
import { DEPARTMENTS, TENURE_RANGES, EXIT_REASONS, SATISFACTION_METRICS } from '../constants';
import { ChevronRight, ChevronLeft, Star, Send } from 'lucide-react';

interface SurveyFormProps {
  data: SurveyData;
  updateData: (data: Partial<SurveyData>) => void;
  onNext: () => void;
  onBack: () => void;
  step: Step;
}

const SurveyForm: React.FC<SurveyFormProps> = ({ data, updateData, onNext, onBack, step }) => {
  const [fade, setFade] = useState(false);

  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      onNext();
      setFade(false);
    }, 300);
  };

  const renderContent = () => {
    switch (step) {
      case Step.BASIC_INFO:
        return (
          <div className="space-y-8 w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">기본 정보를 입력해 주세요</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">소속 부서</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => updateData({ department: dept })}
                    className={`p-4 rounded-xl text-left text-sm transition-all duration-200 border ${
                      data.department === dept
                        ? 'bg-purple-600/20 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-400">근속 기간</label>
              <div className="flex flex-wrap gap-2">
                {TENURE_RANGES.map((range) => (
                  <button
                    key={range}
                    onClick={() => updateData({ tenure: range })}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${
                      data.tenure === range
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-transparent border-gray-600 text-gray-400 hover:border-white hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case Step.PRIMARY_REASON:
        return (
          <div className="space-y-8 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">가장 결정적인 퇴사 사유는 무엇인가요?</h2>
            <p className="text-gray-400 text-sm mb-6">가장 큰 영향을 미친 한 가지 요인을 선택해 주세요.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXIT_REASONS.map((reason) => {
                const Icon = reason.icon;
                return (
                  <button
                    key={reason.id}
                    onClick={() => updateData({ primaryReason: reason.label })}
                    className={`p-6 rounded-2xl flex items-center gap-4 text-left transition-all duration-300 border group ${
                      data.primaryReason === reason.label
                        ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-400 shadow-lg shadow-purple-900/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${data.primaryReason === reason.label ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-lg ${data.primaryReason === reason.label ? 'text-white font-semibold' : 'text-gray-300'}`}>
                      {reason.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case Step.SATISFACTION:
        return (
          <div className="space-y-8 w-full max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">항목별 만족도를 평가해 주세요</h2>
            <div className="space-y-6">
              {SATISFACTION_METRICS.map((metric) => (
                <div key={metric.key} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium text-gray-300">{metric.label}</label>
                    <span className="text-xs text-purple-400 font-mono">
                      {/* @ts-ignore */}
                      {data.satisfaction[metric.key] > 0 ? `${data.satisfaction[metric.key]} / 5` : '-'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        /* @ts-ignore */
                        onClick={() => updateData({ satisfaction: { ...data.satisfaction, [metric.key]: score } })}
                        className={`flex-1 h-12 rounded-lg flex items-center justify-center transition-all duration-200 border ${
                          /* @ts-ignore */
                          data.satisfaction[metric.key] >= score
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-white/5 border-white/5 text-gray-600 hover:bg-white/10'
                        }`}
                      >
                        <Star size={18} fill={
                          /* @ts-ignore */
                          data.satisfaction[metric.key] >= score ? "currentColor" : "none" 
                        } />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case Step.OPEN_ENDED:
        return (
          <div className="space-y-6 w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">마지막으로 솔직한 의견을 들려주세요</h2>
            <p className="text-gray-400 text-sm mb-6">작성해주신 내용은 더 나은 조직을 만드는 데 큰 도움이 됩니다.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">회사에서 가장 좋았던 점은 무엇인가요?</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all min-h-[100px]"
                  placeholder="동료, 업무 환경, 복지 등 자유롭게 작성해 주세요."
                  value={data.openEnded.bestThing}
                  onChange={(e) => updateData({ openEnded: { ...data.openEnded, bestThing: e.target.value } })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">가장 아쉬웠거나 개선이 필요한 점은 무엇인가요?</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all min-h-[100px]"
                  placeholder="솔직하게 말씀해 주시면 적극 반영하겠습니다."
                  value={data.openEnded.worstThing}
                  onChange={(e) => updateData({ openEnded: { ...data.openEnded, worstThing: e.target.value } })}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">회사를 지인에게 추천할 의향이 있으신가요? (NPS)</label>
                <div className="flex gap-1 overflow-x-auto pb-2">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                        <button
                            key={num}
                            onClick={() => updateData({ nps: num })}
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border ${
                                data.nps === num 
                                ? 'bg-white text-black border-white scale-110' 
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/20'
                            }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                 <div className="flex justify-between text-xs text-gray-500 px-1">
                     <span>절대 추천 안함</span>
                     <span>강력 추천</span>
                 </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step === Step.BASIC_INFO) return !data.department || !data.tenure;
    if (step === Step.PRIMARY_REASON) return !data.primaryReason;
    if (step === Step.SATISFACTION) return Object.values(data.satisfaction).some(v => v === 0);
    if (step === Step.OPEN_ENDED) return data.nps === -1; // Open ended text is optional, but NPS is required
    return false;
  };

  return (
    <div className={`flex flex-col h-full justify-between transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex-1 flex flex-col justify-center">
        {renderContent()}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors ${step === Step.WELCOME ? 'hidden' : ''}`}
        >
          <ChevronLeft size={20} />
          이전
        </button>

        <div className="flex gap-2">
            {[Step.BASIC_INFO, Step.PRIMARY_REASON, Step.SATISFACTION, Step.OPEN_ENDED].map((s) => (
                <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-purple-500' : 'bg-white/10'}`}></div>
            ))}
        </div>

        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            isNextDisabled()
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : step === Step.OPEN_ENDED 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-[0_0_15px_rgba(124,58,237,0.5)]'
                : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {step === Step.OPEN_ENDED ? (
            <>제출 및 분석 <Send size={18} /></>
          ) : (
            <>다음 <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;