import React, { useState } from 'react';
import { useBackend, Team } from '../context/BackendContext';
import { useToast } from '../components/ui/toast';
import { useNavigate } from 'react-router-dom';
import AdminDashboardHeader from '../components/admin/dashboard/AdminDashboardHeader';
import AdminStatsGrid from '../components/admin/dashboard/AdminStatsGrid';
import SubmissionsTable from '../components/admin/SubmissionsTable';
import Leaderboard from '../components/shared/Leaderboard';
import { Button } from '../components/ui/button';
import { LogOut, Settings as SettingsIcon, Edit, Trash2, Loader2 as Spinner } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import EventsManagement from '../components/admin/EventsManagement';
import TournamentEvaluation from '../components/admin/TournamentEvaluation';
import TimerControl from '../components/admin/TimerControl';
import TournamentManagement from '../components/admin/TournamentManagement';

import CreateTeamForm from '../components/admin/CreateTeamForm';
import InteractiveParticleBackground from '../components/InteractiveParticleBackground';
import EditTeamModal from '../components/admin/EditTeamModal';

import PortalTopBar from '../components/shared/PortalTopBar';
import CriteriaOverview from '../components/shared/CriteriaOverview';

export default function AdminDashboard() {
  const { logout, teams, deleteTeam } = useBackend();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalSubmissions = teams.filter(t => t.submission !== null).length;
  const pendingReviews = teams.filter(t => t.status === 'pending_admin_review' || t.status === 'ai_evaluated_pending_admin').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AnalyticsDashboard />
          </div>
        );

      case 'analytics':
        return <AnalyticsDashboard />;
      case 'events':
        return <EventsManagement />;
      case 'create-team':
        return <CreateTeamForm />;
      case 'submissions':
        return (
          <div className="max-w-6xl mx-auto">
            <SubmissionsTable />
          </div>
        );
      case 'evaluation':
        return <TournamentEvaluation />;
      case 'timer':
        return <TimerControl />;
      case 'leaderboard':
        return (
          <div className="max-w-5xl mx-auto">
            <Leaderboard />
          </div>
        );
      case 'teams':
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Registered Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map(team => (
                    <div key={team.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                      <div>
                        <h3 className="text-white font-bold font-outfit">{team.name}</h3>
                        <p className="text-gray-500 text-sm">{team.email}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-2 py-1 rounded text-xs bg-cyan-900/20 text-cyan-400 border border-cyan-500/20">
                          {team.status.replace(/_/g, ' ')}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-white/10 hover:text-cyan-400"
                          onClick={() => setEditingTeam(team)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-red-500/10 hover:text-red-400"
                          disabled={deletingId === team.id}
                          onClick={async () => {
                            if (!window.confirm(`Delete team "${team.name}"?`)) return;
                            setDeletingId(team.id);
                            try {
                              await deleteTeam(team.id);
                              showToast(`Team "${team.name}" deleted`, 'success');
                            } catch { showToast('Delete failed', 'error'); }
                            setDeletingId(null);
                          }}
                        >
                          {deletingId === team.id ? <Spinner className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {teams.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No teams registered yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-black/40 border-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white font-orbitron">
                  <SettingsIcon className="w-5 h-5 text-purple-500" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">Hackathon Configuration</h3>
                  <p className="text-gray-500 text-sm mb-4">Update round settings, deadlines, and scoring parameters.</p>
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    Manage Config
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-2 font-outfit">Security</h3>
                  <p className="text-gray-500 text-sm mb-4">Manage admin access and API keys.</p>
                  <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                    Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white p-4 md:p-8 font-jakarta selection:bg-purple-500/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <InteractiveParticleBackground />
        {/* Radial Gradients for Depth - Darkened */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-20%,_var(--tw-gradient-stops))] from-purple-950/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_100%,_var(--tw-gradient-stops))] from-cyan-950/10 via-transparent to-transparent" />
      </div>

      {/* Glow Orbs - Darkened */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Scanline Effect */}
      <div className="scanline" />
      
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-30" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4">
        {/* Top Bar with Logout */}
        <div className="relative z-50">
          <PortalTopBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
            scoreboardTabId="leaderboard"
            dashboardTabId="overview"
          />
        </div>

        <AdminDashboardHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>

      <EditTeamModal
        team={editingTeam}
        isOpen={!!editingTeam}
        onClose={() => setEditingTeam(null)}
      />
    </div>
  );
}

