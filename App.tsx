
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import ImageAnalyzer from './components/ImageAnalyzer';
import DeepAnalysis from './components/DeepAnalysis';
import WebQuery from './components/WebQuery';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('chat');

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <ChatPanel />;
      case 'image':
        return <ImageAnalyzer />;
      case 'deep_analysis':
        return <DeepAnalysis />;
      case 'web_query':
        return <WebQuery />;
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 flex flex-col h-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
