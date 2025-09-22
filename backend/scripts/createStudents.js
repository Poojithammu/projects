import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';

dotenv.config();
await mongoose.connect("mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB");

const defaultPassword = await bcrypt.hash('student123', 10);

// Default fields
const defaultDOB = new Date('2005-01-01');
const defaultAddress = 'Sphoorthy Engineering College';

// Format: [name, roll, email, department, phone, address]
const studentData = [
  ['K.Madhumitha', '23N81A0501', 'kmadhumitha2005@gmail.com', 'CSE', '9014628803', defaultAddress],
  ['A.Vaishnavi', '23N81A0502', 'addankivaishu@gmail.com', 'CSE', '9515344821', defaultAddress],
  ['E. Akshitha', '23N81A0503', 'erukalaakshitha@gmail.com', 'CSE', '8639462439', defaultAddress],
  ['Asupally Greeshma', '23N81A0504', 'asupallygreeshmabangari@gmail.com', 'CSE', '9052718551', defaultAddress],
  ['Haleema Sadiya', '23N81A0505', 'haleemasadiya578@gmail.com', 'CSE', '7330885159', defaultAddress],
  ['Gandham Kavya sudha', '23N81A0506', 'gadhamkavyasudha@gmail.com', 'CSE', '7981142186', defaultAddress],
  ['M.Divya', '23N81A0507', 'malothdivya92@gmail.com', 'CSE', '7207100950', defaultAddress],
  ['A Varshitha reddy', '23N81A0508', 'amireddysiri927@gmail.com', 'CSE', '9347825025', defaultAddress],
  ['A.bhavani', '23N81A0509', 'aerubhavani1705@gmail.com', 'CSE', '9063068040', defaultAddress],
  ['N.Ashwitha', '23N81A0510', 'ashwithareddy1212@gmail.com', 'CSE', '9553583341', defaultAddress],
  ['S.Chidrupi Reddy', '23N81A0511', 'sowdharychidrupir@gmail.com', 'CSE', '7013654335', defaultAddress],
  ['K. Meher Samraksh', '23N81A0512', 'itsmesamat101@gmail.com', 'CSE', '9292407577', defaultAddress],
  ['Mohd. Jaser', '23N81A0513', 'mohdjaser200412@gmail.com', 'CSE', '7337243990', defaultAddress],
  ['SILIVERU VAMSHI', '23N81A0514', 'siliveruvamshi08@gmail.co', 'CSE', '6309078921', defaultAddress],
  ['S. Srujan', '23N81A0515', 'sriramsrujan366@gmail.com', 'CSE', '6302537898', defaultAddress],
  ['PALLAPU RAMTEJA', '23N81A0516', 'pallapuramteja@gmail.com', 'CSE', '9985720394', defaultAddress],
  ['MUKKALA OMKAAR', '23N81A0517', 'omkaar110@gmail.com', 'CSE', '7780446478', defaultAddress],
  ['G.Yashwanth Kumar', '23N81A0518', 'bunnyyashwanth2005@gmail.com', 'CSE', '9014801878', defaultAddress],
  ['V.praveen', '23N81A0519', 'uppalpavan8@gmail.com', 'CSE', '6301717561', defaultAddress],
  ['M. Saifullah Khan', '23N81A0520', '080superbsaif080@gmail.com', 'CSE', '6281273199', defaultAddress],
  ['g.yashwanth reddy', '23N81A0521', 'gopuyashwanth2005@gmail.com', 'CSE', '6281731211', defaultAddress],
  ['Joel Jose', '23N81A0522', 'vava.joel123@gmail.com', 'CSE', '6281541294', defaultAddress],
  ['G.Hari Chandra Prasad', '23N81A0523', 'harichandraprasad8702@gmail.com', 'CSE', '8096645331', defaultAddress],
  ['C Alekhya Reddy', '23N81A0524', 'alekhyabhi15@gmail.com', 'CSE', '9391254588', defaultAddress],
  ['B.Harshitha', '23N81A0525', 'bellamkondaharshitha08@gmail.com', 'CSE', '9381442601', defaultAddress],
  ['A.Anushka', '23N81A0527', 'anushkav211@gmail.com', 'CSE', '8106993457', defaultAddress],
  ['B.Swathi', '23N81A0528', 'swathibaikani64@gmail.com', 'CSE', '7569161212', defaultAddress],
  ['R.Saisri', '23N81A0529', 'ranginenisaisri29@gmail.com', 'CSE', '9398235990', defaultAddress],
  ['V.Sanjana', '23N81A0530', 'vallepusanjana2@gamil.com', 'CSE', '7569396667', defaultAddress],
  ['S.Sowmya', '23N81A0531', 'sowmyaseelam2005@gmail.com', 'CSE', '9666240158', defaultAddress],
  ['G.lakshmi Narasimha', '23N81A0532', 'gnarasimha514@gmail.com', 'CSE', '9391760056', defaultAddress],
  ];

// Function to estimate year from roll
const getYearFromRoll = (roll) => {
  const yearPrefix = roll.slice(0, 2); // e.g., '23' → 2nd year in 2025
  const currentYear = new Date().getFullYear() % 100;
  return currentYear - parseInt(yearPrefix) + 1;
};

const uploadStudents = async () => {
  try {
    for (const [name, rollNumber, email, department, phone, address] of studentData) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`Skipping ${email} - already exists`);
        continue;
      }

      const user = await User.create({
        name,
        email,
        password: defaultPassword,
        role: 'student',
      });

      await Student.create({
        user: user._id,
        department,
        department_id: 'CSE01',
        year: getYearFromRoll(rollNumber),
        rollNumber,
        phone,
        address,
        date_of_birth: defaultDOB,
      });

      console.log(`Inserted student: ${name}`);
    }

    console.log('✅ All students uploaded');
    process.exit();
  } catch (err) {
    console.error('❌ Upload failed:', err);
    process.exit(1);
  }
};

uploadStudents();
