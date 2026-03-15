import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export type TeamStatus =
  | 'pending_submission'
  | 'pending_admin_review'
  | 'ai_evaluated_pending_admin'
  | 'published_to_team';

export interface TeamMember {
  name: string;
  mobile: string;
  univRollNo: string;
  course: string;
  branch: string;
}

export interface AIScore {
  ui: number;
  innovation: number;
  technical: number;
  performance: number;
  accessibility: number;
  final: number;
}

export interface AIResult {
  scores: AIScore;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface Team {
  id: string;
  name: string;
  email: string;
  password?: string;
  collegeName: string;
  members: TeamMember[];
  submission: {
    url: string;
    github: string;
    ppt?: string;
  } | null;
  status: TeamStatus;
  aiResult: AIResult | null;
  shortlisted: boolean;
  round1Score: number;
  round2Score: number;
  round3Score: number;
  totalScore: number;
}

export interface HackathonEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  status: string;
  participants?: number;
}

export interface Announcement {
  id: number | string;
  title: string;
  content: string;
  type: 'general' | 'critical' | 'info';
  createdAt: string;
}

interface BackendContextType {
  teams: Team[];
  currentUser: { role: 'admin' | 'team'; id?: string; name?: string } | null;
  currentTeam: Team | null;
  login: (email: string, password: string, role: 'admin' | 'team') => Promise<{ role: 'admin' | 'team'; id?: string } | null>;
  logout: () => void;
  submitProject: (teamId: string, url: string, github: string, ppt?: string | File) => Promise<void>;
  adminEvaluate: (teamId: string) => Promise<void>;
  adminPublish: (teamId: string, round: number) => Promise<void>;
  updateTeam: (teamId: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  runTestDemo: (url: string, github: string, ppt?: string | File) => Promise<{ success: boolean; message: string; result?: AIResult }>;
  createTeam: (teamData: Omit<Team, 'status' | 'aiResult' | 'submission' | 'round1Score' | 'round2Score' | 'round3Score' | 'totalScore' | 'shortlisted'>) => Promise<void>;
  postAnnouncement: (title: string, content: string, type: string) => Promise<void>;
  deleteAnnouncement: (id: string | number) => Promise<void>;
  createEvent: (eventData: Omit<HackathonEvent, 'id' | 'status'>) => Promise<void>;
  deleteEvent: (id: string | number) => Promise<void>;
  toggleShortlist: (teamId: string, status: boolean) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; tempPassword?: string }>;
  announcements: Announcement[];
  events: HackathonEvent[];
  stats: any | null;
  loading: boolean;
  sessionLoading: boolean;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export function BackendProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: 'admin' | 'team'; id?: string; name?: string } | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ============ SESSION PERSISTENCE ============
  // On mount, check if a valid token exists and restore the session
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setSessionLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        } else {
          // Token invalid or expired, clean up
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Session restore error:', error);
        localStorage.removeItem('token');
      } finally {
        setSessionLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ============ DATA FETCHERS ============
  const fetchStats = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const fetchTeams = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const response = await fetch(`${API_BASE_URL}/teams`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const teamsData = await response.json();
        setTeams(teamsData);
      }
    } catch (error) {
      console.error('Fetch teams error:', error);
    }
  };

  const fetchCurrentTeam = async () => {
    if (!currentUser || currentUser.role !== 'team' || !currentUser.id) return;
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${currentUser.id}`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const teamData = await response.json();
        setCurrentTeam(teamData);
      }
    } catch (error) {
      console.error('Fetch current team error:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`);
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Fetch announcements error:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Fetch events error:', error);
    }
  };

  // ============ AUTH ============
  const login = async (email: string, password: string, role: 'admin' | 'team') => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentTeam(null);
    setTeams([]);
    setStats(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return { success: response.ok, message: data.message || data.error, tempPassword: data.tempPassword };
    } catch (error) {
      return { success: false, message: 'Password reset failed. Please try again.' };
    }
  };

  // ============ TEAM ACTIONS ============
  const createTeam = async (teamData: Omit<Team, 'status' | 'aiResult' | 'submission'>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }
      if (currentUser?.role === 'admin') {
        await fetchTeams();
        await fetchStats();
      }
    } catch (error) {
      console.error('Create team error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }
      await fetchTeams();
      await fetchStats();
    } catch (error) {
      console.error('Delete team error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitProject = async (teamId: string, url: string, github: string, ppt?: string | File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('url', url);
      formData.append('github', github);

      if (ppt instanceof File) {
        formData.append('pptFile', ppt);
      } else if (ppt) {
        formData.append('ppt', ppt);
      }

      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/submit`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }
      if (currentUser?.role === 'admin') {
        await fetchTeams();
        await fetchStats();
      } else {
        await fetchCurrentTeam();
      }
    } catch (error) {
      console.error('Submit project error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminEvaluate = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/evaluate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Evaluation failed');
      }
      await fetchTeams();
      await fetchStats();
    } catch (error) {
      console.error('Admin evaluate error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminPublish = async (teamId: string, round: number) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ round }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Publish failed');
      }
      await fetchTeams();
      await fetchStats();
    } catch (error) {
      console.error('Admin publish error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async (teamId: string, data: Partial<Team>) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Update failed');
      }
      if (currentUser?.role === 'admin') {
        await fetchTeams();
        await fetchStats();
      }
    } catch (error) {
      console.error('Update team error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleShortlist = async (teamId: string, status: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/shortlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ shortlisted: status }),
      });
      if (!response.ok) throw new Error('Failed to update shortlist status');
      await fetchTeams();
    } catch (error) {
      console.error('Toggle shortlist error:', error);
      throw error;
    }
  };

  const runTestDemo = async (url: string, github: string, ppt?: string | File) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('url', url);
      formData.append('github', github);
      formData.append('teamName', currentTeam?.name || '');

      if (ppt instanceof File) {
        formData.append('pptFile', ppt);
      } else if (ppt) {
        formData.append('ppt', ppt);
      }

      const response = await fetch(`${API_BASE_URL}/test-evaluate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error('Test evaluation failed');
      const data = await response.json();
      return { success: true, message: 'Test evaluation complete!', result: data.aiResult };
    } catch (error) {
      console.error('Run test demo error:', error);
      return { success: false, message: 'Test evaluation failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // ============ ANNOUNCEMENTS & EVENTS ============
  const postAnnouncement = async (title: string, content: string, type: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ title, content, type }),
      });
      if (!response.ok) throw new Error('Failed to post announcement');
      await fetchAnnouncements();
    } catch (error) {
      console.error('Post announcement error:', error);
      throw error;
    }
  };

  const deleteAnnouncement = async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete announcement');
      await fetchAnnouncements();
    } catch (error) {
      console.error('Delete announcement error:', error);
      throw error;
    }
  };

  const createEvent = async (eventData: Omit<HackathonEvent, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Failed to create event');
      await fetchEvents();
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string | number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  };

  // ============ EFFECTS ============
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchTeams();
      fetchStats();
    } else if (currentUser?.role === 'team') {
      fetchCurrentTeam();
    }
    fetchAnnouncements();
    fetchEvents();
  }, [currentUser]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('announcement', (announcement: Announcement) => {
      setAnnouncements(prev => [announcement, ...prev]);
    });

    newSocket.on('leaderboard_update', () => {
      if (currentUser?.role === 'admin') {
        fetchTeams();
        fetchStats();
      } else if (currentUser?.role === 'team') {
        fetchCurrentTeam();
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  return (
    <BackendContext.Provider value={{
      teams,
      currentUser,
      currentTeam,
      login,
      logout,
      submitProject,
      adminEvaluate,
      adminPublish,
      updateTeam,
      deleteTeam,
      runTestDemo,
      createTeam,
      postAnnouncement,
      deleteAnnouncement,
      createEvent,
      deleteEvent,
      toggleShortlist,
      forgotPassword,
      announcements,
      events,
      stats,
      loading,
      sessionLoading
    }}>
      {children}
    </BackendContext.Provider>
  );
}

export function useBackend() {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
}