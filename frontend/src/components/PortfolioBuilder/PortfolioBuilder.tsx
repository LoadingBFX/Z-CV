import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Award, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';
import PersonalInfoEditor from './PersonalInfoEditor';
import ExperienceEditor from './ExperienceEditor';
import ProjectEditor from './ProjectEditor';
import EducationEditor from './EducationEditor';
import SkillsEditor from './SkillsEditor';
import AchievementsEditor from './AchievementsEditor';

const sections = [
  { id: 'personal', title: 'Personal Info', icon: User, component: PersonalInfoEditor },
  { id: 'experience', title: 'Work Experience', icon: Briefcase, component: ExperienceEditor },
  { id: 'projects', title: 'Projects', icon: Code, component: ProjectEditor },
  { id: 'education', title: 'Education', icon: GraduationCap, component: EducationEditor },
  { id: 'skills', title: 'Skills', icon: Settings, component: SkillsEditor },
  { id: 'achievements', title: 'Achievements', icon: Award, component: AchievementsEditor },
];

const PortfolioBuilder: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [activeSection, setActiveSection] = useState('personal');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExportPortfolio = () => {
    const dataStr = JSON.stringify(state.portfolio, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.portfolio.personalInfo.name || 'portfolio'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const handleImportPortfolio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const portfolio = JSON.parse(e.target?.result as string);
          dispatch({ type: 'LOAD_PORTFOLIO', payload: portfolio });
        } catch (error) {
          alert('Import failed: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component || PersonalInfoEditor;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
            <p className="text-lg text-gray-600">
              Build a comprehensive professional portfolio to generate targeted resumes
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Completeness</p>
              <p className="text-2xl font-bold text-blue-600">{state.portfolio.completeness}%</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportPortfolio}
                className="hidden"
                id="import-portfolio"
              />
              <label
                htmlFor="import-portfolio"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </label>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 transition-all duration-500"
              style={{ width: `${state.portfolio.completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Portfolio Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Work Experience</span>
                  <span className="font-medium">{state.portfolio.experiences.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium">{state.portfolio.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills</span>
                  <span className="font-medium">{state.portfolio.skills.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-medium">{state.portfolio.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <ActiveComponent />
          </div>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Portfolio</h3>
            <p className="text-gray-600 mb-6">
              Export your complete portfolio data as a JSON file, including all work experience, projects, skills, and other information.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExportPortfolio}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;