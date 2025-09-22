import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Faculty from '../models/Faculty.js';

dotenv.config();
await mongoose.connect("mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB");

// Faculty list
const facultyData = [
  { name: 'Dr. Kiran B.M (HOD)', phone: '9603899914', email: 'hodcse@sphoorthyengg.ac.in' },
  { name: 'Dr. Kaja Masthan', phone: '9100679246', email: 'kmasthan@sphoorthyengg.ac.in' },
  { name: 'Mr. G. Prasad', phone: '88851653541', email: 'prasadcs@sphoorthyengg.ac.in' },
  { name: 'Mohammed Roqia Tabassum', phone: '7036109678', email: 'troqia@sphoorthyengg.ac.in' },
  { name: 'Mrs. P. Jhansi Rani', phone: '9491303464', email: 'jhansirani@sphoorthyengg.ac.in' },
  { name: 'Mrs. D. Mamatha Reddy', phone: '7997928293', email: 'jhansirani@sphoorthyengg.ac.in' },
  { name: 'Mr. E. Kiran Kumar', phone: '9490947535', email: 'ekirankumar.cse@gmail.com' },
  { name: 'Mrs. Shaik Saidabi', phone: '9640408792', email: 'saidhashaik1419@gmail.com' },
  { name: 'Mr. DSV Suryanarayana', phone: '9666035667', email: 'suriyadesineedi@gmail.com' },
  { name: 'Mr.M. Venkateshwarlu', phone: '8309228736', email: 'mallikanti.venkat@sphoorthyengg.ac.in' },
];

const defaultPassword = await bcrypt.hash('faculty123', 10);

const uploadFacultyData = async () => {
  try {
    for (const fac of facultyData) {
      const existingUser = await User.findOne({ email: fac.email });
      if (existingUser) {
        console.log(`User with email ${fac.email} already exists. Skipping.`);
        continue;
      }

      const user = await User.create({
        name: fac.name,
        email: fac.email,
        password: defaultPassword,
        role: 'faculty',
      });

      const isHOD = fac.name.toLowerCase().includes('hod');

      await Faculty.create({
        user: user._id,
        department: 'CSE',
        department_id: 'CSE01',
        position: isHOD ? 'HOD' : 'Assistant Professor',
        salary: 50000,
        phone: fac.phone,
        address: 'Sphoorthy Engineering College',
        date_of_birth: new Date('1990-01-01'),
        hire_date: new Date('2020-06-01'),
      });

      console.log(`Inserted: ${fac.name}`);
    }

    console.log('All faculty data uploaded.');
    process.exit();
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
};

uploadFacultyData();
