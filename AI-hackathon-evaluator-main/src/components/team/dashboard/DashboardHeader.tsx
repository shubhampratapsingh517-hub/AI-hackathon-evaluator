import React from 'react';
import { LayoutDashboard, Trophy, Code, Send, Settings, Activity, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { motion } from 'motion/react';

interface DashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardHeader({ activeTab, onTabChange }: DashboardHeaderProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'cyan' },
    { id: 'criteria', label: 'Criteria', icon: Sparkles, color: 'purple' },
    { id: 'tournament', label: 'Tournament', icon: Trophy, color: 'cyan' },
    { id: 'test-url', label: 'Test URL', icon: Code, color: 'purple' },
    { id: 'submit-api', label: 'Submission', icon: Send, color: 'cyan' },
    { id: 'scoreboard', label: 'Scoreboard', icon: Activity, color: 'purple' },
    { id: 'results', label: 'Results', icon: Sparkles, color: 'cyan' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'purple' },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6 pb-2 border-b border-white/5 relative -mt-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
        <div className="relative">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter font-orbitron uppercase whitespace-nowrap">
            <span className="text-white">Participant</span> <span className="text-gradient-cyan">Dashboard</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 bg-black/40 p-2 rounded-xl border border-white/5 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isCyan = item.color === 'cyan';
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-orbitron font-bold text-base tracking-wider transition-all duration-500
                ${isActive 
                  ? isCyan 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}
              `}
            >
              <item.icon className={`w-4 h-4 ${isActive ? (isCyan ? 'text-cyan-400' : 'text-purple-400') : 'text-gray-600'}`} />
              {item.label}
              {isActive && (
                <motion.div 
                   layoutId="activeUnderline"
                   className={`absolute -bottom-1.5 left-1/3 right-1/3 h-[2px] rounded-full ${isCyan ? 'bg-cyan-400' : 'bg-purple-400'}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
