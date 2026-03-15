const mongoose = require('mongoose');
require('dotenv').config();

const AdminSchema = new mongoose.Schema({
  email: String,
});

const Admin = mongoose.model('Admin', AdminSchema);

async function checkAdmins() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const admins = await Admin.find({});
    console.log('Admins in DB:', JSON.stringify(admins, null, 2));
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkAdmins();
