// scripts/createAdminUser.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const uri = 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB'; // Change DB URI if needed

const createAdmin = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
    } else {
      const hashedPassword = await bcrypt.hash('12345678', 10); // Change password as needed

      const adminUser = new User({
        name: 'Admin',
        email: 'harsha@example.com',
        password: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user created successfully:', adminUser.email);
    }

    mongoose.disconnect();
  } catch (err) {
    console.error('Error creating admin user:', err);
    mongoose.disconnect();
  }
};

createAdmin();
