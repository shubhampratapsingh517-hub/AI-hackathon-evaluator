import React from 'react';
import { motion } from 'motion/react';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, delay }) => {
  const isCyan = color.includes('cyan');
  const isPurple = color.includes('purple') || color.includes('pink');
  const isEmerald = color.includes('emerald');
  const isYellow = color.includes('yellow') || color.includes('orange');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="premium-card bg-[#0a0a0c]/80 border-white/5 hover:border-white/10 transition-all duration-500 group overflow-hidden">
        <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${color}`} />
        <CardContent className="p-5 flex items-center gap-5 relative z-10">
          <div className={`p-4 rounded-xl glass border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
            isCyan ? 'text-cyan-400 border-cyan-500/20' : 
            isPurple ? 'text-purple-400 border-purple-500/20' : 
            isEmerald ? 'text-emerald-400 border-emerald-500/20' : 
            'text-yellow-400 border-yellow-500/20'
          }`}>
            <Icon className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em] mb-1">{label}</p>
            <h3 className={`text-2xl font-black font-orbitron tracking-tighter ${
              isCyan ? 'text-cyan-300' : 
              isPurple ? 'text-purple-300' : 
              isEmerald ? 'text-emerald-300' : 
              'text-yellow-300'
            }`}>
              {value}
            </h3>
          </div>
        </CardContent>
        <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ${color}`} />
      </Card>
    </motion.div>
  );
};

export default function AdminStatsGrid({ 
  totalTeams = 0, 
  totalSubmissions = 0, 
  pendingReviews = 0 
}: { 
  totalTeams?: number; 
  totalSubmissions?: number; 
  pendingReviews?: number; 
}) {
  const stats = [
    { label: 'Total Teams', value: totalTeams.toString(), icon: Users, color: 'bg-cyan-500' },
    { label: 'Submissions', value: totalSubmissions.toString(), icon: FileText, color: 'bg-purple-500' },
    { label: 'Pending Review', value: pendingReviews.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'System Status', value: 'Operational', icon: CheckCircle, color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
