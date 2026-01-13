import { ChartBar, Users, DollarSign, TrendingUp, Briefcase, Heart } from 'lucide-react';

export const DEPARTMENTS = [
  "경영지원 (HR/Finance)",
  "영업/마케팅 (Sales/Marketing)",
  "연구개발 (R&D)",
  "서비스/운영 (Operations)",
  "디자인 (Design)",
  "기타 (Others)"
];

export const TENURE_RANGES = [
  "6개월 미만",
  "6개월 - 1년",
  "1년 - 3년",
  "3년 - 5년",
  "5년 이상"
];

export const EXIT_REASONS = [
  { id: 'compensation', label: '급여 및 복리후생', icon: DollarSign },
  { id: 'career', label: '커리어 성장 및 비전', icon: TrendingUp },
  { id: 'culture', label: '조직 문화 및 분위기', icon: Users },
  { id: 'leadership', label: '리더십 및 관리', icon: ChartBar },
  { id: 'workload', label: '업무 강도 및 워라밸', icon: Briefcase },
  { id: 'personal', label: '개인 사정 (건강/학업 등)', icon: Heart },
];

export const SATISFACTION_METRICS = [
  { key: 'culture', label: '조직 문화' },
  { key: 'compensation', label: '보상 체계' },
  { key: 'growth', label: '성장 기회' },
  { key: 'leadership', label: '리더십' },
  { key: 'workLifeBalance', label: '워라밸' },
];