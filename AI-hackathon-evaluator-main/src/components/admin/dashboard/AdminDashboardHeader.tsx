import React from 'react';
import { LayoutDashboard, Users, Trophy, Settings, FileText, CheckSquare, ClipboardCheck, Timer, UserPlus, Sparkles, Code, Send, Activity } from 'lucide-react';
import { Button } from '../../ui/button';
import { motion } from 'motion/react';

interface AdminDashboardHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminDashboardHeader({ activeTab, onTabChange }: AdminDashboardHeaderProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'purple' },
    { id: 'submissions', label: 'Submissions', icon: FileText, color: 'cyan' },
    { id: 'evaluation', label: 'Evaluation', icon: ClipboardCheck, color: 'purple' },
    { id: 'timer', label: 'Timer', icon: Timer, color: 'purple' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'cyan' },
    { id: 'teams', label: 'Teams', icon: Users, color: 'purple' },
    { id: 'create-team', label: 'Create Team', icon: UserPlus, color: 'cyan' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'purple' },
  ];

  return (
    <div className="flex flex-col gap-2 mb-8 pb-4 border-b border-white/5 relative -mt-8">
      {/* Top Row: Title */}
      <div className="flex justify-center xl:justify-start">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter font-orbitron uppercase whitespace-nowrap text-green-500">
          Admin Panel
        </h1>
      </div>

      {/* Bottom Row: Navigation Buttons */}
      <div className="w-full">
        <div className="flex flex-nowrap items-center justify-start xl:justify-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isCyan = item.color === 'cyan';
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron font-bold text-sm md:text-base tracking-wider transition-all duration-300 whitespace-nowrap
                  ${isActive 
                    ? isCyan 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'}
                `}
              >
                <item.icon className={`w-4 h-4 ${isActive ? (isCyan ? 'text-cyan-400' : 'text-purple-400') : 'text-gray-600'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
