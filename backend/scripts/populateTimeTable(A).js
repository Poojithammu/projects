import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import Faculty from '../models/Faculty.js';
import Class from '../models/Class.js';
import User from '../models/User.js'; // adjust path as needed



const uri = 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB'; // change if needed

// Subject-to-faculty mapping
const facultyMap = {
    'R-PROG': 'Mr. G. Prasad',
    'STM': 'Mr. DSV Suryanarayana',
    'ML': 'Mrs. P. Jhansi Rani',
    'FLAT': 'Mrs. Shaik Saidabi',
    'AI': 'Mohammed Roqia Tabassum',
    'MINI-PROJECT': 'Mr.M. Venkateshwarlu',
    'ALRT': 'Mrs. Shaik Saidabi',
    'IELTS': 'Mrs. Shaik Saidabi',
};



// Timetable data
const timetableData = {
    Monday: ['R-PROG', 'STM', null, 'STM/ML - LAB', null, 'ALRT', 'ML'],
    Tuesday: ['FLAT', 'AI', null, 'MINI-PROJECT', null, 'STM', 'ALRT'],
    Wednesday: ['ML', 'R-PROG', null, 'AI/STM - LAB', null, 'ALRT', 'AI'],
    Thursday: ['ML/AI - LAB', null, 'ALRT', 'FLAT', null, 'MINI-PROJECT', 'STM', 'ML'],
    Friday: ['STM', 'R-PROG', null, 'AI', 'ALRT', null, 'FLAT', 'IELTS'],
    Saturday: ['AI', 'ML', null, 'FLAT', 'R-PROG', null]
};

// Time slots (excluding breaks/lunch for valid entries)
const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '10:50' },
    { start: '11:00', end: '11:50' },
    { start: '11:50', end: '12:40' },
    { start: '01:30', end: '02:20' },
    { start: '02:20', end: '03:10' },
    { start: '03:10', end: '04:00' }
];

const run = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected ✅');

        const classDoc = await Class.findOne({ name: 'CSE-A' });
        if (!classDoc) throw new Error('Class CSE-A not found');

        const facultyDocs = await Faculty.find({}).populate('user'); // pulls name from User
        const facultyMapByName = Object.fromEntries(
            facultyDocs
                .filter(f => f.user && f.user.name && f.user.name.trim() !== '')
                .map(f => [f.user.name.trim(), f._id])
        );
        console.log("Available faculty names from DB:");
        console.log(Object.keys(facultyMapByName));

        const invalidFaculty = facultyDocs.filter(f => !f.user || !f.user.name || f.user.name.trim() === '');
        if (invalidFaculty.length) {
            console.warn('⚠️ Faculty records missing user name:', invalidFaculty.map(f => f._id));
        }


        const entries = [];

        for (const [day, sessions] of Object.entries(timetableData)) {
            sessions.forEach((subject, index) => {
                if (!subject || !timeSlots[index]) return;

                // Handle labs like "STM/ML - LAB"
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
                            startTime: timeSlots[index].start,
                            endTime: timeSlots[index].end
                        });
                    } else {
                        console.warn(`Faculty not found for subject: ${cleanSub}`);
                    }
                });
            });
        }

        await Timetable.deleteMany({ classRef: classDoc._id }); // clean slate
        await Timetable.insertMany(entries);
        console.log(`Inserted ${entries.length} timetable entries for ${classDoc.name}`);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
};

run();
