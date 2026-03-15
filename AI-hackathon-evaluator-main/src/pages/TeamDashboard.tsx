import React, { useState, useEffect } from 'react';
import { useBackend } from '../context/BackendContext';
import { useToast } from '../components/ui/toast';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/team/dashboard/DashboardHeader';
import StatsGrid from '../components/team/dashboard/StatsGrid';
import TeamRegistrationCard from '../components/team/dashboard/TeamRegistrationCard';
import SidePanel from '../components/team/dashboard/SidePanel';
import SubmissionForm from '../components/team/SubmissionForm';
import TestDemoCard from '../components/team/TestDemoCard';
import Leaderboard from '../components/shared/Leaderboard';
import AIResultCard from '../components/team/AIResultCard';
import { Button } from '../components/ui/button';
import { LogOut, Settings as SettingsIcon, Sparkles, ShieldCheck, Lock, User, Mail, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { motion } from 'motion/react';
import InteractiveParticleBackground from '../components/InteractiveParticleBackground';
import PortalTopBar from '../components/shared/PortalTopBar';
import CriteriaOverview from '../components/shared/CriteriaOverview';

export default function TeamDashboard() {
  const { currentUser, currentTeam, logout, forgotPassword } = useBackend();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const team = currentTeam;
  const [activeTab, setActiveTab] = useState('overview');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <StatsGrid teamName={team?.name || 'TECH TITANS'} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <TeamRegistrationCard team={team} />
                <AIResultCard />
              </div>
              <div className="xl:col-span-1">
                <SidePanel teamName={team?.name || 'TECH TITANS'} />
              </div>
            </div>
          </>
        );
      case 'criteria':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <CriteriaOverview />
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-orbitron flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  Detailed Evaluation Guide
                </CardTitle>
                <CardDescription className="text-gray-400 font-rajdhani">
                  Step-by-step breakdown of how points are awarded for each metric.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h3 className="text-lg font-bold text-white font-orbitron mb-2">Innovation (30%)</h3>
                  <div className="space-y-2 text-gray-300 font-rajdhani text-sm leading-relaxed">
                    <p>This evaluates the uniqueness and creativity of your solution. We look for:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Novelty of the idea and problem-solving approach.</li>
                      <li>Depth of AI integration (Generative AI, ML models, etc.).</li>
                      <li>Potential real-world impact and scalability of the concept.</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h3 className="text-lg font-bold text-white font-orbitron mb-2">Technical Excellence (30%)</h3>
                  <div className="space-y-2 text-gray-300 font-rajdhani text-sm leading-relaxed">
                    <p>The core technical implementation and code quality. Key factors include:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Architecture: How well-structured and modular is your codebase?</li>
                      <li>Efficiency: Optimization of algorithms and resource usage.</li>
                      <li>Clean Code: Proper documentation, variable naming, and error handling.</li>
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <h3 className="text-lg font-bold text-white font-orbitron mb-2">UI/UX Design (20%)</h3>
                  <div className="space-y-2 text-gray-300 font-rajdhani text-sm leading-relaxed">
                    <p>Focuses on the user journey and visual aesthetics. We assess:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Intuitive Navigation: Is the app easy and logical to use?</li>
                      <li>Visual Hierarchy: Professional use of typography, colors, and layouts.</li>
                      <li>Responsiveness: Seamless experience across different screen sizes.</li>
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h3 className="text-lg font-bold text-white font-orbitron mb-2 text-sm md:text-base">Performance (10%)</h3>
                    <p className="text-gray-400 font-rajdhani text-xs md:text-sm leading-relaxed">
                      Evaluates load speed, API response times, and overall stability under stress. Optimized assets and efficient state management are crucial here.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <h3 className="text-lg font-bold text-white font-orbitron mb-2 text-sm md:text-base">Accessibility (10%)</h3>
                    <p className="text-gray-400 font-rajdhani text-xs md:text-sm leading-relaxed">
                      Ensures inclusivity by following WCAG standards. Points are given for screen reader support, keyboard navigation, and proper color contrast.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'tournament':
        return (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white font-orbitron">Tournament Status</CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-400 font-rajdhani">
                    <p className="mb-4">Current Round: <span className="text-cyan-400 font-bold">Qualification</span></p>
                    <p>Status: <span className="text-emerald-400 font-bold">Active</span></p>
                  </CardContent>
                </Card>
                <SidePanel teamName={team?.name || 'TECH TITANS'} />
             </div>
             <AIResultCard />
          </div>
        );
      case 'test-url':
        return (
          <div className="max-w-4xl mx-auto">
            <TestDemoCard />
          </div>
        );
      case 'submit-api':
        return (
          <div className="max-w-3xl mx-auto">
            <SubmissionForm />
          </div>
        );
      case 'scoreboard':
        return (
          <div className="max-w-5xl mx-auto">
            <Leaderboard />
          </div>
        );
      case 'results':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <AIResultCard />
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Team Profile Card */}
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-orbitron">
                  <User className="w-5 h-5 text-cyan-500" />
                  Team Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {team && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1">TEAM NAME</div>
                        <p className="text-white font-rajdhani text-lg">{team.name}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1"><Mail className="w-3 h-3" /> EMAIL</div>
                        <p className="text-white font-rajdhani text-lg">{team.email}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5 sm:col-span-2">
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono mb-1"><GraduationCap className="w-3 h-3" /> COLLEGE</div>
                        <p className="text-white font-rajdhani text-lg">{team.collegeName}</p>
                      </div>
                    </div>
                    {team.members && team.members.length > 0 && (
                      <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                        <div className="text-gray-400 text-xs font-mono mb-3">TEAM MEMBERS</div>
                        <div className="space-y-2">
                          {team.members.map((m, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                              <span className="text-white font-rajdhani">{m.name}</span>
                              <span className="text-gray-500 text-xs font-mono">{m.univRollNo} • {m.branch}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Session Info */}
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs font-mono">LOGGED IN AS</p>
                    <p className="text-white font-rajdhani">{currentUser?.name || currentUser?.id}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020205] text-white p-2 md:pt-2 md:px-4 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <InteractiveParticleBackground />
        {/* Radial Gradients for Depth - Darkened */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-20%,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_100%,_var(--tw-gradient-stops))] from-purple-950/10 via-transparent to-transparent" />
      </div>
      
      {/* Static Glow Orbs - Darkened */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* Scanline Effect */}
      <div className="scanline" />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4">
        {/* Top Bar with Logout */}
        <PortalTopBar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLogout={handleLogout}
          scoreboardTabId="scoreboard"
          dashboardTabId="overview"
        />

        <DashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
