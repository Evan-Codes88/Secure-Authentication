import mongoose from 'mongoose';

describe('Database Tests', () => {
  
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/your-test-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  it('should connect to the database successfully', async () => {
    try {
      expect(mongoose.connection.readyState).toBe(1); // Check if connected
    } catch (error) {
      console.error('Database connection error:', error);
      throw error; // Fail the test if connection fails
    }
  }, 10000); // Timeout of 10 seconds
  
  afterAll(async () => {
    await mongoose.disconnect(); // Disconnect after tests
  });
});
