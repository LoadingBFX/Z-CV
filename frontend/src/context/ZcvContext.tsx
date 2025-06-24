import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ZcvState, PersonalPortfolio, GeneratedResume, ChatMessage } from '../types';

type ZcvAction =
  | { type: 'LOAD_PORTFOLIO'; payload: PersonalPortfolio }
  | { type: 'UPDATE_PORTFOLIO'; payload: Partial<PersonalPortfolio> }
  | { type: 'ADD_EXPERIENCE'; payload: any }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: any } }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: any }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: any } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: any }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: any } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'ADD_SKILL'; payload: any }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: any } }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: any }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { id: string; data: any } }
  | { type: 'DELETE_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_RESUME'; payload: GeneratedResume }
  | { type: 'UPDATE_RESUME'; payload: { id: string; data: Partial<GeneratedResume> } }
  | { type: 'DELETE_RESUME'; payload: string }
  | { type: 'SELECT_RESUME'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT' }
  | { type: 'SET_VIEW'; payload: ZcvState['currentView'] }
  | { type: 'SET_FOCUS'; payload: string }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_TAILORING'; payload: boolean }
  | { type: 'UPDATE_ANALYSIS'; payload: any }
  | { type: 'EXPORT_PORTFOLIO' }
  | { type: 'IMPORT_PORTFOLIO'; payload: PersonalPortfolio };

const initialPortfolio: PersonalPortfolio = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
  },
  professionalSummary: {
    headline: '',
    elevator_pitch: '',
    career_objective: '',
    value_proposition: '',
  },
  experiences: [],
  projects: [],
  education: [],
  skills: [],
  achievements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: '1.0.0',
  completeness: 0,
};

const initialState: ZcvState = {
  portfolio: initialPortfolio,
  resumes: [],
  chatMessages: [],
  currentView: 'dashboard',
  isGenerating: false,
  isTailoring: false,
  portfolioAnalysis: {
    completeness: 0,
    strengths: [],
    gaps: [],
    suggestions: [],
  },
};

const calculateCompleteness = (portfolio: PersonalPortfolio): number => {
  let score = 0;
  const maxScore = 100;
  
  // 基本信息 (20分)
  if (portfolio.personalInfo.name) score += 5;
  if (portfolio.personalInfo.email) score += 5;
  if (portfolio.personalInfo.phone) score += 5;
  if (portfolio.personalInfo.location) score += 5;
  
  // 职业概述 (20分)
  if (portfolio.professionalSummary.headline) score += 5;
  if (portfolio.professionalSummary.elevator_pitch) score += 5;
  if (portfolio.professionalSummary.career_objective) score += 5;
  if (portfolio.professionalSummary.value_proposition) score += 5;
  
  // 经历 (25分)
  if (portfolio.experiences.length > 0) score += 15;
  if (portfolio.experiences.some(exp => exp.achievements.length > 0)) score += 10;
  
  // 项目 (15分)
  if (portfolio.projects.length > 0) score += 10;
  if (portfolio.projects.some(proj => proj.githubUrl)) score += 5;
  
  // 教育 (10分)
  if (portfolio.education.length > 0) score += 10;
  
  // 技能 (10分)
  if (portfolio.skills.length > 0) score += 10;
  
  return Math.round((score / maxScore) * 100);
};

const zcvReducer = (state: ZcvState, action: ZcvAction): ZcvState => {
  switch (action.type) {
    case 'LOAD_PORTFOLIO':
      return {
        ...state,
        portfolio: {
          ...action.payload,
          completeness: calculateCompleteness(action.payload),
        },
      };
      
    case 'UPDATE_PORTFOLIO':
      const updatedPortfolio = {
        ...state.portfolio,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      return {
        ...state,
        portfolio: {
          ...updatedPortfolio,
          completeness: calculateCompleteness(updatedPortfolio),
        },
      };
      
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          experiences: [...state.portfolio.experiences, { ...action.payload, id: Date.now().toString() }],
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          experiences: state.portfolio.experiences.map(exp =>
            exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
          ),
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          experiences: state.portfolio.experiences.filter(exp => exp.id !== action.payload),
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'ADD_PROJECT':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          projects: [...state.portfolio.projects, { ...action.payload, id: Date.now().toString() }],
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'UPDATE_PROJECT':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          projects: state.portfolio.projects.map(proj =>
            proj.id === action.payload.id ? { ...proj, ...action.payload.data } : proj
          ),
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'DELETE_PROJECT':
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          projects: state.portfolio.projects.filter(proj => proj.id !== action.payload),
          updatedAt: new Date().toISOString(),
        },
      };
      
    case 'ADD_RESUME':
      return {
        ...state,
        resumes: [...state.resumes, action.payload],
      };
      
    case 'UPDATE_RESUME':
      return {
        ...state,
        resumes: state.resumes.map(resume =>
          resume.id === action.payload.id ? { ...resume, ...action.payload.data } : resume
        ),
      };
      
    case 'DELETE_RESUME':
      return {
        ...state,
        resumes: state.resumes.filter(resume => resume.id !== action.payload),
      };
      
    case 'SELECT_RESUME':
      return {
        ...state,
        selectedResumeId: action.payload,
      };
      
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
      
    case 'CLEAR_CHAT':
      return {
        ...state,
        chatMessages: [],
      };
      
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      };
      
    case 'SET_FOCUS':
      return {
        ...state,
        currentFocus: action.payload,
      };
      
    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload,
      };
      
    case 'SET_TAILORING':
      return {
        ...state,
        isTailoring: action.payload,
      };
      
    case 'UPDATE_ANALYSIS':
      return {
        ...state,
        portfolioAnalysis: action.payload,
      };
      
    default:
      return state;
  }
};

const ZcvContext = createContext<{
  state: ZcvState;
  dispatch: React.Dispatch<ZcvAction>;
} | null>(null);

export const useZcv = () => {
  const context = useContext(ZcvContext);
  if (!context) {
    throw new Error('useZcv must be used within a ZcvProvider');
  }
  return context;
};

export const ZcvProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(zcvReducer, initialState);

  // 自动保存到 localStorage
  useEffect(() => {
    const saveData = {
      portfolio: state.portfolio,
      resumes: state.resumes,
    };
    localStorage.setItem('zcv-data', JSON.stringify(saveData));
  }, [state.portfolio, state.resumes]);

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('zcv-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.portfolio) {
          dispatch({ type: 'LOAD_PORTFOLIO', payload: parsed.portfolio });
        }
        if (parsed.resumes) {
          parsed.resumes.forEach((resume: GeneratedResume) => {
            dispatch({ type: 'ADD_RESUME', payload: resume });
          });
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  return (
    <ZcvContext.Provider value={{ state, dispatch }}>
      {children}
    </ZcvContext.Provider>
  );
};