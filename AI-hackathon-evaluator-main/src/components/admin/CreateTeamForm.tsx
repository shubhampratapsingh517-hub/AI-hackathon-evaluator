import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { useBackend, TeamMember } from '../../context/BackendContext';

export default function CreateTeamForm() {
  const { createTeam } = useBackend();
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([
    { name: '', mobile: '', univRollNo: '', course: '', branch: '' }
  ]);

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', mobile: '', univRollNo: '', course: '', branch: '' }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !email || !collegeName || !password || !teamId || members.some(m => !m.name || !m.univRollNo || !m.course || !m.branch)) {
      alert('Please fill in all required fields');
      return;
    }

    await createTeam({
      id: teamId,
      name: teamName,
      email,
      password,
      collegeName,
      members
    });

    // Reset form
    setTeamName('');
    setEmail('');
    setPassword('');
    setTeamId('');
    setCollegeName('');
    setMembers([{ name: '', mobile: '', univRollNo: '', course: '', branch: '' }]);
    alert('Team created successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-[#0f1420] border-white/10">
        <CardHeader>
          <CardTitle className="text-white font-orbitron flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-500" />
            Create New Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Team Name</Label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Team ID</Label>
                <Input
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  placeholder="Enter unique team ID"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Team Email (Login ID)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter team email"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-gray-300">College Name</Label>
                <Input
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Enter college name"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white font-rajdhani">Team Members</h3>
                <Button
                  type="button"
                  onClick={addMember}
                  disabled={members.length >= 5}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </div>

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
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Full Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Univ Roll No</Label>
                        <Input
                          value={member.univRollNo}
                          onChange={(e) => handleMemberChange(index, 'univRollNo', e.target.value)}
                          placeholder="Roll No"
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Mobile</Label>
                        <Input
                          value={member.mobile}
                          onChange={(e) => handleMemberChange(index, 'mobile', e.target.value)}
                          placeholder="Mobile Number"
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Course</Label>
                        <Input
                          value={member.course}
                          onChange={(e) => handleMemberChange(index, 'course', e.target.value)}
                          placeholder="e.g. B.Tech"
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-400">Branch</Label>
                        <Input
                          value={member.branch}
                          onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                          placeholder="e.g. CSE"
                          className="bg-black/20 border-white/10 text-white h-9"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8">
                Create Team
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
