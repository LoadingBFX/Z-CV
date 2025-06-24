import React from 'react';
import { ZcvProvider, useZcv } from './context/ZcvContext';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PortfolioBuilder from './components/PortfolioBuilder/PortfolioBuilder';
import ChatWindow from './components/Chat/ChatWindow';
import ResumeGenerator from './components/ResumeGenerator/ResumeGenerator';
import ResumeManager from './components/ResumeManager/ResumeManager';

const AppContent: React.FC = () => {
  const { state } = useZcv();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio-builder':
        return <PortfolioBuilder />;
      case 'chat':
        return <ChatWindow />;
      case 'resume-generator':
        return <ResumeGenerator />;
      case 'resume-manager':
        return <ResumeManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <ZcvProvider>
      <AppContent />
    </ZcvProvider>
  );
}

export default App;