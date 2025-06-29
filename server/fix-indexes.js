const mongoose = require('mongoose');
require('dotenv').config();

async function fixCollaboratorIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('collaborators');

    // Drop all existing indexes that might conflict
    const indexesToDrop = [
      'weddingId_1_userId_1',
      'weddingId_1_email_1', 
      'userId_1'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await collection.dropIndex(indexName);
        console.log(`Dropped existing index: ${indexName}`);
      } catch (error) {
        console.log(`Index ${indexName} not found or already dropped`);
      }
    }

    // Create the correct indexes
    await collection.createIndex({ weddingId: 1, userId: 1 }, { sparse: true });
    console.log('Created sparse index on weddingId_1_userId_1');

    await collection.createIndex({ weddingId: 1, email: 1 }, { unique: true });
    console.log('Created unique index on weddingId_1_email_1');

    await collection.createIndex({ userId: 1 }, { sparse: true });
    console.log('Created sparse index on userId_1');

    console.log('All indexes updated successfully!');
  } catch (error) {
    console.error('Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixCollaboratorIndexes(); 
