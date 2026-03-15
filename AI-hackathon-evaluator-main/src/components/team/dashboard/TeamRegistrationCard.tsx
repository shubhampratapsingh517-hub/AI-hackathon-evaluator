import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Users, Building2, User, Phone, Mail, Linkedin } from 'lucide-react';
import { Team } from '../../../context/BackendContext';
import { motion } from 'motion/react';

export default function TeamRegistrationCard({ team }: { team: Team | undefined }) {
  // Enhanced members with mock data for the UI demo
  const enhancedMembers = team?.members.map((m, i) => ({
    ...m,
    role: i === 0 ? 'Leader' : 'Member',
    course: 'BTECH-CS',
    year: '1',
    rollNo: `12515001${585 + i}`,
    email: `${m.name.toLowerCase().replace(' ', '.')}@gla.ac.in`
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-[#1a202c] border-white/10 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 py-4 px-6">
          <CardTitle className="flex items-center gap-3 text-lg font-orbitron tracking-wide text-white">
            <Users className="w-5 h-5 text-cyan-500" />
            Team Registration
          </CardTitle>
          <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 font-rajdhani font-bold px-3 py-1 text-xs">
            {team?.members.length || 0} Members
          </Badge>
        </CardHeader>
        <CardContent className="p-3 space-y-3">
          {/* Team Info Header */}
          <div className="grid md:grid-cols-2 gap-4 p-5 rounded-xl bg-white/10 border border-white/10">
            <div>
              <p className="text-xs text-gray-400 font-rajdhani font-semibold mb-1 uppercase tracking-wider">Team Name</p>
              <h3 className="text-2xl font-bold text-white font-orbitron tracking-wide">{team?.name}</h3>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-rajdhani font-semibold mb-1 uppercase tracking-wider">Institution</p>
              <div className="flex items-center gap-2 text-lg font-bold text-white font-rajdhani">
                <Building2 className="w-5 h-5 text-cyan-400/70" />
                {team?.collegeName}
              </div>
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {enhancedMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="p-3 rounded-lg bg-[#0a0f1c] border border-white/5 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <User className="w-6 h-6 text-gray-400 group-hover:text-cyan-400" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div>
                      <h4 className="text-base font-bold text-white font-orbitron tracking-wide">{member.name}</h4>
                      <Badge 
                        className={`mt-1 font-rajdhani font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 ${
                          member.role === 'Leader' 
                            ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                        }`}
                      >
                        {member.role}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-rajdhani uppercase tracking-tighter">Course/Year</p>
                        <p className="font-bold text-gray-200 font-rajdhani leading-tight">{member.course} / {member.year}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-rajdhani uppercase tracking-tighter">Roll No</p>
                        <p className="font-bold text-gray-200 font-rajdhani leading-tight">{member.rollNo}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-rajdhani">
                        <Phone className="w-3 h-3" /> {member.mobile}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-rajdhani">
                        <Mail className="w-3 h-3" /> {member.email}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
