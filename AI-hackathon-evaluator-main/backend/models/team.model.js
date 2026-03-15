const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: String,
  univRollNo: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, required: true }
});

const teamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  collegeName: { type: String, required: true },
  members: [memberSchema],
  submissionUrl: String,
  submissionGithub: String,
  submissionPpt: String,
  aiScoreUi: Number,
  aiScoreInnovation: Number,
  aiScoreTechnical: Number,
  aiScorePerformance: Number,
  aiScoreAccessibility: Number,
  aiScoreFinal: Number,
  aiStrengths: [String],
  aiImprovements: [String],
  aiSummary: String,
  round1Score: { type: Number, default: 0 },
  round2Score: { type: Number, default: 0 },
  round3Score: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  shortlisted: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['pending_submission', 'pending_admin_review', 'ai_evaluated_pending_admin', 'published_to_team'],
    default: 'pending_submission'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Team', teamSchema);
