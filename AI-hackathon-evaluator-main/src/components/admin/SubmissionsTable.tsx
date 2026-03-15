import React, { useState, useMemo } from 'react';
import { useBackend, Team, API_BASE_URL, SOCKET_URL as UPLOADS_URL } from '../../context/BackendContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Edit, ExternalLink, Github, CheckCircle, PlayCircle, Loader2, Sparkles, FileText, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../ui/input';
import EditTeamModal from './EditTeamModal';
import { useToast } from '../ui/toast';
import { motion } from 'motion/react';

// URLs centralized in BackendContext

export default function SubmissionsTable() {
  const { teams, adminEvaluate, adminPublish, deleteTeam, updateTeam } = useBackend();
  const { showToast } = useToast();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [judgeScores, setJudgeScores] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Search and filter logic
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const matchesSearch = searchQuery === '' || 
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.collegeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || team.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [teams, searchQuery, statusFilter]);

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEvaluate = async (teamId: string) => {
    setEvaluatingId(teamId);
    try {
      await adminEvaluate(teamId);
      showToast('AI Evaluation complete!', 'success');
    } catch {
      showToast('Evaluation failed. Please try again.', 'error');
    }
    setEvaluatingId(null);
  };

  const handlePublish = async (teamId: string) => {
    try {
      await adminPublish(teamId, selectedRound);
      showToast(`Results published for Round ${selectedRound}!`, 'success');
    } catch {
      showToast('Publish failed. Please try again.', 'error');
    }
  };

  const handleDelete = async (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}"? This action cannot be undone.`)) return;
    setDeletingId(teamId);
    try {
      await deleteTeam(teamId);
      showToast(`Team "${teamName}" deleted successfully.`, 'success');
    } catch {
      showToast('Failed to delete team.', 'error');
    }
    setDeletingId(null);
  };

  const handleUpdateJudgeScore = async (teamId: string) => {
    const score = judgeScores[teamId];
    if (score === undefined) return;

    try {
      await updateTeam(teamId, { aiScoreInnovation: score } as any);
      showToast('Judge Score updated and Final Score recalculated!', 'success');
    } catch {
      showToast('Failed to update score.', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published_to_team':
        return <Badge variant="success" className="bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30">Published</Badge>;
      case 'ai_evaluated_pending_admin':
        return <Badge variant="warning" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/30">Needs Review</Badge>;
      case 'pending_admin_review':
        return <Badge variant="info" className="bg-blue-500/20 text-blue-400 border-blue-500/20 hover:bg-blue-500/30">Pending AI</Badge>;
      default:
        return <Badge variant="secondary" className="bg-white/10 text-muted-foreground hover:bg-white/20">No Submission</Badge>;
    }
  };

  const downloadCSV = () => {
    const headers = ['Team Name', 'Email', 'College', 'Status', 'UI Score', 'Tech Score', 'Innovation Score', 'Perf Score', 'Accessibility Score', 'Final Score'];
    const rows = teams.map(t => [
      t.name,
      t.email,
      t.collegeName,
      t.status,
      t.aiResult?.scores.ui || 0,
      t.aiResult?.scores.technical || 0,
      t.aiResult?.scores.innovation || 0,
      t.aiResult?.scores.performance || 0,
      t.aiResult?.scores.accessibility || 0,
      t.aiResult?.scores.final || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card className="glass-card border-white/10 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-white/5 to-transparent flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              Team Submissions
              <span className="text-sm font-normal text-gray-500 ml-2">({filteredTeams.length} of {teams.length})</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={downloadCSV} className="border-white/10 hover:bg-white/5 text-xs font-mono">
              <FileText className="w-4 h-4 mr-2" /> EXPORT CSV
            </Button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search by name, email, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/30 border-white/10 text-white placeholder:text-gray-600 h-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-white/10 bg-black/30 text-sm text-white px-3 focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending_submission">No Submission</option>
                <option value="pending_admin_review">Pending AI</option>
                <option value="ai_evaluated_pending_admin">Needs Review</option>
                <option value="published_to_team">Published</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent bg-black/20">
                <TableHead className="pl-6">Team Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No teams match your search/filter criteria.' 
                      : 'No teams registered yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTeams.map((team, index) => (
                <motion.tr
                  key={team.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <TableCell className="font-medium pl-6">
                    <div>
                      <span className="group-hover:text-primary transition-colors duration-300">{team.name}</span>
                      <p className="text-xs text-gray-600">{team.collegeName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {team.members.map((m, i) => (
                        <span key={i} className="text-xs text-muted-foreground group-hover:text-gray-300 transition-colors">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {team.submission?.url && (
                        <a href={team.submission.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all" title="Deployed URL">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {team.submission?.github && (
                        <a href={team.submission.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:scale-110 transition-all" title="GitHub Repo">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {team.submission?.ppt && (
                        <a
                          href={team.submission.ppt.startsWith('/uploads') ? `${UPLOADS_URL}${team.submission.ppt}` : team.submission.ppt}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:scale-110 transition-all"
                          title="Presentation (PPT)"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(team.status)}</TableCell>
                  <TableCell className="text-right space-x-2 pr-6">
                    <Button size="icon" variant="ghost" onClick={() => setEditingTeam(team)} className="hover:bg-white/10 hover:text-primary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDelete(team.id, team.name)} 
                      disabled={deletingId === team.id}
                      className="hover:bg-red-500/10 hover:text-red-400"
                    >
                      {deletingId === team.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>

                    {team.status === 'pending_admin_review' && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-lg shadow-blue-500/20"
                        onClick={() => handleEvaluate(team.id)}
                        disabled={!!evaluatingId}
                      >
                        {evaluatingId === team.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Evaluate AI'}
                      </Button>
                    )}

                    {team.status === 'ai_evaluated_pending_admin' && (
                      <div className="flex flex-col gap-3 items-end">
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                          <div className="text-[10px] text-gray-500 uppercase font-mono">
                            Judge Score (20%)
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            className="w-16 h-8 rounded bg-black/50 border border-white/10 text-center text-sm focus:border-primary outline-none"
                            value={judgeScores[team.id] ?? team.aiResult?.scores.innovation ?? 0}
                            onChange={(e) => setJudgeScores({ ...judgeScores, [team.id]: Number(e.target.value) })}
                          />
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-primary hover:bg-primary/10" onClick={() => handleUpdateJudgeScore(team.id)}>
                            Save
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <div className="text-[10px] text-gray-500 uppercase font-mono mr-2">
                            Final: <span className="text-white font-bold">{team.aiResult?.scores.final}</span>
                          </div>
                          <select
                            className="h-9 rounded-md border border-white/10 bg-black/50 text-xs text-white px-2 focus:ring-1 focus:ring-primary outline-none"
                            value={selectedRound}
                            onChange={(e) => setSelectedRound(Number(e.target.value))}
                          >
                            <option value={1}>Round 1</option>
                            <option value={2}>Round 2</option>
                            <option value={3}>Round 3</option>
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300"
                            onClick={() => handlePublish(team.id)}
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </motion.tr>
              ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-black/20 border-t border-white/5">
              <div className="text-xs text-gray-500 font-mono italic">
                SHOWING {Math.min(filteredTeams.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredTeams.length, currentPage * itemsPerPage)} OF {filteredTeams.length} TEAMS
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/10 hover:bg-white/5"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Logic to show pages around current page
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                       pageNum = Math.min(totalPages - 4, currentPage - 2) + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        className={`h-8 min-w-[32px] px-2 text-xs font-mono border-white/10 ${currentPage === pageNum ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/10 hover:bg-white/5"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <EditTeamModal
        team={editingTeam}
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
      />
    </>
  );
}
