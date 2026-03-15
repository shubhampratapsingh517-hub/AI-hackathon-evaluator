import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBackend } from '../context/BackendContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, User, Shield, ArrowLeft, Cpu, Settings, Users } from 'lucide-react';
import InteractiveParticleBackground from '../components/InteractiveParticleBackground';

export default function LoginPage() {
  const [view, setView] = useState<'selection' | 'login'>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { login } = useBackend();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'admin' | 'participant') => {
    setIsAdmin(role === 'admin');
    setView('login');
    setError('');
    // Reset fields when switching roles
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Use actual entered credentials
    const finalEmail = email.trim();
    const finalPassword = password;

    const user = await login(finalEmail, finalPassword, isAdmin ? 'admin' : 'team');
    
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/team');
      }
    } else {
      setError('ACCESS DENIED: Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#020205]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <InteractiveParticleBackground />
        {/* Radial Gradients for Depth - Darkened */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_800px_at_50%_-20%,_var(--tw-gradient-stops))] from-purple-950/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_800px_at_100%_100%,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4">
        {view === 'selection' ? (
          <div
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-3xl flex justify-start mb-4">
              <Link to="/" className="inline-flex items-center text-cyan-500 hover:text-cyan-400 font-mono text-sm transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                BACK TO HOME
              </Link>
            </div>

            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-900/20 border border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <Shield className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-orbitron text-white mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                AI Hackathon Evaluator
              </h1>
              <p className="text-gray-400 font-rajdhani text-xl">
                Select your login type to continue
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              {/* Admin Card */}
              <div
                onClick={() => handleRoleSelect('admin')}
                className="cursor-pointer group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#0a0a0c]/80 backdrop-blur-sm p-8 transition-all hover:border-purple-500/50 hover:bg-purple-900/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
                    <Settings className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white group-hover:text-purple-300 transition-colors">
                    Admin Login
                  </h3>
                  <p className="text-gray-500 font-rajdhani leading-relaxed group-hover:text-gray-400">
                    Manage events, teams, and competition settings
                  </p>
                </div>
              </div>

              {/* Participant Card */}
              <div
                onClick={() => handleRoleSelect('participant')}
                className="cursor-pointer group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#0a0a0c]/80 backdrop-blur-sm p-8 transition-all hover:border-cyan-500/50 hover:bg-cyan-900/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-cyan-900/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Participant Login
                  </h3>
                  <p className="text-gray-500 font-rajdhani leading-relaxed group-hover:text-gray-400">
                    Access your team dashboard and competition
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-12 text-gray-600 font-mono text-sm">
              Credentials are assigned by the administrator only
            </p>
          </div>
        ) : (
          <div
            className="w-full max-w-md mx-auto"
          >
            <button 
              onClick={() => setView('selection')}
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 font-mono text-sm transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK TO SELECTION
            </button>

            <Card className={`bg-black/40 backdrop-blur-xl border shadow-2xl overflow-hidden relative group ${isAdmin ? 'border-purple-500/20' : 'border-cyan-500/20'}`}>
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isAdmin ? 'from-purple-500 via-fuchsia-500 to-purple-500' : 'from-cyan-500 via-emerald-500 to-cyan-500'}`} />
              
              <CardHeader className="space-y-1 text-center pb-8">
                <div className="flex justify-center mb-6 relative">
                  <div className={`absolute inset-0 blur-xl rounded-full ${isAdmin ? 'bg-purple-500/20' : 'bg-cyan-500/20'}`} />
                  <div className={`relative p-4 rounded-xl border border-white/10 bg-black/50 ${isAdmin ? 'text-purple-400' : 'text-cyan-400'}`}>
                    {isAdmin ? <Settings className="w-8 h-8" /> : <Users className="w-8 h-8" />}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold font-orbitron tracking-wider text-white">
                  {isAdmin ? 'ADMIN ACCESS' : 'TEAM LOGIN'}
                </CardTitle>
                <CardDescription className="font-rajdhani text-lg text-gray-400">
                  {isAdmin ? 'Enter administrative credentials' : 'Enter your team credentials'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className={`font-mono text-xs ${isAdmin ? 'text-purple-400/80' : 'text-cyan-500/80'}`}>IDENTITY</Label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder={isAdmin ? "admin@hackathon.com" : "team@hackathon.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-rajdhani text-lg transition-all ${isAdmin ? 'focus:border-purple-500/50 focus:ring-purple-500/20' : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className={`font-mono text-xs ${isAdmin ? 'text-purple-400/80' : 'text-cyan-500/80'}`}>ACCESS KEY</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-cyan-500/20 font-rajdhani text-lg transition-all ${isAdmin ? 'focus:border-purple-500/50 focus:ring-purple-500/20' : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <div 
                      className="text-xs font-mono text-red-400 bg-red-500/10 p-3 rounded border border-red-500/20 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full h-12 text-lg font-orbitron tracking-widest uppercase transition-all duration-300 rounded-none skew-x-[-5deg] ${
                      isAdmin 
                        ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]' 
                        : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]'
                    }`}
                  >
                    <span className="skew-x-[5deg]">
                      {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE LINK'}
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
