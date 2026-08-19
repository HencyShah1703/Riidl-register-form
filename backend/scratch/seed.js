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
  // Somaiya Colleges
  { name: 'Hency Shah', email: 'hency.shah@somaiya.edu', phoneNumber: '9876543210', collegeName: 'K J Somaiya School of Engineering', iAm: 'Student' },
  { name: 'Rohan Sharma', email: 'rohan.sharma@somaiya.edu', phoneNumber: '9812345678', collegeName: 'K J Somaiya Institute of Management', iAm: 'Faculty' },
  { name: 'Priya Nair', email: 'priya.nair@gmail.com', phoneNumber: '9822334455', collegeName: 'S K Somaiya College', iAm: 'Student' },
  { name: 'Vikram Singh', email: 'vikram.s@somaiya.edu', phoneNumber: '9833445566', collegeName: 'K J Somaiya School of Education', iAm: 'Faculty' },
  { name: 'Ananya Desai', email: 'ananya.d@gmail.com', phoneNumber: '9844556677', collegeName: 'Somaiya School of Design', iAm: 'Student' },
  { name: 'Dev Patel', email: 'dev.patel@somaiya.edu', phoneNumber: '9855667788', collegeName: 'K J Somaiya Polytechnic', iAm: 'Student' },
  { name: 'Neha Mehta', email: 'neha.mehta@gmail.com', phoneNumber: '9866778899', collegeName: 'K J Somaiya College of Arts and Commerce', iAm: 'Student' },
  { name: 'Sameer Sen', email: 'sameer.sen@gmail.com', phoneNumber: '9877889900', collegeName: 'K J Somaiya Institute of Technology', iAm: 'Student' },
  { name: 'Rahul Verma', email: 'rahul.v@gmail.com', phoneNumber: '9888990011', collegeName: 'Somaiya Dhwani Chitram', iAm: 'Other' },
  { name: 'Riya Shah', email: 'riya.shah@somaiya.edu', phoneNumber: '9899001122', collegeName: 'S K Somaiya College', iAm: 'Student' },
  { name: 'Pooja Hegde', email: 'pooja.h@somaiya.edu', phoneNumber: '9456789013', collegeName: 'K J Somaiya College of Science and Commerce', iAm: 'Student' },
  { name: 'Aarav Joshi', email: 'aarav.j@somaiya.edu', phoneNumber: '9554433221', collegeName: 'K J Somaiya Medical College and Research Centre', iAm: 'Student' },
  { name: 'Simran Kaur', email: 'simran.k@somaiya.edu', phoneNumber: '9665544332', collegeName: 'K J Somaiya Institute of Physiotherapy', iAm: 'Student' },

  // External Colleges / Organizations
  { name: 'Aditya Birla', email: 'aditya.birla@gmail.com', phoneNumber: '9123456780', collegeName: 'IIT Bombay', iAm: 'Startup Founder' },
  { name: 'Sneha Rao', email: 'sneha.rao@yahoo.com', phoneNumber: '9234567891', collegeName: 'DJ Sanghvi College of Engineering', iAm: 'Student' },
  { name: 'Karan Johar', email: 'karan.j@incubation.com', phoneNumber: '9345678902', collegeName: 'Mumbai University', iAm: 'VC & Angel Investors' },
  { name: 'Kabir Singh', email: 'kabir.s@gmail.com', phoneNumber: '9567890124', collegeName: 'Thadomal Shahani Engineering College', iAm: 'Industry Expert' },
  { name: 'Meera Kulkarni', email: 'meera.k@vjti.ac.in', phoneNumber: '9776655443', collegeName: 'VJTI Mumbai', iAm: 'Student' },
  { name: 'Tanmay Bhatt', email: 'tanmay.b@nmims.edu', phoneNumber: '9887766554', collegeName: 'NMIMS University', iAm: 'Student' },
  { name: 'Diya Merchant', email: 'diya.m@ictmumbai.edu.in', phoneNumber: '9998877665', collegeName: 'ICT Mumbai', iAm: 'Alumni' },
  { name: 'Yash Vardhan', email: 'yash.v@spit.ac.in', phoneNumber: '9112233445', collegeName: 'SPIT Mumbai', iAm: 'Student' },
  { name: 'Ishita Roy', email: 'ishita.r@gmail.com', phoneNumber: '9223344556', collegeName: 'BITS Pilani', iAm: 'Startup Founder' },
  { name: 'Varun Dhawan', email: 'varun.d@somaiya.edu', phoneNumber: '9334455667', collegeName: 'Somaiya Sports Academy', iAm: 'Faculty' },
  { name: 'Kavya Sharma', email: 'kavya.s@gmail.com', phoneNumber: '9445566778', collegeName: 'MIT Manipal', iAm: 'Student' },
  { name: 'Akash Gupta', email: 'akash.g@vc-fund.com', phoneNumber: '9556677889', collegeName: 'Stanford Alumni', iAm: 'VC & Angel Investors' }
];

const purposes = [
  'To Meet Someone',
  'Internship',
  'For Program/Event',
  'For Training / Workshop / Research',
  'For Facility Tour',
  'For Research Meetup',
  'For using the instrument'
];

const mentors = [
  'Dr. Gaurang Shetty',
  'Bhavna Pandya',
  'Makarand Joshi',
  'Dr. Radha Iyer',
  'Prof. Abhay Karandikar',
  'Dr. Hetal Mundra'
];

const peopleToMeet = [
  'CEO riidl',
  'Incubation Manager',
  'Lab Incharge',
  'Director',
  'Head of BioRiiDL',
  'FabLab Incharge'
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
      d.setHours(Math.floor(Math.random() * 8) + 9, Math.floor(Math.random() * 60)); // business hours 9am-5pm
      return d;
    };

    const randomDateInRange = (start, end) => {
      const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      d.setHours(Math.floor(Math.random() * 8) + 9, Math.floor(Math.random() * 60));
      return d;
    };

    const createCheckIn = (visitor, timestamp, forcePurpose = null) => {
      const purpose = forcePurpose || purposes[Math.floor(Math.random() * purposes.length)];
      const record = {
        visitor: visitor._id,
        purposeOfVisit: purpose,
        location: 'Riidl HQ',
        timestamp: timestamp
      };
      
      if (purpose === 'Internship') {
        record.mentorName = mentors[Math.floor(Math.random() * mentors.length)];
      } else if (purpose === 'To Meet Someone') {
        record.personToMeet = peopleToMeet[Math.floor(Math.random() * peopleToMeet.length)];
      }
      return record;
    };

    // Split visitors into cohorts to simulate realistic check-in patterns
    const cohort2024 = createdVisitors.slice(0, 6);
    const cohort2025 = createdVisitors.slice(6, 12);
    const cohort2026Older = createdVisitors.slice(12, 18);
    const cohortMonth = createdVisitors.slice(18, 22);
    const cohortWeek = createdVisitors.slice(22, 24);

    // 1. Year 2024 check-ins
    for (let i = 0; i < 40; i++) {
      const visitor = cohort2024[i % cohort2024.length];
      const start2024 = new Date('2024-01-01T09:00:00');
      const end2024 = new Date('2024-12-31T17:00:00');
      attendanceLogs.push(createCheckIn(visitor, randomDateInRange(start2024, end2024)));
    }

    // 2. Year 2025 check-ins
    const pool2025 = [...cohort2024, ...cohort2025];
    for (let i = 0; i < 60; i++) {
      const visitor = pool2025[i % pool2025.length];
      const start2025 = new Date('2025-01-01T09:00:00');
      const end2025 = new Date('2025-12-31T17:00:00');
      attendanceLogs.push(createCheckIn(visitor, randomDateInRange(start2025, end2025)));
    }

    // 3. Year 2026 check-ins (older than 30 days)
    const pool2026Older = [...cohort2024, ...cohort2025, ...cohort2026Older];
    for (let i = 0; i < 50; i++) {
      const visitor = pool2026Older[i % pool2026Older.length];
      const start2026 = new Date('2026-01-01T09:00:00');
      const end2026 = daysAgo(30);
      attendanceLogs.push(createCheckIn(visitor, randomDateInRange(start2026, end2026)));
    }

    // 4. This Month check-ins (7 to 29 days ago)
    const poolMonth = [...pool2026Older, ...cohortMonth];
    for (let i = 0; i < 30; i++) {
      const visitor = poolMonth[i % poolMonth.length];
      attendanceLogs.push(createCheckIn(visitor, daysAgo(Math.floor(Math.random() * 22) + 7)));
    }

    // 5. This Week check-ins (1 to 6 days ago)
    const poolWeek = [...poolMonth, ...cohortWeek];
    for (let day = 6; day >= 1; day--) {
      // Ensure daily check-ins for the week trend
      for (let k = 0; k < 4; k++) {
        const visitor = poolWeek[(day * 4 + k) % poolWeek.length];
        attendanceLogs.push(createCheckIn(visitor, daysAgo(day)));
      }
    }

    // 6. Today check-ins (0 days ago) - Ensure variety of purposes & check-ins
    const todayVisitors = [createdVisitors[0], createdVisitors[5], createdVisitors[10], createdVisitors[15], createdVisitors[20], createdVisitors[24]];
    for (let i = 0; i < todayVisitors.length; i++) {
      const visitor = todayVisitors[i];
      attendanceLogs.push(createCheckIn(visitor, daysAgo(0)));
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
