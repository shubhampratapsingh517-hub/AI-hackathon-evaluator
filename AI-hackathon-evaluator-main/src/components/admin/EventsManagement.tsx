import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Plus, Loader2, Trash2, Megaphone, X } from 'lucide-react';
import { useBackend } from '../../context/BackendContext';
import { useToast } from '../ui/toast';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export default function EventsManagement() {
  const { stats, events, createEvent, deleteEvent, announcements, postAnnouncement, deleteAnnouncement, loading } = useBackend();
  const { showToast } = useToast();
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<number | string | null>(null);
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<number | string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: ''
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'general'
  });

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent(eventForm);
      setIsAddingEvent(false);
      setEventForm({ title: '', date: '', location: '' });
      showToast('Event created successfully!', 'success');
    } catch {
      showToast('Failed to create event.', 'error');
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postAnnouncement(announcementForm.title, announcementForm.content, announcementForm.type);
      setIsAddingAnnouncement(false);
      setAnnouncementForm({ title: '', content: '', type: 'general' });
      showToast('Announcement posted!', 'success');
    } catch {
      showToast('Failed to post announcement.', 'error');
    }
  };

  const handleDeleteEvent = async (id: number | string) => {
    if (!window.confirm('Delete this event?')) return;
    setDeletingEventId(id);
    try {
      await deleteEvent(id);
      showToast('Event deleted.', 'success');
    } catch {
      showToast('Failed to delete event.', 'error');
    }
    setDeletingEventId(null);
  };

  const handleDeleteAnnouncement = async (id: number | string) => {
    if (!window.confirm('Delete this announcement?')) return;
    setDeletingAnnouncementId(id);
    try {
      await deleteAnnouncement(id);
      showToast('Announcement deleted.', 'success');
    } catch {
      showToast('Failed to delete announcement.', 'error');
    }
    setDeletingAnnouncementId(null);
  };

  return (
    <div className="space-y-8">
      {/* Events Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white font-orbitron text-glow">Events Management</h2>
          <Button 
            onClick={() => setIsAddingEvent(!isAddingEvent)}
            className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 border border-purple-500/50"
          >
            {isAddingEvent ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Create Event</>}
          </Button>
        </div>

        {isAddingEvent && (
          <Card className="bg-[#0f1420]/80 border-purple-500/30 glass-card p-6">
            <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input 
                placeholder="Event Title" 
                value={eventForm.title} 
                onChange={e => setEventForm({...eventForm, title: e.target.value})}
                className="bg-black/50 border-white/10"
                required
              />
              <Input 
                placeholder="Date (e.g. March 15)" 
                value={eventForm.date} 
                onChange={e => setEventForm({...eventForm, date: e.target.value})}
                className="bg-black/50 border-white/10"
                required
              />
              <Input 
                placeholder="Location" 
                value={eventForm.location} 
                onChange={e => setEventForm({...eventForm, location: e.target.value})}
                className="bg-black/50 border-white/10"
                required
              />
              <Button type="submit" className="md:col-span-3 bg-purple-600 hover:bg-purple-500" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Event
              </Button>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {events.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-rajdhani">No events created yet.</div>
          )}
          {events.map((event) => (
            <Card key={event.id} className="bg-[#0f1420]/80 border-white/10 glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-rajdhani mb-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-green-500/10 text-green-400 border-green-500/30">
                      {event.status}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-500/10 hover:text-red-400 h-8 w-8"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deletingEventId === event.id}
                    >
                      {deletingEventId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white font-orbitron text-glow flex items-center gap-3">
            <Megaphone className="w-6 h-6 text-cyan-400" />
            Announcements
          </h2>
          <Button 
            onClick={() => setIsAddingAnnouncement(!isAddingAnnouncement)}
            className="bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 border border-cyan-500/50"
          >
            {isAddingAnnouncement ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Post Announcement</>}
          </Button>
        </div>

        {isAddingAnnouncement && (
          <Card className="bg-[#0f1420]/80 border-cyan-500/30 glass-card p-6">
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
              <Input 
                placeholder="Announcement Title" 
                value={announcementForm.title} 
                onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                className="bg-black/50 border-white/10"
                required
              />
              <Textarea
                placeholder="Announcement content..."
                value={announcementForm.content}
                onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                className="bg-black/50 border-white/10 min-h-[100px]"
                required
              />
              <div className="flex items-center gap-4">
                <select
                  value={announcementForm.type}
                  onChange={e => setAnnouncementForm({...announcementForm, type: e.target.value})}
                  className="h-10 rounded-md border border-white/10 bg-black/50 text-sm text-white px-3 focus:ring-1 focus:ring-cyan-500 outline-none"
                >
                  <option value="general">General</option>
                  <option value="critical">Critical</option>
                  <option value="info">Info</option>
                </select>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 flex-1" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Post Announcement
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid gap-4">
          {announcements.length === 0 && (
            <div className="text-center py-8 text-gray-500 font-rajdhani">No announcements yet.</div>
          )}
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="bg-[#0f1420]/80 border-white/10 glass-card">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white font-rajdhani">{announcement.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        announcement.type === 'critical' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                          : announcement.type === 'info'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      }`}>
                        {announcement.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-rajdhani">{announcement.content}</p>
                    {announcement.createdAt && (
                      <p className="text-gray-600 text-xs mt-2 font-mono">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-red-500/10 hover:text-red-400 h-8 w-8 ml-4"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    disabled={deletingAnnouncementId === announcement.id}
                  >
                    {deletingAnnouncementId === announcement.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
