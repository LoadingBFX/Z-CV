import React from 'react';
import { CheckCircle, Circle, Briefcase, Code, Award, Settings } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

interface ContentSelectorProps {
  selectedContent: {
    experiences: string[];
    projects: string[];
    skills: string[];
    achievements: string[];
  };
  onSelect: (content: ContentSelectorProps['selectedContent']) => void;
}

const ContentSelector: React.FC<ContentSelectorProps> = ({
  selectedContent,
  onSelect
}) => {
  const { state } = useZcv();
  const { portfolio } = state;

  const toggleItem = (category: keyof typeof selectedContent, itemId: string) => {
    const currentItems = selectedContent[category];
    const newItems = currentItems.includes(itemId)
      ? currentItems.filter(id => id !== itemId)
      : [...currentItems, itemId];
    
    onSelect({
      ...selectedContent,
      [category]: newItems
    });
  };

  const selectAll = (category: keyof typeof selectedContent) => {
    let allIds: string[] = [];
    
    switch (category) {
      case 'experiences':
        allIds = portfolio.experiences.map(exp => exp.id);
        break;
      case 'projects':
        allIds = portfolio.projects.map(proj => proj.id);
        break;
      case 'skills':
        allIds = portfolio.skills.map(skill => skill.name);
        break;
      case 'achievements':
        allIds = portfolio.achievements.map(ach => ach.id);
        break;
    }
    
    onSelect({
      ...selectedContent,
      [category]: allIds
    });
  };

  const clearAll = (category: keyof typeof selectedContent) => {
    onSelect({
      ...selectedContent,
      [category]: []
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Select Resume Content</h3>
        <p className="text-gray-600">
          Choose content from your portfolio to include in this resume. Select the most relevant experiences and skills for your target position.
        </p>
      </div>

      <div className="space-y-8">
        {/* Work Experience */}
        <ContentSection
          title="Work Experience"
          icon={Briefcase}
          items={portfolio.experiences.map(exp => ({
            id: exp.id,
            title: exp.title,
            subtitle: `${exp.company} • ${exp.startDate} - ${exp.isCurrentRole ? 'Present' : exp.endDate}`,
            description: exp.achievements.slice(0, 2).join('; '),
            selected: selectedContent.experiences.includes(exp.id)
          }))}
          selectedCount={selectedContent.experiences.length}
          totalCount={portfolio.experiences.length}
          onToggle={(id) => toggleItem('experiences', id)}
          onSelectAll={() => selectAll('experiences')}
          onClearAll={() => clearAll('experiences')}
        />

        {/* Projects */}
        <ContentSection
          title="Projects"
          icon={Code}
          items={portfolio.projects.map(proj => ({
            id: proj.id,
            title: proj.name,
            subtitle: `${proj.type} • ${proj.startDate}`,
            description: proj.description,
            selected: selectedContent.projects.includes(proj.id)
          }))}
          selectedCount={selectedContent.projects.length}
          totalCount={portfolio.projects.length}
          onToggle={(id) => toggleItem('projects', id)}
          onSelectAll={() => selectAll('projects')}
          onClearAll={() => clearAll('projects')}
        />

        {/* Skills */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Skills</h4>
              <span className="ml-2 text-sm text-gray-500">
                ({selectedContent.skills.length}/{portfolio.skills.length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => selectAll('skills')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Select All
              </button>
              <button
                onClick={() => clearAll('skills')}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {portfolio.skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => toggleItem('skills', skill.name)}
                className={`
                  flex items-center p-3 rounded-lg border transition-all duration-200
                  ${selectedContent.skills.includes(skill.name)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {selectedContent.skills.includes(skill.name) ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                ) : (
                  <Circle className="h-4 w-4 mr-2 text-gray-400" />
                )}
                <span className="text-sm font-medium truncate">{skill.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <ContentSection
          title="Achievements"
          icon={Award}
          items={portfolio.achievements.map(ach => ({
            id: ach.id,
            title: ach.title,
            subtitle: `${ach.organization} • ${ach.date}`,
            description: ach.description,
            selected: selectedContent.achievements.includes(ach.id)
          }))}
          selectedCount={selectedContent.achievements.length}
          totalCount={portfolio.achievements.length}
          onToggle={(id) => toggleItem('achievements', id)}
          onSelectAll={() => selectAll('achievements')}
          onClearAll={() => clearAll('achievements')}
        />
      </div>
    </div>
  );
};

interface ContentSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    selected: boolean;
  }[];
  selectedCount: number;
  totalCount: number;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  icon: Icon,
  items,
  selectedCount,
  totalCount,
  onToggle,
  onSelectAll,
  onClearAll
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Icon className="h-5 w-5 text-gray-400 mr-3" />
          <h4 className="text-lg font-semibold text-gray-500">{title}</h4>
        </div>
        <p className="text-gray-500 text-center py-8">
          No {title.toLowerCase()} data available. Please add relevant information in Portfolio Management first.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-600 mr-3" />
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <span className="ml-2 text-sm text-gray-500">
            ({selectedCount}/{totalCount})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`
              w-full flex items-start p-4 rounded-lg border text-left transition-all duration-200
              ${item.selected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <div className="flex-shrink-0 mt-1 mr-3">
              {item.selected ? (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className={`
                font-medium mb-1 transition-colors duration-200
                ${item.selected ? 'text-blue-900' : 'text-gray-900'}
              `}>
                {item.title}
              </h5>
              <p className={`
                text-sm mb-2 transition-colors duration-200
                ${item.selected ? 'text-blue-700' : 'text-gray-600'}
              `}>
                {item.subtitle}
              </p>
              <p className={`
                text-sm line-clamp-2 transition-colors duration-200
                ${item.selected ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentSelector;