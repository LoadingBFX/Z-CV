import React, { useState } from 'react';
import { Download, Eye, FileText, Sparkles, RefreshCw, Target } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const ResultView: React.FC = () => {
  const { state, dispatch } = useZcv();
  const [activeTab, setActiveTab] = useState(0);
  const [jdText, setJdText] = useState('');
  const [showJDInput, setShowJDInput] = useState(false);

  // Mock data - in real app this would come from the backend
  const mockVersions = [
    {
      label: 'Software Engineer',
      fileName: 'john_doe_sde.tex',
      latex: `\\documentclass[letterpaper,11pt]{article}
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

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape John Doe} \\\\ \\vspace{1pt}
    \\small +1 (555) 123-4567 $|$ \\href{mailto:john@example.com}{\\underline{john@example.com}} $|$ 
    \\href{https://linkedin.com/in/johndoe}{\\underline{linkedin.com/in/johndoe}} $|$
    \\href{https://github.com/johndoe}{\\underline{github.com/johndoe}}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Bachelor of Science in Computer Science}{2019 -- 2023}
      {University of Technology}{San Francisco, CA}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Software Engineer Intern}{Summer 2022}
      {Tech Corp}{San Francisco, CA}
      \\resumeItemListStart
        \\resumeItem{Developed full-stack web applications using React and Node.js, serving 10,000+ daily active users}
        \\resumeItem{Implemented RESTful APIs and database optimization techniques, reducing query response time by 40\\%}
        \\resumeItem{Collaborated with cross-functional teams in Agile environment, contributing to 15+ feature releases}
        \\resumeItem{Wrote comprehensive unit tests achieving 90\\% code coverage and reducing production bugs by 30\\%}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
      \\resumeProjectHeading
          {\\textbf{E-commerce Platform} $|$ \\emph{React, Node.js, MongoDB, AWS}}{2023}
          \\resumeItemListStart
            \\resumeItem{Built scalable e-commerce platform handling 1000+ concurrent users with real-time inventory management}
            \\resumeItem{Integrated payment processing with Stripe API and implemented secure authentication system}
            \\resumeItem{Deployed on AWS using Docker containers and implemented CI/CD pipeline with GitHub Actions}
          \\resumeItemListEnd
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: JavaScript, Python, Java, C++, SQL, HTML/CSS} \\\\
     \\textbf{Frameworks}{: React, Node.js, Express, Django, Spring Boot} \\\\
     \\textbf{Developer Tools}{: Git, Docker, AWS, Jenkins, Postman} \\\\
     \\textbf{Libraries}{: pandas, NumPy, Matplotlib, Bootstrap, Material-UI}
    }}
 \\end{itemize}

\\end{document}`,
      bullets: [
        'Developed full-stack web applications using React and Node.js, serving 10,000+ daily active users',
        'Implemented RESTful APIs and database optimization techniques, reducing query response time by 40%',
        'Collaborated with cross-functional teams in Agile environment, contributing to 15+ feature releases',
        'Wrote comprehensive unit tests achieving 90% code coverage and reducing production bugs by 30%'
      ]
    }
  ];

  React.useEffect(() => {
    if (state.versions.length === 0) {
      dispatch({ type: 'SET_VERSIONS', payload: mockVersions });
    }
  }, [state.versions.length, dispatch]);

  const handleTailorResume = async () => {
    if (!jdText.trim()) return;
    
    dispatch({ type: 'SET_TAILORING', payload: true });
    
    // Mock API call for tailoring
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const tailoredVersion = {
      label: `${state.selectedRole} (Tailored)`,
      fileName: `john_doe_${state.selectedRole}_tailored.tex`,
      latex: mockVersions[0].latex.replace('Software Engineer Intern', 'Senior Software Engineer'),
      bullets: [
        'Led development of microservices architecture using React and Node.js, scaling to 50,000+ concurrent users',
        'Architected RESTful APIs with advanced caching strategies, improving system performance by 60%',
        'Mentored junior developers and established code review processes, reducing critical bugs by 45%',
        'Implemented comprehensive testing strategies including unit, integration, and E2E tests with 95% coverage'
      ]
    };
    
    dispatch({ type: 'SET_VERSIONS', payload: [...state.versions, tailoredVersion] });
    dispatch({ type: 'SET_TAILORING', payload: false });
    setActiveTab(state.versions.length);
    setShowJDInput(false);
    setJdText('');
  };

  const downloadResume = (version: any) => {
    const blob = new Blob([version.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = version.fileName || 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentVersion = state.versions[activeTab];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your Generated Resume
        </h2>
        <p className="text-lg text-gray-600">
          Review your professional resume and download the LaTeX source. You can also tailor it for specific job descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Version Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Versions</h3>
            <div className="space-y-2">
              {state.versions.map((version, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors duration-200
                    ${activeTab === index
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium truncate">{version.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* JD Tailoring */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center mb-4">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">JD Tailoring</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Paste a job description to create a tailored version of your resume.
            </p>
            
            {!showJDInput ? (
              <button
                onClick={() => setShowJDInput(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Tailor Resume
              </button>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  rows={6}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleTailorResume}
                    disabled={!jdText.trim() || state.isTailoring}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {state.isTailoring ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Tailoring...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowJDInput(false);
                      setJdText('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {currentVersion && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => downloadResume(currentVersion)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download LaTeX
                </button>
                
                <button
                  onClick={() => dispatch({ type: 'SET_STAGE', payload: 'generate' })}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Try Another Role
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentVersion ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{currentVersion.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentVersion.fileName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </button>
                    <button
                      onClick={() => downloadResume(currentVersion)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                    Key Bullets
                  </button>
                  <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    LaTeX Source
                  </button>
                </nav>
              </div>

              {/* Key Bullets */}
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Generated Achievement Bullets</h4>
                <div className="space-y-3">
                  {currentVersion.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resume Generated</h3>
              <p className="text-gray-600">Generate your first resume to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultView;