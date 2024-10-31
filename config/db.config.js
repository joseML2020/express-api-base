const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectDatabase() {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) { 
      await mongoose.disconnect();
      await mongoServer.stop();
      console.log('Desconectado de MongoDB');
  }
}

module.exports = { connectDatabase, disconnectDB };