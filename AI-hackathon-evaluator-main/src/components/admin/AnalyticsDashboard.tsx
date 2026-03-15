import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useBackend } from '../../context/BackendContext';

export default function AnalyticsDashboard() {
  const { stats } = useBackend();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500 font-rajdhani">
        Initializing analytics engine...
      </div>
    );
  }

  // Use live trend data or fallback to static-looking mock if empty
  const submissionData = stats.submissionTrend || [
    { name: 'Day 1', value: 0 },
    { name: 'Day 2', value: 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-[#0f1420] border-white/10">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Submission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #333', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0f1420] border-white/10">
        <CardHeader>
          <CardTitle className="text-white font-orbitron">Participation Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 h-[300px]">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5">
              <span className="text-4xl font-bold text-cyan-400 font-orbitron">{stats.totalTeams}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-2">Total Teams</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5">
              <span className="text-4xl font-bold text-purple-400 font-orbitron">{stats.totalSubmissions}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-2">Submissions</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5">
              <span className="text-4xl font-bold text-yellow-400 font-orbitron">{stats.pendingReviews}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-2">Pending Review</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5">
              <span className="text-4xl font-bold text-emerald-400 font-orbitron">{stats.avgScoreRound1}%</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider mt-2">Avg. Score</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
