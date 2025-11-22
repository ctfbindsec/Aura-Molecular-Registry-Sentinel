
import React from 'react';
import type { ViewType } from '../types';
import { BrainCircuit, MessageSquare, Microscope, Globe } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'chat', name: 'Standard Query', icon: MessageSquare },
    { id: 'image', name: 'Image Analysis', icon: Microscope },
    { id: 'deep_analysis', name: 'Deep Analysis', icon: BrainCircuit },
    { id: 'web_query', name: 'Web Query', icon: Globe },
  ] as const;

  return (
    <nav className="w-64 h-full bg-slate-950/70 border-r border-cyan-500/20 p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-400">AURA</h1>
        <p className="text-xs text-slate-400 font-roboto-mono">Molecular Registry Sentinel</p>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium
                ${
                  activeView === item.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-auto text-center text-xs text-slate-500 font-roboto-mono">
        <p>STATUS: <span className="text-green-400">OPERATIONAL</span></p>
        <p>CHAIN: SECURE</p>
      </div>
    </nav>
  );
};

export default Sidebar;
