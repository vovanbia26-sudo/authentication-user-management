const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-app');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed moderator user
const seedModerator = async () => {
  try {
    await connectDB();

    // Check if moderator already exists
    const existingModerator = await User.findOne({ email: 'moderator@test.com' });
    if (existingModerator) {
      console.log('Moderator user already exists');
      return;
    }

    // Create moderator user
    const moderatorUser = new User({
      name: 'Moderator User',
      email: 'moderator@test.com',
      password: '123456',
      role: 'moderator',
      avatar: 'https://via.placeholder.com/150?text=MOD'
    });

    await moderatorUser.save();
    console.log('✅ Moderator user created successfully');
    console.log('📧 Email: moderator@test.com');
    console.log('🔑 Password: 123456');
    console.log('👤 Role: moderator');

    // Create additional test users
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'user1@test.com',
        password: '123456',
        role: 'user'
      },
      {
        name: 'Test User 2',
        email: 'user2@test.com',
        password: '123456',
        role: 'user'
      },
      {
        name: 'Test Moderator 2',
        email: 'mod2@test.com',
        password: '123456',
        role: 'moderator'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n🎉 All test users created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@test.com / 123456');
    console.log('Moderator: moderator@test.com / 123456');
    console.log('Moderator 2: mod2@test.com / 123456');
    console.log('User 1: user1@test.com / 123456');
    console.log('User 2: user2@test.com / 123456');

  } catch (error) {
    console.error('Error seeding moderator:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeder
seedModerator();
