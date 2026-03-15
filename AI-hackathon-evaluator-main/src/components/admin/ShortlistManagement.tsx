import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Check, X, Star } from 'lucide-react';
import { useBackend } from '../../context/BackendContext';

export default function ShortlistManagement() {
  const { teams, toggleShortlist } = useBackend();
  
  // Real logic: get teams already shortlisted OR candidates (Score > 80)
  const candidates = teams.filter(t => t.shortlisted || (t.aiResult?.scores.final && t.aiResult.scores.final > 80));

  return (
    <div className="space-y-6">
      <Card className="bg-[#0f1420] border-white/10 glass-card">
        <CardHeader>
          <CardTitle className="text-white font-orbitron flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            Shortlist Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.length > 0 ? (
              candidates.map((team) => (
                <div key={team.id} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${team.shortlisted ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div>
                    <h3 className="text-white font-bold font-rajdhani text-lg flex items-center gap-2">
                      {team.name}
                      {team.shortlisted && <Badge className="bg-green-500/20 text-green-400 text-[10px]">SHORTLISTED</Badge>}
                    </h3>
                    <p className="text-gray-400 text-sm">College: {team.collegeName}</p>
                    <div className="mt-1 flex gap-2">
                       <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">
                         Final Score: {team.aiResult?.scores.final || 0}/100
                       </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!team.shortlisted ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toggleShortlist(team.id, true)}>
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                    ) : (
                      <Button size="sm" variant="destructive" onClick={() => toggleShortlist(team.id, false)}>
                        <X className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No teams currently meet the shortlist criteria (Final Score &gt; 80) or are approved.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full font-mono font-bold tracking-wider ${className}`}>
      {children}
    </span>
  );
}
