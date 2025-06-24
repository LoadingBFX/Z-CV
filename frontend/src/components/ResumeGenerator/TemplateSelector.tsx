import React from 'react';
import { FileText, Layout, Palette } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
  targetRole: string;
}

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design with subtle colors',
    preview: '/templates/modern-preview.png',
    bestFor: ['Software Engineer', 'Product Manager', 'Data Scientist'],
    features: ['Two-column layout', 'Color accents', 'Modern typography']
  },
  {
    id: 'classic',
    name: 'Classic Academic',
    description: 'Traditional format perfect for academic positions',
    preview: '/templates/classic-preview.png',
    bestFor: ['Applied Scientist', 'Research Engineer', 'PhD positions'],
    features: ['Single-column', 'Conservative design', 'Publication-friendly']
  },
  {
    id: 'tech',
    name: 'Tech Focused',
    description: 'Optimized for technical roles with project emphasis',
    preview: '/templates/tech-preview.png',
    bestFor: ['Software Engineer', 'DevOps Engineer', 'Machine Learning Engineer'],
    features: ['Project highlights', 'Technical skills emphasis', 'GitHub integration']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional design for senior positions',
    preview: '/templates/executive-preview.png',
    bestFor: ['Senior Engineer', 'Engineering Manager', 'Director'],
    features: ['Leadership focus', 'Achievement emphasis', 'Premium layout']
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
  targetRole
}) => {
  const getRecommendedTemplates = () => {
    return templates.filter(template => 
      template.bestFor.some(role => 
        role.toLowerCase().includes(targetRole.toLowerCase()) ||
        targetRole.toLowerCase().includes(role.toLowerCase())
      )
    );
  };

  const recommendedTemplates = getRecommendedTemplates();
  const otherTemplates = templates.filter(t => !recommendedTemplates.includes(t));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">选择简历模板</h3>
        <p className="text-gray-600">
          基于你选择的 <span className="font-medium text-blue-600">{targetRole}</span> 职位，
          我们为你推荐以下模板
        </p>
      </div>

      {/* 推荐模板 */}
      {recommendedTemplates.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-blue-600" />
            推荐模板
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={onSelect}
                isRecommended={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* 其他模板 */}
      {otherTemplates.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Layout className="h-5 w-5 mr-2 text-gray-600" />
            其他模板
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={onSelect}
                isRecommended={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TemplateCardProps {
  template: typeof templates[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
  isRecommended: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  isRecommended
}) => {
  return (
    <button
      onClick={() => onSelect(template.id)}
      className={`
        relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg group
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      {/* 推荐标签 */}
      {isRecommended && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
          推荐
        </div>
      )}

      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute top-4 left-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
      )}

      {/* 模板预览 */}
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <FileText className="h-12 w-12 text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">预览</span>
      </div>

      {/* 模板信息 */}
      <h5 className={`
        text-lg font-semibold mb-2 transition-colors duration-300
        ${isSelected ? 'text-blue-900' : 'text-gray-900'}
      `}>
        {template.name}
      </h5>
      
      <p className={`
        text-sm mb-4 transition-colors duration-300
        ${isSelected ? 'text-blue-700' : 'text-gray-600'}
      `}>
        {template.description}
      </p>

      {/* 特性标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {template.features.map((feature) => (
          <span
            key={feature}
            className={`
              px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300
              ${isSelected 
                ? 'bg-blue-200 text-blue-800' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
              }
            `}
          >
            {feature}
          </span>
        ))}
      </div>

      {/* 适合职位 */}
      <div className="text-xs text-gray-500">
        适合: {template.bestFor.join(', ')}
      </div>
    </button>
  );
};

export default TemplateSelector;