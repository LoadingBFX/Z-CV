import React from 'react';
import { Code, Database, Brain, Target, Briefcase, Zap } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const roles = [
  {
    id: 'sde',
    title: 'Software Engineer',
    description: 'Full-stack development, system design, and technical leadership',
    icon: Code,
    color: 'blue',
    skills: ['JavaScript', 'React', 'Python', 'System Design']
  },
  {
    id: 'mle',
    title: 'Machine Learning Engineer',
    description: 'ML model development, deployment, and MLOps infrastructure',
    icon: Brain,
    color: 'purple',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps']
  },
  {
    id: 'ds',
    title: 'Data Scientist',
    description: 'Data analysis, statistical modeling, and business insights',
    icon: Database,
    color: 'green',
    skills: ['Python', 'SQL', 'Statistics', 'Visualization']
  },
  {
    id: 'applied-scientist',
    title: 'Applied Scientist',
    description: 'Research-focused role combining science and engineering',
    icon: Target,
    color: 'indigo',
    skills: ['Research', 'ML', 'Publications', 'Prototyping']
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Product strategy, roadmap planning, and cross-functional leadership',
    icon: Briefcase,
    color: 'orange',
    skills: ['Strategy', 'Analytics', 'Leadership', 'Communication']
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'Infrastructure automation, CI/CD, and cloud architecture',
    icon: Zap,
    color: 'red',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  }
];

const RoleSelector: React.FC = () => {
  const { state, dispatch } = useZcv();

  const handleRoleSelect = (roleId: string) => {
    dispatch({ type: 'SET_ROLE', payload: roleId });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Target Role
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the role you're targeting. We'll optimize your resume with relevant keywords, 
          formatting, and content emphasis for that specific position.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          const isSelected = state.selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:shadow-lg group
                ${isSelected 
                  ? `border-${role.color}-500 bg-${role.color}-50 shadow-lg` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className={`absolute top-4 right-4 w-6 h-6 bg-${role.color}-500 rounded-full flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                ${isSelected 
                  ? `bg-${role.color}-500 text-white` 
                  : `bg-${role.color}-100 text-${role.color}-600 group-hover:bg-${role.color}-200`
                }
              `}>
                <IconComponent className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className={`
                text-xl font-semibold mb-2 transition-colors duration-300
                ${isSelected ? `text-${role.color}-900` : 'text-gray-900'}
              `}>
                {role.title}
              </h3>
              
              <p className={`
                text-sm mb-4 transition-colors duration-300
                ${isSelected ? `text-${role.color}-700` : 'text-gray-600'}
              `}>
                {role.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`
                      px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300
                      ${isSelected 
                        ? `bg-${role.color}-200 text-${role.color}-800` 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Hover effect */}
              <div className={`
                absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
                ${isSelected 
                  ? `bg-gradient-to-br from-${role.color}-500/10 to-${role.color}-600/5` 
                  : 'bg-gradient-to-br from-gray-500/0 to-gray-600/0 group-hover:from-gray-500/5 group-hover:to-gray-600/5'
                }
              `}></div>
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      {state.selectedRole && (
        <div className="mt-12 text-center">
          <button
            onClick={() => dispatch({ type: 'SET_STAGE', payload: 'result' })}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Generate Resume
            <div className="ml-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;