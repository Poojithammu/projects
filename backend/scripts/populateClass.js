// populateClass.js

import mongoose from 'mongoose';
import Class from '../models/Class.js'; // Adjust the path if necessary

const uri = 'mongodb+srv://coderHarshaVardhan:12345@cluster0.ghygfei.mongodb.net/facultyDB'; // Change if your DB URI is different

const classes = [
  { name: 'CSE-A', department: 'CSE', year: 3 },
  { name: 'CSE-B', department: 'CSE', year: 3 },
  { name: 'CSE-C', department: 'CSE', year: 3 }
];

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await Class.deleteMany({}); // Optional: Clear existing classes
    const result = await Class.insertMany(classes);
    console.log('Classes inserted:', result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
  });
