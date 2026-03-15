const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/admin.model');
const Team = require('./models/team.model');

const app = express();
const server = http.createServer(app);
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register requests per window
  message: { error: 'Too many attempts, please try again later.' }
});

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
});

// Zod Schemas
const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  collegeName: z.string().min(2),
  members: z.array(z.object({
    name: z.string(),
    mobile: z.string().optional(),
    univRollNo: z.string(),
    course: z.string(),
    branch: z.string()
  })).optional()
});

const submissionSchema = z.object({
  url: z.string().url(),
  github: z.string().url()
});

// Middleware
app.use(generalLimiter);
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const teamId = req.params.id || 'anonymous';
    const ext = path.extname(file.originalname);
    cb(null, `ppt_${teamId}_${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.ppt' || ext === '.pptx' || ext === '.pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PPT, PPTX or PDF files are allowed'));
    }
  }
});

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'your-api-key-here');

// ============ DATABASE LAYER (MongoDB) ============
async function initDatabase() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// ============ DB HELPERS (Hybrid) ============

function formatTeamData(rawTeam) {
  if (!rawTeam) return null;

  const team = rawTeam.toObject ? rawTeam.toObject() : rawTeam;
  const teamMembers = team.members || [];

  return {
    ...team,
    members: teamMembers,
    submission: team.submissionUrl ? {
      url: team.submissionUrl,
      github: team.submissionGithub,
      ppt: team.submissionPpt || undefined
    } : null,
    aiResult: team.aiScoreFinal != null ? {
      scores: {
        ui: team.aiScoreUi,
        innovation: team.aiScoreInnovation,
        technical: team.aiScoreTechnical,
        performance: team.aiScorePerformance,
        accessibility: team.aiScoreAccessibility,
        final: team.aiScoreFinal
      },
      strengths: team.aiStrengths || [],
      improvements: team.aiImprovements || [],
      summary: team.aiSummary || ''
    } : null,
    round1Score: team.round1Score || 0,
    round2Score: team.round2Score || 0,
    round3Score: team.round3Score || 0,
    totalScore: team.totalScore || 0,
    shortlisted: !!team.shortlisted
  };
}

async function findAdminByEmail(email) {
  return await Admin.findOne({ email });
}

async function createAdmin(id, email, password) {
  return await new Admin({ email, password }).save();
}

async function findTeamByIdOrEmail(identifier) {
  return await Team.findOne({ $or: [{ email: identifier }, { id: identifier }] });
}

async function getTeamWithMembers(teamId) {
  const team = await Team.findOne({ id: teamId });
  return formatTeamData(team);
}

async function getAllTeams() {
  const teams = await Team.find().sort({ createdAt: -1 });
  return teams.map(t => formatTeamData(t));
}

// ============ Auth Middleware ============
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// ============ ROUTES ============

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const validatedData = teamSchema.parse(req.body);
    const { id, name, email, password, collegeName, members } = validatedData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teamId = id || Date.now().toString();

    const newTeam = new Team({
      id: teamId,
      name,
      email,
      password: hashedPassword,
      collegeName,
      members,
      status: 'pending_submission'
    });
    await newTeam.save();
    
    res.status(201).json({ message: 'Team registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = (role === 'admin') ? await findAdminByEmail(email) : await findTeamByIdOrEmail(email);

    if (!user) {
      console.log(`❌ Login attempt failed: User not found (${email})`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      console.log(`❌ Login attempt failed: Incorrect password for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id || user._id, role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id || user._id, name: user.name || 'Admin', role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Verify Token Route (for session persistence on page refresh)
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role === 'admin') {
      return res.json({ id, name: 'Admin', role });
    }
    
    const team = await Team.findOne({ id });
    if (!team) return res.status(404).json({ error: 'User not found' });
    return res.json({ id: team.id, name: team.name, role });
  } catch (err) {
    res.status(400).json({ error: 'Token verification failed' });
  }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    
    const team = await findTeamByIdOrEmail(email);
    if (!team) return res.status(404).json({ error: 'No account found with this email' });
    
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await Team.findOneAndUpdate({ email }, { password: hashedPassword });
    
    console.log(`🔑 Password reset for ${email}. Temporary password: ${tempPassword}`);
    res.json({ 
      success: true, 
      message: 'Password has been reset. Contact administrator for your new temporary password.',
      tempPassword 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/teams', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teams/:id/submit', authenticateToken, upload.single('pptFile'), async (req, res) => {
  if (req.user.role !== 'team' || req.user.id !== req.params.id) return res.status(403).json({ error: 'Access denied' });
  try {
    const validatedData = submissionSchema.parse(req.body);
    const { url, github } = validatedData;
    let pptPath = req.body.ppt;

    if (req.file) {
      pptPath = `/uploads/${req.file.filename}`;
    }

    console.log(`\n📤 [${new Date().toLocaleTimeString()}] Submission request for Team: ${req.params.id}`);
    const start = Date.now();

    await Team.findOneAndUpdate({ id: req.params.id }, {
      submissionUrl: url,
      submissionGithub: github,
      submissionPpt: pptPath,
      status: 'pending_admin_review'
    });

    console.log(`✅ [${new Date().toLocaleTimeString()}] Submission successful (Duration: ${Date.now() - start}ms)`);
    io.emit('leaderboard_update');
    res.json({ message: 'Submission successful' });
  } catch (err) {
    console.error(`❌ Submission failed:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

// ============ AI EVALUATION ENGINE ============
async function runAiEvaluation(teamName, submission) {
  console.log(`🔍 [${new Date().toLocaleTimeString()}] Validating URLs for ${teamName}...`);
  const [urlCheck, githubCheck] = await Promise.all([
    checkUrlAccessible(submission.url),
    checkGitHubRepo(submission.github)
  ]);

  let report = `Validation: URL ${urlCheck.accessible ? 'OK' : 'FAIL'}, GitHub ${githubCheck.valid ? 'OK' : 'FAIL'}`;
  console.log(`🤖 [${new Date().toLocaleTimeString()}] Prompting Gemini AI for ${teamName}...`);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash', // Updated to a more stable model name
    requestOptions: { timeout: 30000 }
  });

  const prompt = `Evaluate Hackathon Project. Team: ${teamName}. URL: ${submission.url}. GitHub: ${submission.github}. 
  Provide JSON only: { "scores": {"ui":N, "technical":N, "innovation":N, "performance":N, "accessibility":N}, "strengths":[], "improvements":[], "summary":"" }. 
  "ui": Score 0-100 for design/UX quality.
  "technical": Score 0-100 for code quality and complexity.
  "innovation": Score 0-100 for originality and problem-solving approach.
  "performance": Score 0-100 for load speed and responsiveness (simulated).
  "accessibility": Score 0-100 for WCAG compliance and inclusive design.
  If fraud or broken links, score very low. Current report: ${report}`;

  const result = await model.generateContent(prompt);
  const text = (await result.response).text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI failed to return valid JSON');

  const aiData = JSON.parse(jsonMatch[0]);

  // Ensure default structure
  return {
    scores: {
      ui: aiData.scores?.ui || 0,
      technical: aiData.scores?.technical || 0,
      innovation: aiData.scores?.innovation || 0,
      performance: aiData.scores?.performance || 0,
      accessibility: aiData.scores?.accessibility || 0,
      final: 0
    },
    strengths: aiData.strengths || [],
    improvements: aiData.improvements || [],
    summary: aiData.summary || ""
  };
}

// ============ URL Validation Helpers ============
async function checkUrlAccessible(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    clearTimeout(timeout);
    return { accessible: response.ok, statusCode: response.status };
  } catch (err) { return { accessible: false, statusCode: 0, error: err.message }; }
}

async function checkGitHubRepo(githubUrl) {
  try {
    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\s\?#]+)/);
    if (!match) return { valid: false, reason: 'Invalid GitHub URL format' };
    const apiUrl = `https://api.github.com/repos/${match[1]}/${match[2].replace('.git', '')}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return { valid: true, repoName: data.full_name, isEmpty: data.size === 0, updatedAt: data.pushed_at };
    }
    return { valid: false, reason: 'Repo not found or private' };
  } catch (err) { return { valid: false, reason: err.message }; }
}

app.post('/api/teams/:id/evaluate', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const team = await getTeamWithMembers(req.params.id);
    if (!team || (!team.submissionUrl && !team.submission)) return res.status(404).json({ error: 'No submission' });

    const submission = team.submission || { url: team.submissionUrl, github: team.submissionGithub, ppt: team.submissionPpt };
    const aiResult = await runAiEvaluation(team.name, submission);

    // Calculate final score using weights: UI (20%), Tech (30%), Innovation (30%), Perf (10%), Acc (10%)
    const finalScore = Math.round(
      (aiResult.scores.ui * 0.2) + 
      (aiResult.scores.technical * 0.3) + 
      (aiResult.scores.innovation * 0.3) +
      (aiResult.scores.performance * 0.1) +
      (aiResult.scores.accessibility * 0.1)
    );

    console.log(`💾 [${new Date().toLocaleTimeString()}] Saving AI results...`);
    await Team.findOneAndUpdate({ id: req.params.id }, {
      aiScoreUi: aiResult.scores.ui,
      aiScoreTechnical: aiResult.scores.technical,
      aiScoreInnovation: aiResult.scores.innovation,
      aiScorePerformance: aiResult.scores.performance,
      aiScoreAccessibility: aiResult.scores.accessibility,
      aiScoreFinal: finalScore,
      aiStrengths: aiResult.strengths,
      aiImprovements: aiResult.improvements,
      aiSummary: aiResult.summary,
      status: 'ai_evaluated_pending_admin'
    });

    res.json({ message: 'Evaluated', aiResult });
  } catch (err) {
    console.error(`❌ Evaluation failed:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/test-evaluate', authenticateToken, async (req, res) => {
  try {
    const { url, github, teamName } = req.body;
    if (!url || !github) return res.status(400).json({ error: 'URL and GitHub required' });

    console.log(`🧪 [${new Date().toLocaleTimeString()}] Starting DRY-RUN Evaluation...`);
    const aiResult = await runAiEvaluation(teamName || 'Test Team', { url, github });

    res.json({ success: true, aiResult });
  } catch (err) {
    console.error(`❌ Test evaluation failed:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/teams/:id/publish', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { round } = req.body;
    if (!round) return res.status(400).json({ error: 'Round number required' });

    const teamData = await getTeamWithMembers(req.params.id);
    if (!teamData || !teamData.aiResult) return res.status(404).json({ error: 'No evaluation results' });

    const score = teamData.aiResult.scores.final;
    const roundField = `round${round}Score`;

    const team = await Team.findOne({ id: req.params.id });
    team[roundField] = score;
    team.totalScore = (team.round1Score || 0) + (team.round2Score || 0) + (team.round3Score || 0);
    team.status = 'published_to_team';
    await team.save();

    res.json({ message: `Results published for Round ${round}` });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/teams/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { name, email, password, collegeName, members } = req.body;
    console.log(`📝 Updating team: ${req.params.id}`);

    const updateData = { name, email, collegeName, members };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // Handle Judge Score (Innovation)
    if (req.body.aiScoreInnovation !== undefined) {
      const team = await Team.findOne({ id: req.params.id });
      const ui = team.aiScoreUi || 0;
      const tech = team.aiScoreTechnical || 0;
      const perf = team.aiScorePerformance || 0;
      const acc = team.aiScoreAccessibility || 0;
      const innovation = Number(req.body.aiScoreInnovation);
      updateData.aiScoreInnovation = innovation;
      updateData.aiScoreFinal = Math.round((ui * 0.2) + (tech * 0.3) + (innovation * 0.3) + (perf * 0.1) + (acc * 0.1));
    }

    await Team.findOneAndUpdate({ id: req.params.id }, updateData);
    res.json({ message: 'Team updated successfully' });
  } catch (err) {
    console.error(`❌ Update failed:`, err.message);
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/teams/:id/shortlist', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { shortlisted } = req.body;
    await Team.findOneAndUpdate({ id: req.params.id }, { shortlisted: !!shortlisted });
    res.json({ message: `Team ${shortlisted ? 'shortlisted' : 'removed from shortlist'}` });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete Team
app.delete('/api/teams/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const result = await Team.findOneAndDelete({ id: req.params.id });
    if (!result) return res.status(404).json({ error: 'Team not found' });

    // Clean up uploaded files for this team
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir).filter(f => f.includes(req.params.id));
      files.forEach(f => fs.unlinkSync(path.join(uploadsDir, f)));
    }
    io.emit('leaderboard_update');
    console.log(`🗑️ Team ${req.params.id} deleted`);
    res.json({ message: 'Team deleted successfully' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await mongoose.connection.collection('announcements').find().sort({ createdAt: -1 }).toArray();
    res.json(announcements);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { title, content, type } = req.body;
    const result = await mongoose.connection.collection('announcements').insertOne({
      title, content, type: type || 'general', createdAt: new Date().toISOString()
    });
    const announcement = { id: result.insertedId, title, content, type: type || 'general' };
    io.emit('announcement', announcement);
    res.status(201).json(announcement);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete Announcement
app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { ObjectId } = require('mongoose').Types;
    await mongoose.connection.collection('announcements').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Announcement deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await mongoose.connection.collection('events').find().toArray();
    res.json(events);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { title, date, location, status } = req.body;
    await mongoose.connection.collection('events').insertOne({ 
      title, date, location, status: status || 'Active', 
      createdAt: new Date().toISOString() 
    });
    res.status(201).json({ message: 'Event created' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete Event
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const { ObjectId } = require('mongoose').Types;
    await mongoose.connection.collection('events').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Event deleted' });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Public Leaderboard (no auth required)
app.get('/api/leaderboard', async (req, res) => {
  try {
    let teams = await Team.find({ status: 'published_to_team' })
      .select('id name round1Score round2Score round3Score totalScore')
      .sort({ totalScore: -1 });
    res.json(teams.map(t => t.toObject()));
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/stats', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const teams = await getAllTeams();
    const stats = {
      totalTeams: teams.length,
      totalSubmissions: teams.filter(t => t.submission !== null).length,
      pendingReviews: teams.filter(t => t.status === 'pending_admin_review' || t.status === 'ai_evaluated_pending_admin').length,
      avgScoreRound1: teams.length ? Math.round(teams.reduce((acc, t) => acc + (t.round1Score || 0), 0) / teams.length) : 0,
      submissionTrend: [
        { name: 'R1 Submissions', value: teams.filter(t => t.round1Score > 0).length },
        { name: 'Pending AI', value: teams.filter(t => t.status === 'pending_admin_review').length },
        { name: 'Need Review', value: teams.filter(t => t.status === 'ai_evaluated_pending_admin').length }
      ]
    };
    res.json(stats);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/teams/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'team' || req.user.id !== req.params.id) return res.status(403).json({ error: 'Access denied' });
  try {
    const team = await getTeamWithMembers(req.params.id);
    res.json(team);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ============ Start Server ============
const start = async () => {
  await initDatabase();
  const admin = await findAdminByEmail('admin@hackathon.com');
  if (!admin) {
    const hashed = await bcrypt.hash('admin', 10);
    await createAdmin('admin-001', 'admin@hackathon.com', hashed);
    console.log('✅ Default admin created');
  }
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in MongoDB mode`);
  });
};

start();