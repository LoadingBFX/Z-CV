import React, { useState } from 'react';
import { X, Target, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface JDTailoringProps {
  onClose: () => void;
  onTailor: (jdText: string) => void;
}

const JDTailoring: React.FC<JDTailoringProps> = ({ onClose, onTailor }) => {
  const [jdText, setJdText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    keywords: string[];
    requirements: string[];
    suggestions: string[];
  } | null>(null);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate JD analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalysis({
      keywords: ['React', 'Node.js', 'TypeScript', 'AWS', 'Microservices', 'Agile'],
      requirements: [
        '5+ years of full-stack development experience',
        'Strong proficiency in React and Node.js',
        'Experience with cloud platforms (AWS/Azure)',
        'Knowledge of microservices architecture',
        'Excellent problem-solving skills'
      ],
      suggestions: [
        'Emphasize your React and Node.js project experience',
        'Highlight cloud platform usage experience',
        'Showcase microservices architecture projects',
        'Quantify your technical achievements and impact'
      ]
    });
    
    setIsAnalyzing(false);
  };

  const handleTailor = () => {
    if (!jdText.trim()) return;
    onTailor(jdText);
  };

  const extractCompanyAndPosition = (text: string) => {
    // Simple company name and position extraction logic
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0];
      if (firstLine.includes('Software Engineer') && !positionTitle) {
        setPositionTitle('Software Engineer');
      }
      if (firstLine.includes('Google') && !companyName) {
        setCompanyName('Google');
      }
    }
  };

  const handleJDTextChange = (text: string) => {
    setJdText(text);
    extractCompanyAndPosition(text);
    setAnalysis(null); // Clear previous analysis
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Target className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">JD-Tailored Resume</h3>
              <p className="text-sm text-gray-600">Optimize your resume based on specific job description</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: JD Input */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Information (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Position Title"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description (JD) *
                </label>
                <textarea
                  value={jdText}
                  onChange={(e) => handleJDTextChange(e.target.value)}
                  placeholder="Please paste the complete job description..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={12}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Including complete information about requirements, skills, and responsibilities will yield better results
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!jdText.trim() || isAnalyzing}
                  className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze JD
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right: Analysis Results */}
            <div className="space-y-6">
              {!analysis && !isAnalyzing && (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">JD Smart Analysis</h4>
                  <p className="text-gray-600">
                    After pasting the job description, we'll analyze key requirements and skills to provide tailored recommendations
                  </p>
                </div>
              )}

              {isAnalyzing && (
                <div className="bg-purple-50 rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Analyzing JD</h4>
                  <p className="text-gray-600">
                    Extracting keywords, skill requirements, and matching recommendations...
                  </p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
                  {/* Keywords */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                      Key Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Core Requirements */}
                  <div className="bg-amber-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                      Core Requirements
                    </h4>
                    <ul className="space-y-2">
                      {analysis.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Optimization Suggestions */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="h-5 w-5 text-green-600 mr-2" />
                      Optimization Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleTailor}
            disabled={!jdText.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Tailored Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default JDTailoring;