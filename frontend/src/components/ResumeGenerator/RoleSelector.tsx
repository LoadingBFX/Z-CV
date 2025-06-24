import React from 'react';
import { Code, Database, Brain, Target, Briefcase, Zap } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: string;
  onSelect: (role: string) => void;
}

const roles = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Full-stack development, system design, and technical leadership',
    icon: Code,
    color: 'blue',
    skills: ['JavaScript', 'React', 'Python', 'System Design']
  },
  {
    id: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    description: 'ML model development, deployment, and MLOps infrastructure',
    icon: Brain,
    color: 'purple',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps']
  },
  {
    id: 'data-scientist',
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
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Infrastructure automation, CI/CD, and cloud architecture',
    icon: Zap,
    color: 'red',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelect }) => {
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          选择目标职位
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          选择你要申请的职位类型。我们会根据不同职位的特点，优化简历的关键词、格式和内容重点。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
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
              <h4 className={`
                text-xl font-semibold mb-2 transition-colors duration-300
                ${isSelected ? `text-${role.color}-900` : 'text-gray-900'}
              `}>
                {role.title}
              </h4>
              
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
    </div>
  );
};

export default RoleSelector;