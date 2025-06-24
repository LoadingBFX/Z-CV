import React, { useState } from 'react';
import { 
  Target, 
  FileText, 
  Sparkles, 
  Download,
  Eye,
  Settings,
  Zap
} from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import RoleSelector from '../Generate/RoleSelector';
import TemplateSelector from './TemplateSelector';
import ContentSelector from './ContentSelector';
import JDTailoring from './JDTailoring';

const steps = [
  { id: 'role', title: 'Select Target Role', icon: Target },
  { id: 'template', title: 'Choose Template', icon: FileText },
  { id: 'content', title: 'Select Content', icon: Settings },
  { id: 'generate', title: 'Generate Resume', icon: Sparkles },
];

const ResumeGenerator: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [currentStep, setCurrentStep] = useState('role');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedContent, setSelectedContent] = useState({
    experiences: [] as string[],
    projects: [] as string[],
    skills: [] as string[],
    achievements: [] as string[],
  });
  const [jdText, setJdText] = useState('');
  const [showJDTailoring, setShowJDTailoring] = useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 'role':
        return selectedRole !== '';
      case 'template':
        return selectedTemplate !== '';
      case 'content':
        return selectedContent.experiences.length > 0 || selectedContent.projects.length > 0;
      default:
        return true;
    }
  };

  const handleGenerate = async () => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newResume = {
      id: Date.now().toString(),
      name: `${state.portfolio.personalInfo.name}_${selectedRole}_${new Date().toISOString().split('T')[0]}`,
      type: 'role-based' as const,
      targetRole: selectedRole,
      template: selectedTemplate,
      sections: ['experience', 'projects', 'skills'],
      emphasis: selectedContent.skills,
      latex: generateMockLatex(),
      bullets: generateMockBullets(),
      selectedExperiences: selectedContent.experiences,
      selectedProjects: selectedContent.projects,
      selectedSkills: selectedContent.skills,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloadCount: 0,
      version: 1,
    };
    
    dispatch({ type: 'ADD_RESUME', payload: newResume });
    dispatch({ type: 'SET_GENERATING', payload: false });
    dispatch({ type: 'SET_VIEW', payload: 'resume-manager' });
  };

  const generateMockLatex = () => {
    return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${state.portfolio.personalInfo.name}} \\\\ \\vspace{1pt}
    \\small ${state.portfolio.personalInfo.phone} $|$ \\href{mailto:${state.portfolio.personalInfo.email}}{\\underline{${state.portfolio.personalInfo.email}}} $|$ 
    \\href{${state.portfolio.personalInfo.linkedin}}{\\underline{LinkedIn}} $|$
    \\href{${state.portfolio.personalInfo.github}}{\\underline{GitHub}}
\\end{center}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    ${state.portfolio.experiences.filter(exp => selectedContent.experiences.includes(exp.id)).map(exp => `
    \\resumeSubheading
      {${exp.title}}{${exp.startDate} -- ${exp.isCurrentRole ? 'Present' : exp.endDate}}
      {${exp.company}}{${exp.location}}
      \\resumeItemListStart
        ${exp.achievements.slice(0, 3).map(achievement => `\\resumeItem{${achievement}}`).join('\n        ')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      ${state.portfolio.projects.filter(proj => selectedContent.projects.includes(proj.id)).map(proj => `
      \\resumeProjectHeading
          {\\textbf{${proj.name}} $|$ \\emph{${proj.technologies.join(', ')}}}{${proj.startDate}}
          \\resumeItemListStart
            \\resumeItem{${proj.description}}
            ${proj.outcomes.slice(0, 2).map(outcome => `\\resumeItem{${outcome}}`).join('\n            ')}
          \\resumeItemListEnd
      `).join('')}
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${selectedContent.skills.filter(skillId => {
       const skill = state.portfolio.skills.find(s => s.name === skillId);
       return skill?.category === 'programming';
     }).join(', ')}} \\\\
     \\textbf{Frameworks}{: ${selectedContent.skills.filter(skillId => {
       const skill = state.portfolio.skills.find(s => s.name === skillId);
       return skill?.category === 'framework';
     }).join(', ')}} \\\\
     \\textbf{Tools}{: ${selectedContent.skills.filter(skillId => {
       const skill = state.portfolio.skills.find(s => s.name === skillId);
       return skill?.category === 'tool';
     }).join(', ')}}
    }}
 \\end{itemize}

\\end{document}`;
  };

  const generateMockBullets = () => {
    const bullets: string[] = [];
    
    state.portfolio.experiences
      .filter(exp => selectedContent.experiences.includes(exp.id))
      .forEach(exp => {
        bullets.push(...exp.achievements.slice(0, 3));
      });
    
    state.portfolio.projects
      .filter(proj => selectedContent.projects.includes(proj.id))
      .forEach(proj => {
        bullets.push(proj.description);
        bullets.push(...proj.outcomes.slice(0, 2));
      });
    
    return bullets;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'role':
        return <RoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />;
      case 'template':
        return <TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} targetRole={selectedRole} />;
      case 'content':
        return <ContentSelector selectedContent={selectedContent} onSelect={setSelectedContent} />;
      case 'generate':
        return (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate Resume</h3>
              <p className="text-gray-600 mb-8">
                Based on your selected <span className="font-medium text-blue-600">{selectedRole}</span> role,
                using <span className="font-medium text-blue-600">{selectedTemplate}</span> template to generate a professional resume
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleGenerate}
                  disabled={state.isGenerating}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate Resume
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowJDTailoring(true)}
                  className="w-full inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Tailor for Job Description
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Resume Generator</h1>
        <p className="text-lg text-gray-600">
          Generate customized professional resumes for different positions based on your portfolio
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isCurrent = step.id === currentStep;
              
              return (
                <li key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200
                      ${isCompleted 
                        ? 'bg-blue-600 border-blue-600' 
                        : isCurrent 
                        ? 'border-blue-600 bg-white' 
                        : 'border-gray-300 bg-white'
                      }
                    `}>
                      <IconComponent className={`w-5 h-5 ${isCompleted ? 'text-white' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <span className={`
                      mt-2 text-sm font-medium transition-colors duration-200
                      ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4 transition-colors duration-200
                      ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}
                    `} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-96">
        {renderCurrentStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            const currentIndex = steps.findIndex(s => s.id === currentStep);
            if (currentIndex > 0) {
              setCurrentStep(steps[currentIndex - 1].id);
            }
          }}
          disabled={currentStep === 'role'}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={() => {
            const currentIndex = steps.findIndex(s => s.id === currentStep);
            if (currentIndex < steps.length - 1) {
              setCurrentStep(steps[currentIndex + 1].id);
            }
          }}
          disabled={!canProceed() || currentStep === 'generate'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === 'generate' ? 'Complete' : 'Next'}
        </button>
      </div>

      {/* JD Tailoring Modal */}
      {showJDTailoring && (
        <JDTailoring
          onClose={() => setShowJDTailoring(false)}
          onTailor={(jd) => {
            setJdText(jd);
            // Handle JD tailoring logic
            setShowJDTailoring(false);
          }}
        />
      )}
    </div>
  );
};

export default ResumeGenerator;