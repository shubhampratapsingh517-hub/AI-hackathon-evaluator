import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Layout, Code, Lightbulb, Activity, Eye, ShieldCheck } from 'lucide-react';

export default function CriteriaOverview() {
  const criteria = [
    { title: 'Innovation', weight: '30%', icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', desc: 'Originality, problem-solving, and AI integration depth.' },
    { title: 'Technical', weight: '30%', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', desc: 'Code quality, architecture, and technical difficulty.' },
    { title: 'UI / UX', weight: '20%', icon: Layout, color: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'Design aesthetics, user journey, and overall experience.' },
    { title: 'Performance', weight: '10%', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', desc: 'Load speed, responsiveness, and optimization.' },
    { title: 'Accessibility', weight: '10%', icon: Eye, color: 'text-orange-400', bg: 'bg-orange-500/10', desc: 'WCAG compliance, inclusive design, and screen reader setup.' },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm md:text-base font-black font-orbitron tracking-[0.15em] text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          EVALUATION CRITERIA & WEIGHTAGE
        </h3>
        <p className="text-xs text-gray-400 font-rajdhani tracking-wide">
          All projects are evaluated by our AI Evaluation Engine across 5 distinct metrics spanning 100 points maximum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {criteria.map((c, i) => (
          <div key={i} className={`p-5 rounded-xl border border-white/5 ${c.bg} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden`}>
            {/* Subtle inner glow */}
            <div className={`absolute -right-4 -top-4 w-12 h-12 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 bg-white`} />
            
            <div className="flex items-center justify-between mb-6">
              <c.icon className={`w-5 h-5 ${c.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[10px] font-black text-white bg-black/50 px-2 py-0.5 rounded border border-white/5 font-mono">
                {c.weight}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="font-black text-white text-[11px] tracking-wider font-orbitron uppercase">{c.title}</h4>
              <p className="text-[10px] text-gray-400 font-rajdhani leading-tight tracking-normal">
                {c.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
