import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Trophy, Code, Cpu, Globe, Timer, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import InteractiveParticleBackground from '../components/InteractiveParticleBackground';
import Leaderboard from '../components/shared/Leaderboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function LandingPage() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-[#020205]">
        <InteractiveParticleBackground />
        {/* Radial Gradients for Depth - Darkened */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-20%,_var(--tw-gradient-stops))] from-purple-950/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_100%,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
      </div>
      
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 sm:p-6 lg:p-8 flex justify-between items-center">
        {/* App Logo / Title in Top Left Corner */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <span className="text-white font-orbitron font-bold text-base sm:text-xl md:text-2xl tracking-widest uppercase">
            AI <span className="text-cyan-400">Hackathon</span> <span className="hidden sm:inline">Evaluator</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowLeaderboard(true)}
            className="text-gray-400 hover:text-white hover:bg-white/5 font-rajdhani text-sm sm:text-base px-2 sm:px-4"
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
            <span className="hidden sm:inline">Scoreboard</span>
          </Button>

          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-orbitron font-bold tracking-wide rounded-md shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all text-sm sm:text-base px-3 sm:px-4"
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 lg:px-8 text-center mt-32 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >


          <motion.h1 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-orbitron tracking-widest text-white mb-6 leading-[1.1] uppercase"
          >
            AI <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)]">HACKATHON</span> <br />
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">EVALUATOR</span>
          </motion.h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-rajdhani leading-relaxed">
            Deploy your autonomous agents into the ultimate competitive environment. 
            Test your algorithms against the world's best AI models in real-time combat simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => navigate('/login')}
              className="h-14 px-8 text-lg bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-bold tracking-wide rounded-none skew-x-[-10deg] hover:skew-x-[-10deg] transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]"
            >
              <span className="skew-x-[10deg] inline-flex items-center gap-2">
                SIGN IN <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLeaderboard(true)}
              className="h-14 px-8 text-lg border-white/20 hover:bg-white/5 text-white font-orbitron tracking-wide rounded-none skew-x-[-10deg] hover:skew-x-[-10deg] backdrop-blur-sm"
            >
              <span className="skew-x-[10deg]">VIEW LEADERBOARD</span>
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-7xl w-full px-4"
        >
          {[
            { icon: Code, title: "Submit AI APIs", desc: "Deploy your AI models and test them in real-time against rigorous benchmarks." },
            { icon: Trophy, title: "Live Rankings", desc: "Track your position on the leaderboard with real-time score updates and analytics." },
            { icon: Timer, title: "Timed Challenges", desc: "Push your algorithms to the limit under strict time constraints and deadlines." },
            { icon: Users, title: "Team Battles", desc: "Form powerful teams, collaborate on strategies, and conquer the competition together." }
          ].map((feature, i) => (
            <div key={i} className="group p-6 bg-[#0a0a0c] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 rounded-xl relative overflow-hidden backdrop-blur-sm flex flex-col items-center text-center hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-12 h-12 rounded-lg bg-cyan-900/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
              </div>
              
              <h3 className="text-lg font-orbitron font-bold text-white mb-2 tracking-wide">{feature.title}</h3>
              <p className="text-gray-500 font-rajdhani text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-7xl w-full px-4 mb-12"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-orbitron text-white mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Works</span>
            </h2>
            <p className="text-gray-400 font-rajdhani text-lg">Four simple steps from code to championship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                step: 1, 
                icon: Code, 
                title: "Build Your Agent", 
                desc: "Create a model and deploy it as an API endpoint. Flask, FastAPI, or Node.js - your choice." 
              },
              { 
                step: 2, 
                icon: Zap, 
                title: "Submit & Test", 
                desc: "Register your API endpoint and test it against sample data before the competition begins." 
              },
              { 
                step: 3, 
                icon: Cpu, 
                title: "Compete Live", 
                desc: "During the event, your API is evaluated in real-time with accuracy, speed, and stability metrics." 
              },
              { 
                step: 4, 
                icon: Trophy, 
                title: "Win Glory", 
                desc: "Climb the leaderboard and prove your AI is the best. Top teams win prizes and recognition." 
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="bg-[#0a0a0c] border border-white/10 p-8 rounded-2xl h-full flex flex-col items-center text-center hover:border-cyan-500/30 transition-colors relative z-10">
                  
                  {/* Icon Container with Badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-900/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors border border-white/5 group-hover:border-cyan-500/30">
                      <item.icon className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-500 text-black font-bold font-mono text-xs flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-orbitron font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-500 font-rajdhani text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-mono">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>AI HACKATHON EVALUATOR © 2026</span>
          </div>
          <div className="flex gap-6">
            <a href="/docs" className="hover:text-cyan-400 transition-colors" aria-label="Documentation">DOCS</a>
            <a href="/api" className="hover:text-cyan-400 transition-colors" aria-label="API Reference">API</a>
            <a href="/community" className="hover:text-cyan-400 transition-colors" aria-label="Community Discord">DISCORD</a>
          </div>
        </div>
      </footer>

      {/* Leaderboard Modal */}
      <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
        <DialogContent className="bg-[#0a0a0c] border-white/10 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Leaderboard />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
