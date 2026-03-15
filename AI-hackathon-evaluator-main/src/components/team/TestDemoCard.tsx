import React, { useState } from 'react';
import { useBackend, AIResult } from '../../context/BackendContext';
import { useToast } from '../ui/toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Play, Loader2, CheckCircle, AlertCircle, Globe, Github, FileText, Zap, Code, Layout, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestDemoCard() {
  const { runTestDemo } = useBackend();
  const { showToast } = useToast();
  const [url, setUrl] = useState('');
  const [github, setGithub] = useState('');
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; result?: AIResult } | null>(null);

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    
    const res = await runTestDemo(url, github, pptFile || undefined);
    
    setResult(res);
    setIsLoading(false);
    if (res.success) {
      showToast('Test evaluation complete!', 'success');
    } else {
      showToast(res.message || 'Test evaluation failed', 'error');
    }
  };

  const scoreItems = result?.result ? [
    { label: 'UI/UX', value: result.result.scores.ui, icon: Layout, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { label: 'Innovation', value: result.result.scores.innovation, icon: Lightbulb, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Technical', value: result.result.scores.technical, icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  ] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card border-white/10 h-full relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-orbitron tracking-wide text-white text-xl">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            Test Project URL
          </CardTitle>
          <CardDescription className="font-rajdhani text-lg pl-12">
            Run a dry-run AI evaluation on your project. These results are for testing only and are <strong>not stored</strong> in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Input Form */}
            <div className="space-y-6">
              <form onSubmit={handleTest} className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Project URL</label>
                    <div className="relative group">
                      <Globe className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                      <Input
                        placeholder="https://your-project-demo.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="pl-10 glass-input font-rajdhani h-11 border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">GitHub Repository</label>
                    <div className="relative group">
                      <Github className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                      <Input
                        placeholder="https://github.com/username/repo"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="pl-10 glass-input font-rajdhani h-11 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Presentation Upload (Optional)</label>
                    <div className="relative group">
                      <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-orange-400 transition-colors" />
                      <Input
                        type="file"
                        accept=".ppt,.pptx,.pdf"
                        className="pl-10 glass-input font-rajdhani h-11 border-white/10 focus:border-orange-500/50 focus:ring-orange-500/20 pt-2"
                        onChange={(e) => setPptFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 font-mono">Max size: 10MB. Accepted: .ppt, .pptx, .pdf</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-orbitron tracking-wider h-11 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                    {isLoading ? 'ANALYZING...' : 'RUN AI EVALUATION'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column: Results */}
            <div className="relative min-h-[400px] rounded-xl border border-white/10 bg-black/20 p-6">
              <AnimatePresence mode="wait">
                {result && result.result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-xl font-orbitron font-bold text-white">AI Evaluation Preview</h3>
                      <span className="ml-auto text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">NOT SAVED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {scoreItems.map((item, index) => (
                        <motion.div 
                          key={item.label}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`rounded-xl p-3 text-center border ${item.bg} ${item.border} backdrop-blur-sm`}
                        >
                          <item.icon className={`w-4 h-4 mx-auto mb-2 ${item.color}`} />
                          <div className="text-xl font-bold text-white mb-1">{item.value}</div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex-grow">
                      <h4 className="font-bold mb-2 text-xs uppercase tracking-wider text-blue-400">AI Summary</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{result.result.summary}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-500">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Zap className="w-8 h-8 opacity-20" />
                    </div>
                    <h4 className="font-orbitron text-lg mb-2">Ready to Evaluate</h4>
                    <p className="text-sm max-w-xs mx-auto">Enter your project details on the left and run the evaluation to see instant AI feedback here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
