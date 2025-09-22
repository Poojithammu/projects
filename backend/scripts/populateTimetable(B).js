import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import Faculty from '../models/Faculty.js';
import Class from '../models/Class.js';
import User from '../models/User.js';

const uri = 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB'; // adjust if needed

// Faculty map for CSE-B (2024-25 AY)
const facultyMap = {
    'ML': 'Mrs. P. Jhansi Rani',
    'FLAT': 'Mrs. Shaik Saidabi',
    'AI': 'Dr. Kaja Masthan',
    'STM': 'Mr. DSV Suryanarayana',
    'R-PROG': 'Mr. G. Prasad',
    'MINI-PROJECT': 'Dr. Kaja Masthan',
    'IELTS': 'Mrs. Shaik Saidabi',
    'ALRT': 'Mrs. Shaik Saidabi', // assuming as before
};

// Time slots
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

// Timetable data for CSE-B
const timetableData = {
    Monday: ['FLAT', 'AI', null, 'ALRT', 'R-PROG', null, 'ML', 'AI/STM-LAB'],
    Tuesday: ['STM/ML-LAB', null, null, 'ALRT', 'AI', null, 'STM', 'FLAT', 'SPORTS'],
    Wednesday: ['FLAT', 'ML', null, 'ALRT', 'STM', null, 'R-PROG', 'ML/AI-LAB'],
    Thursday: ['STM', 'AI', null, 'MINI-PROJECT', null, null, 'ALRT', 'ML', 'LIBRARY'],
    Friday: ['MINI-PROJECT', 'STM', null, 'ALRT', 'FLAT', null, 'R-PROG', 'IELTS'],
    Saturday: ['ML', 'R-PROG', null, 'ALRT', 'AI', null, 'CLUB ACTIVITIES']
};

const run = async () => {
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected');

        const classDoc = await Class.findOne({ name: 'CSE-B' });
        if (!classDoc) throw new Error('Class CSE-B not found');

        const facultyDocs = await Faculty.find({}).populate('user');
        const facultyMapByName = Object.fromEntries(
            facultyDocs
                .filter(f => f.user && f.user.name && f.user.name.trim() !== '')
                .map(f => [f.user.name.trim(), f._id])
        );

        const entries = [];

        for (const [day, sessions] of Object.entries(timetableData)) {
            sessions.forEach((subject, index) => {
                const slot = timeSlots[index];
                if (!subject || !slot) return;

                const isLab = subject.includes('LAB');
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

        await Timetable.deleteMany({ classRef: classDoc._id }); // clean existing entries
        await Timetable.insertMany(entries);
        console.log(`✅ Inserted ${entries.length} timetable entries for ${classDoc.name}`);
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
