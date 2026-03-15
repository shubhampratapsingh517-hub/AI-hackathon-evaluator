const mongoose = require('mongoose');
require('dotenv').config();

const TeamSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: { type: String, select: true },
  collegeName: String,
  status: String,
});

const Team = mongoose.model('Team', TeamSchema);

async function checkTeams() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const teams = await Team.find({}, 'id name email status');
    console.log('Teams in DB:', JSON.stringify(teams, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkTeams();
