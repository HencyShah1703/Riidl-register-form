import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDashboardData } from '../services/analyticsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riidl_attendance';

async function checkDashboard() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB.');

  const data = await getDashboardData(null, null, null, null);
  console.log('\n--- DASHBOARD OVERVIEW ---');
  console.log(JSON.stringify(data.overview, null, 2));

  console.log('\n--- COLLEGES CHART DATA (Top 5) ---');
  console.log(data.colleges.slice(0, 5));

  console.log('\n--- PURPOSE CHART DATA ---');
  console.log(data.purpose);

  console.log('\n--- VISITOR TYPES CHART DATA ---');
  console.log(data.visitorTypes);

  console.log('\n--- NEW USERS TREND (First 5) ---');
  console.log(data.newUsersTrend.slice(0, 5));

  console.log('\n--- PURPOSE DETAILS ---');
  console.log('To Meet:', data.purposeDetails.toMeet);
  console.log('Internships:', data.purposeDetails.internship);
  console.log('External Colleges:', data.purposeDetails.otherCollege);

  await mongoose.connection.close();
}

checkDashboard();
