import React from 'react';
import { Check, Upload, MessageCircle, Edit, Target, FileText } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const stages = [
  { id: 'upload', title: 'Upload', icon: Upload },
  { id: 'chat', title: 'AI Chat', icon: MessageCircle },
  { id: 'edit', title: 'Edit Profile', icon: Edit },
  { id: 'generate', title: 'Select Role', icon: Target },
  { id: 'result', title: 'Results', icon: FileText }
];

const StageIndicator: React.FC = () => {
  const { state } = useZcv();
  const currentStageIndex = stages.findIndex(stage => stage.id === state.currentStage);

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {stages.map((stage, index) => {
              const IconComponent = stage.icon;
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              
              return (
                <li key={stage.id} className="flex items-center">
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
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <IconComponent className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <span className={`
                      mt-2 text-sm font-medium transition-colors duration-200
                      ${isCompleted || isCurrent ? 'text-blue-600' : 'text-gray-500'}
                    `}>
                      {stage.title}
                    </span>
                  </div>
                  
                  {index < stages.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4 transition-colors duration-200
                      ${index < currentStageIndex ? 'bg-blue-600' : 'bg-gray-300'}
                    `} />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default StageIndicator;