import React from 'react';
import { 
  User, 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  Calendar,
  Download,
  Edit,
  Plus,
  BarChart3,
  Target,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useZcv();
  const { portfolio, resumes, portfolioAnalysis } = state;

  const stats = [
    {
      label: 'Profile Completeness',
      value: `${portfolio.completeness}%`,
      icon: BarChart3,
      color: 'blue',
      trend: portfolio.completeness > 50 ? '+5%' : null
    },
    {
      label: 'Work Experience',
      value: portfolio.experiences.length,
      icon: Briefcase,
      color: 'green',
      trend: null
    },
    {
      label: 'Projects',
      value: portfolio.projects.length,
      icon: Code,
      color: 'purple',
      trend: null
    },
    {
      label: 'Generated Resumes',
      value: resumes.length,
      icon: FileText,
      color: 'orange',
      trend: null
    }
  ];

  const recentResumes = resumes.slice(-3).reverse();

  const getNextStep = () => {
    if (portfolio.completeness < 30) {
      return {
        title: 'Start Your Journey',
        description: 'Let our AI help you discover your professional story',
        action: () => dispatch({ type: 'SET_VIEW', payload: 'chat' }),
        icon: MessageCircle,
        color: 'blue'
      };
    } else if (portfolio.completeness < 70) {
      return {
        title: 'Complete Your Profile',
        description: 'Add more details to unlock better resume generation',
        action: () => dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' }),
        icon: Edit,
        color: 'green'
      };
    } else {
      return {
        title: 'Generate Your Resume',
        description: 'Your profile is ready! Create a targeted resume',
        action: () => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' }),
        icon: Sparkles,
        color: 'purple'
      };
    }
  };

  const getProfileInsights = () => {
    const insights = [];
    
    // Analyze completeness and provide specific guidance
    if (portfolio.completeness < 30) {
      insights.push({
        type: 'action',
        icon: MessageCircle,
        title: 'Start with AI Discovery',
        description: 'Let our AI guide you through building your profile',
        action: () => dispatch({ type: 'SET_VIEW', payload: 'chat' }),
        priority: 'high'
      });
    } else if (portfolio.completeness < 70) {
      // Identify specific missing pieces
      if (portfolio.experiences.length === 0) {
        insights.push({
          type: 'missing',
          icon: Briefcase,
          title: 'Add Work Experience',
          description: 'Share your professional background',
          action: () => dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' }),
          priority: 'high'
        });
      }
      if (portfolio.projects.length === 0) {
        insights.push({
          type: 'missing',
          icon: Code,
          title: 'Add Projects',
          description: 'Showcase your technical work',
          action: () => dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' }),
          priority: 'medium'
        });
      }
      if (portfolio.skills.length < 5) {
        insights.push({
          type: 'improve',
          icon: Target,
          title: 'Expand Skills List',
          description: 'Add more skills to strengthen your profile',
          action: () => dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' }),
          priority: 'medium'
        });
      }
    } else {
      // Profile is good, suggest next actions
      insights.push({
        type: 'success',
        icon: Sparkles,
        title: 'Ready to Generate!',
        description: 'Your profile is complete. Create targeted resumes',
        action: () => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' }),
        priority: 'high'
      });
      
      if (resumes.length === 0) {
        insights.push({
          type: 'action',
          icon: FileText,
          title: 'Generate First Resume',
          description: 'Create your first professional resume',
          action: () => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' }),
          priority: 'medium'
        });
      }
    }

    // Add improvement suggestions based on existing content
    if (portfolio.experiences.length > 0) {
      const hasQuantifiedAchievements = portfolio.experiences.some(exp => 
        exp.achievements.some(achievement => /\d+/.test(achievement))
      );
      if (!hasQuantifiedAchievements) {
        insights.push({
          type: 'improve',
          icon: TrendingUp,
          title: 'Quantify Your Impact',
          description: 'Add numbers and metrics to your achievements',
          action: () => dispatch({ type: 'SET_VIEW', payload: 'portfolio-builder' }),
          priority: 'low'
        });
      }
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const nextStep = getNextStep();
  const insights = getProfileInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'action': return Clock;
      case 'missing': return AlertCircle;
      case 'improve': return TrendingUp;
      case 'success': return CheckCircle;
      default: return Target;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {portfolio.personalInfo.name || 'there'}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              {portfolio.personalInfo.name 
                ? 'Continue building your professional story and generate targeted resumes'
                : 'Let\'s start by discovering your unique professional journey'
              }
            </p>
            
            {/* Next Step CTA */}
            <button
              onClick={nextStep.action}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/20"
            >
              <nextStep.icon className="h-5 w-5 mr-2" />
              {nextStep.title}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
          
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-100">Profile Completeness</span>
            <span className="text-sm font-medium">{portfolio.completeness}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${portfolio.completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Discovery Section */}
          {portfolio.completeness < 50 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">AI-Powered Discovery</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our AI will guide you through a conversational journey to uncover your professional highlights, 
                achievements, and unique value proposition. No tedious forms to fill out!
              </p>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'chat' })}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start AI Discovery
              </button>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            
            {portfolio.experiences.length > 0 || portfolio.projects.length > 0 ? (
              <div className="space-y-3">
                {portfolio.experiences.slice(0, 2).map((exp, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                    </div>
                  </div>
                ))}
                {portfolio.projects.slice(0, 2).map((proj, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Code className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{proj.name}</p>
                      <p className="text-sm text-gray-600">{proj.type} project</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No activity yet</p>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'chat' })}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Start building your profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Resumes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Resumes</h3>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'resume-manager' })}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            
            {recentResumes.length > 0 ? (
              <div className="space-y-3">
                {recentResumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {resume.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No resumes yet</p>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'resume-generator' })}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  Generate your first resume
                </button>
              </div>
            )}
          </div>

          {/* Smart Insights - Improved Version */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Insights</h3>
            
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                const TypeIcon = getTypeIcon(insight.type);
                const priorityColor = getPriorityColor(insight.priority);
                
                return (
                  <div key={index} className={`p-4 rounded-lg border-l-4 border-${priorityColor}-500 bg-${priorityColor}-50`}>
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-${priorityColor}-100`}>
                        <IconComponent className={`h-4 w-4 text-${priorityColor}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-semibold text-${priorityColor}-900`}>
                            {insight.title}
                          </h4>
                          <TypeIcon className={`h-3 w-3 text-${priorityColor}-600`} />
                        </div>
                        <p className={`text-xs text-${priorityColor}-700 mb-2`}>
                          {insight.description}
                        </p>
                        <button
                          onClick={insight.action}
                          className={`text-xs font-medium text-${priorityColor}-700 hover:text-${priorityColor}-800 flex items-center`}
                        >
                          Take action
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;