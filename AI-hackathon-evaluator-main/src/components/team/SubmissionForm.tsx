import React, { useState, useEffect } from 'react';
import { useBackend } from '../../context/BackendContext';
import { useToast } from '../ui/toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Github, Globe, CheckCircle, Send, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SubmissionForm() {
  const { currentUser, currentTeam, submitProject } = useBackend();
  const { showToast } = useToast();
  const team = currentTeam;

  const [url, setUrl] = useState('');
  const [github, setGithub] = useState('');
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // No pre-filling logic as requested

  // Reset success message and clear fields
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setUrl('');
        setGithub('');
        setPptFile(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (team) {
      setIsSubmitting(true);
      try {
        await submitProject(team.id, url, github, pptFile || undefined);
        setShowSuccess(true);
        showToast('Project submitted successfully!', 'success');
      } catch {
        showToast('Submission failed. Please check your inputs and try again.', 'error');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass-card border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
        <CardHeader>
          <CardTitle className="font-orbitron tracking-wide text-2xl text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-cyan-500" />
            Official Submission
          </CardTitle>
          <CardDescription className="font-rajdhani text-lg">
            Submit your deployed URL, GitHub repository, and presentation for evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-rajdhani font-bold mb-4"
                >
                  <CheckCircle className="w-5 h-5 inline-block mr-2" />
                  Submitted Successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="font-orbitron text-xs tracking-wider text-cyan-400">DEPLOYED URL</Label>
                <div className="relative group">
                  <Globe className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    id="url"
                    placeholder="https://your-project.com"
                    className="pl-10 h-12 glass-input font-rajdhani text-lg border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="font-orbitron text-xs tracking-wider text-purple-400">GITHUB REPOSITORY</Label>
                <div className="relative group">
                  <Github className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="github"
                    placeholder="https://github.com/username/repo"
                    className="pl-10 h-12 glass-input font-rajdhani text-lg border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ppt" className="font-orbitron text-xs tracking-wider text-yellow-400">PRESENTATION (PPT/PDF) UPLOAD</Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                  <Input
                    id="ppt"
                    type="file"
                    accept=".ppt,.pptx,.pdf"
                    className="pl-10 h-12 glass-input font-rajdhani text-lg border-white/10 focus:border-yellow-500/50 focus:ring-yellow-500/20 pt-2"
                    onChange={(e) => setPptFile(e.target.files ? e.target.files[0] : null)}
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-mono">Max size: 10MB. Accepted: .ppt, .pptx, .pdf</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-orbitron tracking-widest uppercase transition-all duration-300 border border-cyan-400/20 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
