const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Wedding = require('./models/Wedding');
const Collaborator = require('./models/Collaborator');
const Guest = require('./models/Guest');
const Task = require('./models/Task');
const Message = require('./models/Message');
const WeddingRole = require('./models/WeddingRole');

async function clearDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to MongoDB. Clearing collections...');

  await Promise.all([
    User.deleteMany({}),
    Wedding.deleteMany({}),
    Collaborator.deleteMany({}),
    Guest.deleteMany({}),
    Task.deleteMany({}),
    Message.deleteMany({}),
    WeddingRole.deleteMany({}),
  ]);

  console.log('All collections cleared.');
  await mongoose.disconnect();
  process.exit(0);
}

clearDatabase().catch(err => {
  console.error('Error clearing database:', err);
  process.exit(1);
}); 