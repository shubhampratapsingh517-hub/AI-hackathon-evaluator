import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Award, CheckCircle, Clock, Play, Activity, Wifi, Cpu, Server, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

export default function SidePanel({ teamName }: { teamName: string }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `[${new Date().toLocaleTimeString()}] System check: OK - Latency ${Math.floor(Math.random() * 50) + 10}ms`;
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Shortlist Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-[#0f1420] border-white/10 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Award className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-orbitron tracking-wide text-white">Shortlist Status</CardTitle>
                <p className="text-sm text-neutral-400 font-rajdhani uppercase tracking-wider">{teamName}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-[40px] rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                  <h3 className="text-2xl font-bold text-emerald-400 font-orbitron tracking-wide">Shortlisted</h3>
                </div>
                <p className="text-base text-gray-300 font-rajdhani leading-relaxed">
                  Congratulations! Your team has been selected for the next round.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-medium font-rajdhani p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <CheckCircle className="w-4 h-4" />
              You are qualified for the next round!
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timer Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-[#0f1420] border-white/10 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5 text-cyan-500 fill-cyan-500" />
              <CardTitle className="text-lg font-orbitron tracking-wide text-white">Time Remaining</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex justify-center items-center gap-4 mt-2">
              <TimeUnit value="23" label="HOURS" />
              <span className="text-cyan-500 font-bold text-2xl mb-6">:</span>
              <TimeUnit value="59" label="MIN" />
              <span className="text-cyan-500 font-bold text-2xl mb-6">:</span>
              <TimeUnit value="56" label="SEC" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-[#0f1420] border-white/10 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-purple-500" />
              <CardTitle className="text-xl font-orbitron tracking-wide text-white">System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-rajdhani">
                   <span className="text-gray-400 flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU Load</span>
                   <span className="text-cyan-400 font-bold">42%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-500 w-[42%] rounded-full" />
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-rajdhani">
                   <span className="text-gray-400 flex items-center gap-2"><Server className="w-4 h-4" /> Memory</span>
                   <span className="text-purple-400 font-bold">68%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 w-[68%] rounded-full" />
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm font-rajdhani">
                   <span className="text-gray-400 flex items-center gap-2"><Wifi className="w-4 h-4" /> Network</span>
                   <span className="text-emerald-400 font-bold">Stable</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[95%] rounded-full" />
                </div>
             </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Live Logs Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-[#0f1420] border-white/10 overflow-hidden">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-3">
               <Terminal className="w-6 h-6 text-gray-400" />
               <CardTitle className="text-xl font-orbitron tracking-wide text-white">Live Logs</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
             <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-green-400/80 h-40 overflow-hidden flex flex-col justify-end border border-white/10">
                {logs.map((log, i) => (
                   <div key={i} className="truncate py-0.5">{log}</div>
                ))}
                <div className="animate-pulse">_</div>
             </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#0a0f1c] border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
        <span className="text-3xl font-bold text-cyan-400 font-orbitron tracking-wider relative z-10">
          {value}
        </span>
      </div>
      <span className="text-[10px] font-bold text-gray-500 font-orbitron tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
