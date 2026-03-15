import React from 'react';
import { useBackend } from '../../context/BackendContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { Zap, Code, Layout, Lightbulb, Trophy, Sparkles, Activity, Eye } from 'lucide-react';

export default function AIResultCard() {
  const { currentUser, currentTeam } = useBackend();
  const team = currentTeam;

  if (!team?.aiResult || team.status !== 'published_to_team') {
    return (
      <Card className="glass-card border-white/10 h-full flex items-center justify-center p-8 text-center text-muted-foreground bg-gradient-to-br from-white/5 to-transparent">
        <div>
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20 text-yellow-500" />
          <p className="text-lg font-medium">Results will appear here after evaluation is published.</p>
          <p className="text-sm opacity-60 mt-2">Good luck, {team?.name}!</p>
        </div>
      </Card>
    );
  }

  const { scores, strengths, improvements, summary } = team.aiResult;

  const scoreItems = [
    { label: 'UI/UX', value: scores.ui, icon: Layout, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Innovation', value: scores.innovation, icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Technical', value: scores.technical, icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Perform.', value: scores.performance, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Access.', value: scores.accessibility, icon: Eye, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ];

  return (
    <Card className="glass-card border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] -z-10" />

      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              Latest Evaluation
            </CardTitle>
            <CardDescription className="text-lg mt-1 font-rajdhani">Detailed AI analysis of your current round performance</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-7xl font-black text-white drop-shadow-lg leading-none">{team.totalScore || scores.final}</div>
            <div className="text-sm font-bold text-primary uppercase tracking-widest mt-2 px-2 py-0.5 bg-primary/10 rounded-full inline-block">Total Points</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {scoreItems.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`rounded-2xl p-6 text-center border ${item.bg} ${item.border} backdrop-blur-sm shadow-xl`}
            >
              <item.icon className={`w-8 h-8 mx-auto mb-4 ${item.color}`} />
              <div className="text-4xl font-bold text-white mb-2">{item.value}</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="rounded-2xl p-6 text-center border bg-yellow-500/10 border-yellow-500/20 backdrop-blur-sm shadow-xl overflow-hidden relative"
          >
             <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-400/20 blur-lg rounded-full" />
             <Zap className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
             <div className="text-4xl font-bold text-white mb-2">{scores.final}</div>
             <div className="text-sm font-black text-yellow-400 uppercase tracking-widest">Round Score</div>
          </motion.div>
        </div>

        {/* Round Summary Section */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
           <div className="text-center">
             <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter mb-1">Round 1</div>
             <div className="text-xl font-orbitron text-white">{team.round1Score || 0}</div>
           </div>
           <div className="text-center border-x border-white/10 px-2">
             <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter mb-1">Round 2</div>
             <div className="text-xl font-orbitron text-white">{team.round2Score || 0}</div>
           </div>
           <div className="text-center">
             <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter mb-1">Round 3</div>
             <div className="text-xl font-orbitron text-white">{team.round3Score || 0}</div>
           </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="font-bold mb-3 text-sm uppercase tracking-wider text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Executive Summary
            </h4>
            <p className="text-base leading-relaxed text-gray-200">{summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-green-500/5 p-5 rounded-xl border border-green-500/10"
            >
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-green-400 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Strengths
              </h4>
              <ul className="space-y-3">
                {strengths.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="mt-0.5">{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-orange-500/5 p-5 rounded-xl border border-orange-500/10"
            >
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Improvements
              </h4>
              <ul className="space-y-3">
                {improvements.map((s, i) => (
                  <li key={i} className="text-sm flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold">!</span>
                    <span className="mt-0.5">{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
