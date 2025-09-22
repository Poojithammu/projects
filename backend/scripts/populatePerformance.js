// scripts/populatePerformance.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from '../models/Faculty.js';
import LeaveRequest from '../models/LeaveRequest.js';
import Timetable from '../models/Timetable.js';
import FacultyPerformance from '../models/FacultyPerformance.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB';
const TOTAL_WEEKS = 16;

// Map JS dates to weekdays
const getWeekday = (date) => {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

// Get unique weekdays between two dates
const getLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = new Set();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.add(getWeekday(new Date(d)));
  }

  return [...days];
};

async function populatePerformance() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const faculties = await Faculty.find();

    for (const faculty of faculties) {
      const facultyId = faculty._id;

      // Step 1: Get timetable entries for this faculty
      const timetable = await Timetable.find({ faculty: facultyId });
      const weeklyClassCount = timetable.length;
      const totalClassesHandled = weeklyClassCount * TOTAL_WEEKS;

      // Step 2: Find approved leaves
      const leaves = await LeaveRequest.find({ faculty: facultyId, status: 'approved' });

      let totalMissedClasses = 0;

      for (const leave of leaves) {
        const leaveDays = getLeaveDays(leave.startDate, leave.endDate);
        const missed = timetable.filter(entry => leaveDays.includes(entry.day)).length;
        totalMissedClasses += missed;
      }

      const attendanceRate =
        totalClassesHandled > 0
          ? ((totalClassesHandled - totalMissedClasses) / totalClassesHandled) * 100
          : 0;

      await FacultyPerformance.findOneAndUpdate(
        { facultyId },
        {
          classesHandled: totalClassesHandled,
          attendanceRate: attendanceRate.toFixed(2)
        },
        { new: true, upsert: true }
      );

      console.log(`🔄 Updated performance for faculty ${facultyId}`);
    }

    console.log('✅ Faculty performance population complete.');
    process.exit();
  } catch (err) {
    console.error('❌ Error populating faculty performance:', err);
    process.exit(1);
  }
}

populatePerformance();
