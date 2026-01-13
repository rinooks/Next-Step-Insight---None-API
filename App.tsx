import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Welcome from './components/Welcome';
import SurveyForm from './components/SurveyForm';
import Results from './components/Results';
import { SurveyData, Step } from './types';

const INITIAL_DATA: SurveyData = {
  tenure: "",
  department: "",
  primaryReason: "",
  satisfaction: {
    culture: 0,
    compensation: 0,
    growth: 0,
    leadership: 0,
    workLifeBalance: 0,
  },
  openEnded: {
    bestThing: "",
    worstThing: "",
    suggestion: "",
  },
  nps: -1,
};

const getEnvApiKey = () => {
  // Vite
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    return import.meta.env.VITE_API_KEY;
  }
  // Process env
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.WELCOME);
  const [surveyData, setSurveyData] = useState<SurveyData>(INITIAL_DATA);
  const [apiKey, setApiKey] = useState<string>('');

  // 초기 로드 시 환경 변수 확인
  useEffect(() => {
    const envKey = getEnvApiKey();
    if (envKey) {
      setApiKey(envKey);
    }
  }, []);

  const updateData = (newData: Partial<SurveyData>) => {
    setSurveyData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (step === Step.OPEN_ENDED) {
      setStep(Step.ANALYSIS);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setSurveyData(INITIAL_DATA);
    setStep(Step.WELCOME);
  };

  return (
    <Layout>
      {step === Step.WELCOME && (
        <Welcome 
          onStart={() => setStep(Step.BASIC_INFO)} 
          apiKey={apiKey}
          setApiKey={setApiKey}
        />
      )}
      
      {step !== Step.WELCOME && step !== Step.ANALYSIS && (
        <SurveyForm
          data={surveyData}
          updateData={updateData}
          onNext={handleNext}
          onBack={handleBack}
          step={step}
        />
      )}

      {step === Step.ANALYSIS && (
        <Results 
          data={surveyData} 
          onRestart={handleRestart} 
          apiKey={apiKey}
        />
      )}
    </Layout>
  );
};

export default App;