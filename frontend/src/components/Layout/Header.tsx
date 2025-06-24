import React from 'react';
import { FileText, Sparkles, Menu } from 'lucide-react';
import { useZcv } from '../../context/ZcvContext';

const Header: React.FC = () => {
  const { state, dispatch } = useZcv();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', active: state.currentView === 'dashboard' },
    { id: 'chat', label: 'AI Discovery', active: state.currentView === 'chat' },
    { id: 'portfolio-builder', label: 'Portfolio', active: state.currentView === 'portfolio-builder' },
    { id: 'resume-generator', label: 'Generate', active: state.currentView === 'resume-generator' },
    { id: 'resume-manager', label: 'My Resumes', active: state.currentView === 'resume-manager' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FileText className="h-8 w-8 text-blue-600" />
              <Sparkles className="h-4 w-4 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Z-CV
              </h1>
              <p className="text-xs text-gray-500">AI Resume Builder</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id as any })}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                  ${item.active 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;