const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Create a test user
        const testUser = await User.create({
            name: 'Test Admin',
            email: 'testadmin@freedomroad.com',
            password: 'Test@123456',
            phoneNumber: '+966501234567',
            address: 'Test Address',
            role: 'admin'
        });

        console.log('Test user created:', testUser);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createTestUser(); 