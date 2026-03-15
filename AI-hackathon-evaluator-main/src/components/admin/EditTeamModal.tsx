import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useBackend, Team, TeamMember } from '../../context/BackendContext';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface EditTeamModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTeamModal({ team, isOpen, onClose }: EditTeamModalProps) {
  const { updateTeam } = useBackend();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (team) {
      setName(team.name);
      setEmail(team.email);
      setPassword(team.password || '');
      setCollegeName(team.collegeName);
      setMembers([...team.members]);
    }
  }, [team]);

  const handleSave = async () => {
    if (team) {
      try {
        await updateTeam(team.id, { name, email, password, collegeName, members });
        alert('Team updated successfully!');
        onClose();
      } catch (error) {
        alert('Failed to update team. Please try again.');
        console.error('Update team error:', error);
      }
    }
  };

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', mobile: '', univRollNo: '', course: '', branch: '' }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] glass-card border-white/10 max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Team: {team?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Login ID)</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College Name</Label>
                <Input
                  id="college"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-bold">Team Members</Label>
                <Button size="sm" variant="outline" onClick={addMember} disabled={members.length >= 5} className="h-8">
                  <Plus className="w-4 h-4 mr-1" /> Add Member
                </Button>
              </div>
              <div className="space-y-4">
                {members.map((member, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                          {index === 0 ? 'Team Leader' : `Member ${index + 1}`}
                        </h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => removeMember(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400">Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                            className="glass-input h-8 text-sm"
                            placeholder="Name"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400">Mobile</Label>
                          <Input
                            value={member.mobile}
                            onChange={(e) => updateMember(index, 'mobile', e.target.value)}
                            className="glass-input h-8 text-sm"
                            placeholder="Mobile"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400">Roll No</Label>
                          <Input
                            value={member.univRollNo || ''}
                            onChange={(e) => updateMember(index, 'univRollNo', e.target.value)}
                            className="glass-input h-8 text-sm"
                            placeholder="Roll No"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400">Course</Label>
                          <Input
                            value={member.course || ''}
                            onChange={(e) => updateMember(index, 'course', e.target.value)}
                            className="glass-input h-8 text-sm"
                            placeholder="Course"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-400">Branch</Label>
                          <Input
                            value={member.branch || ''}
                            onChange={(e) => updateMember(index, 'branch', e.target.value)}
                            className="glass-input h-8 text-sm"
                            placeholder="Branch"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
