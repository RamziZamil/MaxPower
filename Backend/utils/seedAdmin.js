const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // First, check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@freedomroad.com' });
        
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@freedomroad.com',
            password: 'Admin@123456',
            phoneNumber: '+966501234567',
            address: 'Admin Address, Saudi Arabia',
            image: 'default-admin.jpg',
            role: 'admin'
        });

        console.log('Admin user created successfully:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin(); 