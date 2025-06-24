export interface DetailedExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  
  // 深度挖掘字段
  context: string; // 什么背景下做的这个工作
  responsibilities: string[]; // 具体职责
  challenges: string[]; // 遇到的挑战
  solutions: string[]; // 如何解决的
  achievements: string[]; // 具体成果
  metrics: string[]; // 量化指标
  technologies: string[]; // 使用的技术
  teamSize?: number; // 团队规模
  budget?: string; // 预算规模
  
  // 反思和改进
  takeaways: string[]; // 学到了什么
  improvements: string[]; // 如果重做会怎么改进
  
  // 相关资源
  githubRepos?: string[];
  articles?: string[];
  presentations?: string[];
  awards?: string[];
}

export interface DetailedProject {
  id: string;
  name: string;
  type: 'personal' | 'academic' | 'work' | 'hackathon' | 'open-source';
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  
  // 项目详情
  motivation: string; // 为什么做这个项目
  description: string;
  objectives: string[]; // 目标
  challenges: string[]; // 挑战
  approach: string[]; // 方法论
  technologies: string[];
  architecture?: string; // 架构设计
  
  // 成果和影响
  outcomes: string[]; // 结果
  metrics: string[]; // 数据指标
  impact: string; // 影响
  
  // 学习和反思
  learnings: string[]; // 学到了什么
  improvements: string[]; // 改进点
  
  // 资源链接
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  documentation?: string;
  
  // 协作信息
  teamSize?: number;
  role: string; // 在项目中的角色
  collaborators?: string[];
}

export interface DetailedEducation {
  id: string;
  degree: string;
  major: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  
  // 学术详情
  relevantCoursework: string[];
  thesis?: {
    title: string;
    advisor: string;
    abstract: string;
    keywords: string[];
    url?: string;
  };
  
  // 学术活动
  researchProjects: string[];
  publications: string[];
  conferences: string[];
  academicAwards: string[];
  
  // 课外活动
  clubs: string[];
  leadership: string[];
  volunteering: string[];
  
  // 技能发展
  skillsDeveloped: string[];
  keyLearnings: string[];
}

export interface Skill {
  name: string;
  category: 'programming' | 'framework' | 'tool' | 'language' | 'soft-skill' | 'domain';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  lastUsed: string;
  
  // 技能来源
  acquiredFrom: string[]; // 从哪些经历中获得
  projects: string[]; // 在哪些项目中使用
  certifications?: string[];
  
  // 验证
  githubRepos?: string[];
  portfolioItems?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  type: 'award' | 'certification' | 'publication' | 'patent' | 'competition' | 'recognition';
  organization: string;
  date: string;
  description: string;
  significance: string; // 为什么重要
  skills: string[]; // 相关技能
  url?: string;
  credentialId?: string;
}

export interface PersonalPortfolio {
  // 基本信息
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
  };
  
  // 职业概述
  professionalSummary: {
    headline: string; // 一句话描述
    elevator_pitch: string; // 30秒电梯演讲
    career_objective: string; // 职业目标
    value_proposition: string; // 价值主张
  };
  
  // 详细经历
  experiences: DetailedExperience[];
  projects: DetailedProject[];
  education: DetailedEducation[];
  skills: Skill[];
  achievements: Achievement[];
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  version: string;
  completeness: number; // 完整度百分比
}

export interface GeneratedResume {
  id: string;
  name: string;
  type: 'role-based' | 'jd-tailored';
  targetRole?: string;
  targetCompany?: string;
  jobDescription?: string;
  
  // 生成配置
  template: string;
  sections: string[]; // 包含的部分
  emphasis: string[]; // 强调的技能/经历
  
  // 生成内容
  latex: string;
  bullets: string[];
  selectedExperiences: string[]; // 选中的经历ID
  selectedProjects: string[]; // 选中的项目ID
  selectedSkills: string[]; // 选中的技能
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  
  // 版本控制
  version: number;
  parentResumeId?: string; // 如果是基于其他简历修改的
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  
  // 结构化数据提取
  extractedData?: Partial<PersonalPortfolio>;
  suggestedActions?: string[];
  followUpQuestions?: string[];
}

export interface ZcvState {
  // 核心数据
  portfolio: PersonalPortfolio;
  resumes: GeneratedResume[];
  
  // 当前会话
  chatMessages: ChatMessage[];
  currentFocus?: string; // 当前正在完善的部分
  
  // UI状态
  currentView: 'dashboard' | 'portfolio-builder' | 'chat' | 'resume-generator' | 'resume-manager';
  selectedResumeId?: string;
  
  // 生成状态
  isGenerating: boolean;
  isTailoring: boolean;
  
  // 分析状态
  portfolioAnalysis: {
    completeness: number;
    strengths: string[];
    gaps: string[];
    suggestions: string[];
  };
}

// 简历模板配置
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  targetRoles: string[];
  sections: {
    id: string;
    name: string;
    required: boolean;
    maxItems?: number;
  }[];
  styling: {
    layout: 'single-column' | 'two-column';
    font: string;
    colorScheme: string;
  };
}

// 角色配置
export interface RoleConfig {
  id: string;
  title: string;
  description: string;
  keySkills: string[];
  importantSections: string[];
  bulletPointStyle: string;
  keywords: string[];
  templates: string[]; // 推荐模板
}