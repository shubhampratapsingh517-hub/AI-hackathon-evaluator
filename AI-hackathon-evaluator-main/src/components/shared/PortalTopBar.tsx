import React from 'react';
import { Trophy, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface PortalTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  scoreboardTabId?: string;
  dashboardTabId?: string;
}

export default function PortalTopBar({ 
  activeTab, 
  onTabChange, 
  onLogout,
  scoreboardTabId = 'leaderboard',
  dashboardTabId = 'overview'
}: PortalTopBarProps) {
  
  return (
    <div className="flex justify-end items-center gap-3 mb-8 bg-black/20 p-2 rounded-2xl border border-white/5 backdrop-blur-sm self-end">
      <button
        onClick={() => onTabChange(scoreboardTabId)}
        className={`px-4 py-2 rounded-xl font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-500 flex items-center gap-2 group ${
          activeTab === scoreboardTabId 
            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
            : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/5'
        }`}
      >
        <Trophy className={`w-3.5 h-3.5 group-hover:rotate-12 transition-transform ${activeTab === scoreboardTabId ? 'text-yellow-400' : 'text-gray-600'}`} />
        Scoreboard
      </button>
      
      <button
        onClick={() => onTabChange(dashboardTabId)}
        className={`px-4 py-2 rounded-xl font-orbitron font-bold text-sm uppercase tracking-widest transition-all duration-500 flex items-center gap-2 group ${
          activeTab === dashboardTabId 
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
            : 'text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/5'
        }`}
      >
        <LayoutDashboard className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${activeTab === dashboardTabId ? 'text-cyan-400' : 'text-gray-600'}`} />
        Dashboard
      </button>

      <div className="h-4 w-[1px] bg-white/10 mx-1" />

      <button 
        onClick={onLogout}
        className="px-4 py-2 rounded-xl font-orbitron font-bold text-sm uppercase tracking-widest text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-500 flex items-center gap-2 group"
      >
        <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> 
        Sign Out
      </button>
    </div>
  );
}
