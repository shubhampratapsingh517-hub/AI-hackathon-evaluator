import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { useBackend, SOCKET_URL } from '../../context/BackendContext';
import { Loader2, CheckCircle, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function TournamentEvaluation() {
  const { teams, adminEvaluate, adminPublish, updateTeam } = useBackend();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isEvaluatingAll, setIsEvaluatingAll] = useState(false);
  const [evaluatingIds, setEvaluatingIds] = useState<Set<string>>(new Set());

  // Local state for form values
  const [scores, setScores] = useState({
    innovation: 0,
    technical: 0,
    ui: 0,
    performance: 0,
    accessibility: 0
  });
  const [feedback, setFeedback] = useState('');

  // Filter teams that are ready for evaluation
  const pendingTeams = teams.filter(t =>
    t.status === 'pending_admin_review' ||
    t.status === 'ai_evaluated_pending_admin'
  );

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  // Update form when selected team changes or team data updates (e.g. after AI eval)
  useEffect(() => {
    if (selectedTeam?.aiResult) {
      setScores({
        innovation: selectedTeam.aiResult.scores.innovation,
        technical: selectedTeam.aiResult.scores.technical,
        ui: selectedTeam.aiResult.scores.ui,
        performance: selectedTeam.aiResult.scores.performance || 0,
        accessibility: selectedTeam.aiResult.scores.accessibility || 0
      });
      setFeedback(selectedTeam.aiResult.summary);
    } else {
      // Reset defaults if no result yet
      setScores({
        innovation: 0,
        technical: 0,
        ui: 0,
        performance: 0,
        accessibility: 0
      });
      setFeedback('');
    }
  }, [selectedTeam]);

  const handleEvaluateAll = async () => {
    // Only evaluate teams that haven't been evaluated yet
    const teamsToEvaluate = pendingTeams.filter(t => t.status === 'pending_admin_review');

    if (teamsToEvaluate.length === 0) return;

    setIsEvaluatingAll(true);
    const ids = new Set<string>();

    // Mark all as evaluating
    teamsToEvaluate.forEach(t => ids.add(t.id));
    setEvaluatingIds(ids);

    // Evaluate sequentially
    for (const team of teamsToEvaluate) {
      await adminEvaluate(team.id);
      setEvaluatingIds(prev => {
        const next = new Set(prev);
        next.delete(team.id);
        return next;
      });
    }

    setIsEvaluatingAll(false);
  };

  const handleScoreChange = (key: keyof typeof scores, value: number[]) => {
    setScores(prev => ({ ...prev, [key]: value[0] }));
  };

  const teamsNeedingEvaluation = pendingTeams.filter(t => t.status === 'pending_admin_review');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-black/40 border-white/5 backdrop-blur-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white font-orbitron text-lg">Select Team</CardTitle>
            <Button
              size="sm"
              onClick={handleEvaluateAll}
              disabled={isEvaluatingAll || teamsNeedingEvaluation.length === 0}
              className="bg-cyan-600 hover:bg-cyan-500 text-xs"
            >
              {isEvaluatingAll ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Evaluate All ({teamsNeedingEvaluation.length})
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {pendingTeams.length === 0 ? (
              <div className="text-gray-500 text-center py-4 text-sm">No pending evaluations</div>
            ) : (
              pendingTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`p-3 rounded cursor-pointer transition-all border flex justify-between items-center ${selectedTeamId === team.id
                    ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'bg-white/5 hover:bg-white/10 border-transparent'
                    }`}
                >
                  <div className="flex-1 min-w-0 mr-2">
                    <div className="font-bold text-white truncate">{team.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {team.submission?.url || 'No URL'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {team.status === 'ai_evaluated_pending_admin' && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] px-1">
                        Evaluated
                      </Badge>
                    )}
                    {evaluatingIds.has(team.id) && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white font-orbitron flex items-center gap-2">
              Evaluation Console
              {selectedTeam?.status === 'ai_evaluated_pending_admin' && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-2">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedTeam ? (
              <div className="animate-in fade-in duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl text-white font-bold font-rajdhani">{selectedTeam.name}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <a
                        href={selectedTeam.submission?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30 underline-offset-4"
                      >
                        {selectedTeam.submission?.url}
                      </a>
                      {selectedTeam.submission?.ppt && (
                        <a
                          href={selectedTeam.submission.ppt.startsWith('/uploads') ? `${SOCKET_URL}${selectedTeam.submission.ppt}` : selectedTeam.submission.ppt}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 underline decoration-yellow-500/30 underline-offset-4"
                        >
                          <FileText className="w-3 h-3" /> Presentation (PPT)
                        </a>
                      )}
                    </div>
                  </div>
                  {selectedTeam.aiResult && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white font-orbitron">
                        {selectedTeam.aiResult.scores.final}
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Total Score</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 opacity-80">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300 font-medium text-primary">UI & UX (AI - 20%)</label>
                      <span className="text-sm font-mono text-primary">{scores.ui}/100</span>
                    </div>
                    <Slider
                      value={[scores.ui]}
                      max={100}
                      step={1}
                      className="py-2"
                      disabled={selectedTeam.status === 'ai_evaluated_pending_admin'}
                    />
                  </div>

                  <div className="space-y-2 opacity-80">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300 font-medium text-primary">Technical Depth (AI - 30%)</label>
                      <span className="text-sm font-mono text-primary">{scores.technical}/100</span>
                    </div>
                    <Slider
                      value={[scores.technical]}
                      max={100}
                      step={1}
                      className="py-2"
                      disabled={selectedTeam.status === 'ai_evaluated_pending_admin'}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-200 font-bold flex items-center gap-2">
                        Judge Score / Innovation (Manual - 30%)
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">Judge Input</Badge>
                      </label>
                      <span className="text-sm font-mono text-primary font-bold">{scores.innovation}/100</span>
                    </div>
                    <Slider
                      value={[scores.innovation]}
                      onValueChange={(val) => handleScoreChange('innovation', val)}
                      max={100}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2 opacity-80">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300 font-medium text-primary">Performance (AI - 10%)</label>
                      <span className="text-sm font-mono text-primary">{scores.performance}/100</span>
                    </div>
                    <Slider
                      value={[scores.performance]}
                      max={100}
                      step={1}
                      className="py-2"
                      disabled={selectedTeam.status === 'ai_evaluated_pending_admin'}
                    />
                  </div>

                  <div className="space-y-2 opacity-80">
                    <div className="flex justify-between">
                      <label className="text-sm text-gray-300 font-medium text-primary">Accessibility (AI - 10%)</label>
                      <span className="text-sm font-mono text-primary">{scores.accessibility}/100</span>
                    </div>
                    <Slider
                      value={[scores.accessibility]}
                      max={100}
                      step={1}
                      className="py-2"
                      disabled={selectedTeam.status === 'ai_evaluated_pending_admin'}
                    />
                  </div>
                </div>

                {selectedTeam.aiResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
                      <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {selectedTeam.aiResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                      <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Improvements
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {selectedTeam.aiResult.improvements.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mt-6">
                  <label className="text-sm text-gray-300 font-medium">AI Summary & Judge Comments</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px] focus:border-purple-500/50"
                  />
                </div>

                <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-6">
                  {selectedTeam.status === 'ai_evaluated_pending_admin' ? (
                    <div className="flex flex-wrap items-center gap-3 w-full justify-end">
                      <select 
                        className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white font-mono outline-none"
                        id="round-select"
                        defaultValue="1"
                      >
                        <option value="1">ROUND 1</option>
                        <option value="2">ROUND 2</option>
                        <option value="3">ROUND 3</option>
                      </select>

                      <Button
                        variant="outline"
                        className="border-primary/50 text-primary hover:bg-primary/10"
                        onClick={async () => {
                          await updateTeam(selectedTeam.id, { aiScoreInnovation: scores.innovation } as any);
                          alert('Judge Score (30%) updated! Final Score has been recalculated.');
                        }}
                      >
                        Save Judge Score
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const round = Number((document.getElementById('round-select') as HTMLSelectElement).value);
                          adminPublish(selectedTeam.id, round);
                        }}
                      >
                        Publish Results
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
                      onClick={() => adminEvaluate(selectedTeam.id)}
                      disabled={evaluatingIds.has(selectedTeam.id)}
                    >
                      {evaluatingIds.has(selectedTeam.id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Run AI Evaluation
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-rajdhani">Select a team to start evaluation</p>
                <p className="text-sm opacity-50">Choose from the list on the left</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
