// scripts/populateFeedbacks.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../models/Feedback.js';
import Faculty from '../models/Faculty.js';
import User from '../models/User.js';
import FacultyPerformance from '../models/FacultyPerformance.js';

dotenv.config(); // if you're using a .env file

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB';

const sampleComments = [
  'Great teaching!',
  'Needs improvement in delivery.',
  'Very engaging sessions.',
  'Clear explanations, loved the class!',
  'Could slow down a bit.',
  'Helpful and approachable.',
  'Excellent knowledge and examples.',
  'Sometimes hard to follow.',
  'Makes the subject interesting.',
  'Average performance.'
];

function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1; // 1 to 5
}

function getRandomComment() {
  return sampleComments[Math.floor(Math.random() * sampleComments.length)];
}

async function populateFeedbacks() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    const students = await User.find({ role: 'student' });
    const faculties = await Faculty.find();

    if (students.length < 1 || faculties.length < 1) {
      console.log('❌ Not enough data to generate feedbacks.');
      return;
    }

    for (const faculty of faculties) {
      for (let i = 0; i < 10; i++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const rating = getRandomRating();
        const comments = getRandomComment();

        const feedback = new Feedback({
          student: randomStudent._id,
          faculty: faculty._id,
          rating,
          comments
        });

        await feedback.save();
      }

      // Optional: Update FacultyPerformance
      const allFeedbacks = await Feedback.find({ faculty: faculty._id });
      const avgRating = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length;

      let performance = await FacultyPerformance.findOne({ facultyId: faculty._id });
      if (!performance) {
        performance = new FacultyPerformance({
          facultyId: faculty._id,
          feedbackScores: [avgRating]
        });
      } else {
        performance.feedbackScores = [avgRating];
      }

      await performance.save();
      console.log(`⭐ Feedbacks added and performance updated for faculty: ${faculty._id}`);
    }

    console.log('🎉 Feedback population complete!');
    process.exit();
  } catch (error) {
    console.error('❌ Error populating feedbacks:', error);
    process.exit(1);
  }
}

populateFeedbacks();
