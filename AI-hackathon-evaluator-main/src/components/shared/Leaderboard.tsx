import React from 'react';
import { useBackend } from '../../context/BackendContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Trophy, Medal, Crown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Leaderboard() {
  const { teams, currentUser } = useBackend();

  // Filter teams and sort by total score
  const rankedTeams = [...teams]
    .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />;
      default: return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRowStyle = (index: number) => {
    switch(index) {
      case 0: return "bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-l-yellow-500";
      case 1: return "bg-gradient-to-r from-gray-400/10 to-transparent border-l-4 border-l-gray-400";
      case 2: return "bg-gradient-to-r from-amber-600/10 to-transparent border-l-4 border-l-amber-600";
      default: return "hover:bg-white/5 border-l-4 border-l-transparent";
    }
  };

  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-white/5 to-transparent">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Trophy className="text-yellow-500 w-6 h-6" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
            Live Leaderboard
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/10 bg-black/20">
              <TableHead className="w-[80px] text-center">Rank</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead className="text-center">R1</TableHead>
              <TableHead className="text-center">R2</TableHead>
              <TableHead className="text-center">R3</TableHead>
              <TableHead className="text-right pr-6">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankedTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Trophy className="w-8 h-8 opacity-20" />
                    <p>No teams published yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rankedTeams.map((team, index) => {
                const isCurrentUser = currentUser?.role === 'team' && currentUser.id === team.id;
                
                return (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-white/5 transition-all duration-200 ${getRowStyle(index)} ${isCurrentUser ? 'ring-2 ring-primary/50 ring-inset bg-primary/10' : ''}`}
                  >
                    <TableCell className="font-medium text-center py-4">
                      <div className="flex justify-center items-center">
                        {getRankIcon(index)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-base py-4">
                      <div className="flex items-center gap-2">
                        {team.name}
                        {isCurrentUser && (
                          <Badge variant="default" className="ml-2 bg-primary/20 text-primary border-primary/20 hover:bg-primary/30">
                            You
                          </Badge>
                        )}
                        {index === 0 && (
                          <Badge variant="warning" className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                            Leader
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4 text-xs font-rajdhani text-gray-400">
                      {team.round1Score || 0}
                    </TableCell>
                    <TableCell className="text-center py-4 text-xs font-rajdhani text-gray-400">
                      {team.round2Score || 0}
                    </TableCell>
                    <TableCell className="text-center py-4 text-xs font-rajdhani text-gray-400">
                      {team.round3Score || 0}
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <div className="inline-flex items-center justify-center min-w-[3rem] h-8 px-2 rounded-md bg-white/5 border border-white/10 font-bold text-lg text-white shadow-inner">
                        {team.totalScore || 0}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
