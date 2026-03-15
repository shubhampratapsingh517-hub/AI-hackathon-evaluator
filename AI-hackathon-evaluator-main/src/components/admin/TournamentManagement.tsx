import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Trophy, Users, Clock, ArrowRight, Shield, Star, Rocket, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBackend } from '../../context/BackendContext';
import { Loader2, Trash2, ShieldAlert } from 'lucide-react';

export default function TournamentManagement() {
  const { teams, updateTeam, loading } = useBackend();
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [activeRoundId, setActiveRoundId] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic counts based on actual team data
  const round1Teams = teams.filter(t => t.submission !== null);
  const round2Teams = teams.filter(t => t.round1Score > 0);
  const round3Teams = teams.filter(t => t.round2Score > 0);

  const rounds = [
    {
      id: 1,
      name: 'Round 1: Initial Selection',
      description: 'Initial filtering and basic criteria evaluation.',
      status: activeRoundId === 1 ? 'Active' : activeRoundId > 1 ? 'Completed' : 'Upcoming',
      icon: Users,
      color: 'blue',
      count: round1Teams.length,
    },
    {
      id: 2,
      name: 'Round 2: Technical Deep Dive',
      description: 'Detailed code review and architectural assessment.',
      status: activeRoundId === 2 ? 'Active' : activeRoundId > 2 ? 'Completed' : 'Upcoming',
      icon: Activity,
      color: 'purple',
      count: round2Teams.length,
    },
    {
      id: 3,
      name: 'Round 3: Grand Finale',
      description: 'The final showdown with live presentations.',
      status: activeRoundId === 3 ? 'Active' : activeRoundId > 3 ? 'Completed' : 'Upcoming',
      icon: Rocket,
      color: 'yellow',
      count: round3Teams.length,
    }
  ];

  const handleAutoSelect = async (roundId: number) => {
    setIsProcessing(true);
    try {
      // Logic: Select top teams based on totalScore or AI results
      let candidates = [];
      if (roundId === 1) {
        // Move from registration to Round 1 (all submissions)
        candidates = teams.filter(t => t.submission !== null && t.round1Score === 0);
        for (const team of candidates) {
          await updateTeam(team.id, { round1Score: 60 }); // Base qualifying score
        }
      } else if (roundId === 2) {
        // Move from Round 1 to Round 2 (e.g., top 15 teams from Round 1)
        candidates = teams.filter(t => t.round1Score > 0 && t.round2Score === 0)
          .sort((a, b) => (b.aiResult?.scores.final || 0) - (a.aiResult?.scores.final || 0))
          .slice(0, 15);
        for (const team of candidates) {
          await updateTeam(team.id, { round2Score: 70 });
        }
      }
      alert(`Successfully processed Round ${roundId} selection!`);
    } catch (error) {
      console.error(error);
      alert('Failed to process selection.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartRound = (roundId: number) => {
    setActiveRoundId(roundId);
    setSelectedRound(null);
    alert(`Round ${roundId} has been officially approved and started!`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-black font-orbitron text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Tournament Management
          </h2>
          <p className="text-gray-400 mt-2 font-rajdhani text-lg">Manage hackathon progression across three intensive rounds.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white">View History</Button>
            <Button className="bg-purple-600 hover:bg-purple-500 text-white">Reset Tournament</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rounds.map((round) => {
          const Icon = round.icon;
          return (
            <motion.div
              key={round.id}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <Card className={`bg-black/40 border-white/5 backdrop-blur-sm h-full overflow-hidden transition-all duration-500 hover:border-${round.color}-500/30`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  round.color === 'blue' ? 'from-blue-500 to-cyan-500' :
                  round.color === 'purple' ? 'from-purple-500 to-pink-500' :
                  'from-yellow-500 to-orange-500'
                }`} />
                
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-3 rounded-xl bg-${round.color}-500/10 border border-${round.color}-500/20`}>
                      <Icon className={`w-6 h-6 text-${round.color}-400`} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full border ${
                      round.status === 'Active' 
                        ? 'border-green-500/30 text-green-400 bg-green-500/10' 
                        : 'border-white/10 text-gray-500 bg-white/5'
                    }`}>
                      {round.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-orbitron text-white mt-4">{round.name}</CardTitle>
                  <CardDescription className="text-gray-400 font-rajdhani text-base">{round.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Participants</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      {round.count} Teams
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className={`w-full border-white/10 text-white hover:bg-white/5 flex items-center justify-between group-hover:border-${round.color}-500/50`}
                    onClick={() => setSelectedRound(round.id)}
                  >
                    Manage Round
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRound && (
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-10"
           >
             <Card className="bg-black/60 border-white/10 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-orbitron text-white">Round {selectedRound} Administration</CardTitle>
                        <CardDescription className="text-gray-400">Configure round specific parameters and graduation logic.</CardDescription>
                    </div>
                    <Button variant="ghost" className="text-gray-500 hover:text-white" onClick={() => setSelectedRound(null)}>Close</Button>
                </CardHeader>
                <CardContent className="p-10 text-center space-y-4">
                    <div className="p-12 rounded-2xl bg-white/5 border border-dashed border-white/10">
                        <Shield className="w-16 h-16 text-purple-500/40 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Configure Selection Logic</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6 italic font-rajdhani text-lg">
                            "You can set threshold scores or manually select teams to advance to the next round of the tournament."
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button 
                              className="bg-cyan-600 hover:bg-cyan-500"
                              onClick={() => handleAutoSelect(selectedRound)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                              Step 1: Auto-Select Teams
                            </Button>
                            <Button 
                              className="bg-green-600 hover:bg-green-500 flex items-center gap-2"
                              onClick={() => handleStartRound(selectedRound)}
                              disabled={isProcessing}
                            >
                              <Shield className="w-4 h-4" />
                              Step 2: Approve & Start Round
                            </Button>
                        </div>
                    </div>
                </CardContent>
             </Card>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
