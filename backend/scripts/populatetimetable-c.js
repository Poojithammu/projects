import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import Faculty from '../models/Faculty.js';
import Class from '../models/Class.js';
import User from '../models/User.js';

const uri = 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB'; // Change if needed

// CSE-C Subject-to-Faculty map
const facultyMap = {
  'ML': 'Dr. Kaja Masthan',
  'FLAT': 'Mrs. Shaik Saidabi',
  'AI': 'Mohammed Roqia Tabassum',
  'STM': 'Mr. DSV Suryanarayana',
  'R-PROG': 'Mr. G. Prasad',
  'MINI-PROJECT': 'Mr. M. Venkateshwarlu',
  'IELTS': 'Mrs. Shaik Saidabi',
  'ALRT': 'Mrs. Shaik Saidabi' // Assumed same as previous
};

// Time slots (with break & lunch as null)
const timeSlots = [
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '10:50' },
  null, // break
  { start: '11:00', end: '11:50' },
  { start: '11:50', end: '12:40' },
  null, // lunch
  { start: '01:30', end: '02:20' },
  { start: '02:20', end: '03:10' },
  { start: '03:10', end: '04:00' }
];

// Timetable data for CSE-C
const timetableData = {
  Monday:    ['ML/AI-LAB', null, null, 'ML', 'ALRT', null, 'FLAT', 'AI', 'LIBRARY'],
  Tuesday:   ['AI', 'R-PROG', null, 'FLAT', 'ALRT', null, 'ML', 'STM', 'MINI - PROJECT'],
  Wednesday: ['AI/STM-LAB', null, null, 'ML', 'ALRT', null, 'STM', 'FLAT', 'SPORTS'],
  Thursday:  ['FLAT', 'R-PROG', null, 'STM', 'ALRT', null, 'ML', 'MINI - PROJECT'],
  Friday:    ['R-PROG', 'AI', null, 'STM/ML-LAB', null, null, 'ALRT', 'IELTS'],
  Saturday:  ['R-PROG', 'STM', null, 'AI', 'ALRT', null, 'CLUB ACTIVITIES']
};

const run = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');

    const classDoc = await Class.findOne({ name: 'CSE-C' });
    if (!classDoc) throw new Error('Class CSE-C not found');

    const facultyDocs = await Faculty.find({}).populate('user');
    const facultyMapByName = Object.fromEntries(
      facultyDocs
        .filter(f => f.user?.name?.trim())
        .map(f => [f.user.name.trim(), f._id])
    );

    const entries = [];

    for (const [day, sessions] of Object.entries(timetableData)) {
      sessions.forEach((subject, index) => {
        const slot = timeSlots[index];
        if (!subject || !slot) return;

        const subjects = subject.includes('/') ? subject.split('/') : [subject];

        subjects.forEach(sub => {
          const cleanSub = sub.replace(' - LAB', '').trim();
          const facultyName = facultyMap[cleanSub];
          const facultyId = facultyMapByName[facultyName];

          if (facultyId) {
            entries.push({
              faculty: facultyId,
              subject: cleanSub,
              classRef: classDoc._id,
              day,
              startTime: slot.start,
              endTime: slot.end
            });
          } else {
            console.warn(`⚠️ Faculty not found for subject: ${cleanSub}`);
          }
        });
      });
    }

    await Timetable.deleteMany({ classRef: classDoc._id }); // clear existing
    await Timetable.insertMany(entries);
    console.log(`✅ Inserted ${entries.length} timetable entries for ${classDoc.name}`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.disconnect();
  }
};

run();
