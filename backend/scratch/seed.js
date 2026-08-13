import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Visitor from '../model/Visitor.js';
import Attendance from '../model/Attendance.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riidl_attendance';

const visitorsData = [
  { name: 'Hency Shah', email: 'hency.shah@somaiya.edu', phoneNumber: '9876543210', collegeName: 'K J Somaiya School of Engineering' },
  { name: 'Rohan Sharma', email: 'rohan.sharma@somaiya.edu', phoneNumber: '9812345678', collegeName: 'K J Somaiya Institute of Management' },
  { name: 'Priya Nair', email: 'priya.nair@gmail.com', phoneNumber: '9822334455', collegeName: 'S K Somaiya College' },
  { name: 'Vikram Singh', email: 'vikram.s@somaiya.edu', phoneNumber: '9833445566', collegeName: 'K J Somaiya School of Education' },
  { name: 'Ananya Desai', email: 'ananya.d@gmail.com', phoneNumber: '9844556677', collegeName: 'Somaiya School of Design' },
  { name: 'Dev Patel', email: 'dev.patel@somaiya.edu', phoneNumber: '9855667788', collegeName: 'K J Somaiya Polytechnic' },
  { name: 'Neha Mehta', email: 'neha.mehta@gmail.com', phoneNumber: '9866778899', collegeName: 'K J Somaiya College of Arts and Commerce' },
  { name: 'Sameer Sen', email: 'sameer.sen@gmail.com', phoneNumber: '9877889900', collegeName: 'K J Somaiya Institute of Technology' },
  { name: 'Rahul Verma', email: 'rahul.v@gmail.com', phoneNumber: '9888990011', collegeName: 'Somaiya Dhwani Chitram' },
  { name: 'Riya Shah', email: 'riya.shah@somaiya.edu', phoneNumber: '9899001122', collegeName: 'S K Somaiya College' }
];

const purposes = [
  'Meeting',
  'Seminar / Workshop',
  'Startup Incubation Discussion',
  'Lab Access / Project Work',
  'Co-working Space Member',
  'Mentorship Session',
  'Pitching Event'
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully!');

    // Drop both collections to reset indexes
    try {
      await mongoose.connection.db.dropCollection('visitors');
      console.log('Dropped visitors collection.');
    } catch (e) {
      console.log('visitors collection did not exist.');
    }

    try {
      await mongoose.connection.db.dropCollection('attendances');
      console.log('Dropped attendances collection.');
    } catch (e) {
      console.log('attendances collection did not exist.');
    }

    // 1. Create unique visitors
    const createdVisitors = await Visitor.insertMany(visitorsData);
    console.log(`Created ${createdVisitors.length} mock Visitor profiles.`);

    // 2. Create attendance check-in records spread over time
    const attendanceLogs = [];
    const now = new Date();

    const daysAgo = (num) => {
      const d = new Date(now);
      d.setDate(now.getDate() - num);
      d.setHours(Math.floor(Math.random() * 8) + 9, Math.floor(Math.random() * 60)); // business hours
      return d;
    };

    // -- Today check-ins (5 entries)
    for (let i = 0; i < 5; i++) {
      const visitor = createdVisitors[i % createdVisitors.length];
      attendanceLogs.push({
        visitor: visitor._id,
        purposeOfVisit: purposes[Math.floor(Math.random() * purposes.length)],
        location: 'Riidl HQ',
        timestamp: daysAgo(0)
      });
    }

    // -- This Week check-ins (10 entries: 1 to 6 days ago)
    for (let i = 0; i < 10; i++) {
      const visitor = createdVisitors[(i + 2) % createdVisitors.length];
      attendanceLogs.push({
        visitor: visitor._id,
        purposeOfVisit: purposes[Math.floor(Math.random() * purposes.length)],
        location: 'Riidl HQ',
        timestamp: daysAgo(Math.floor(Math.random() * 6) + 1)
      });
    }

    // -- This Month check-ins (15 entries: 7 to 29 days ago)
    for (let i = 0; i < 15; i++) {
      const visitor = createdVisitors[(i + 4) % createdVisitors.length];
      attendanceLogs.push({
        visitor: visitor._id,
        purposeOfVisit: purposes[Math.floor(Math.random() * purposes.length)],
        location: 'Riidl HQ',
        timestamp: daysAgo(Math.floor(Math.random() * 22) + 7)
      });
    }

    // -- Older check-ins this year & last year (15 entries: 31 to 450 days ago)
    for (let i = 0; i < 15; i++) {
      const visitor = createdVisitors[(i + 1) % createdVisitors.length];
      attendanceLogs.push({
        visitor: visitor._id,
        purposeOfVisit: purposes[Math.floor(Math.random() * purposes.length)],
        location: 'Riidl HQ',
        timestamp: daysAgo(Math.floor(Math.random() * 420) + 31)
      });
    }

    // Insert attendance entries
    const createdAttendance = await Attendance.insertMany(attendanceLogs);
    console.log(`Created ${createdAttendance.length} mock Attendance records successfully.`);

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed with error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seed();
