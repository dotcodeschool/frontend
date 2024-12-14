import 'dotenv/config';
import { handler } from './dist/reminder-service.js';

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'SES_FROM_EMAIL', 'AWS_REGION'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`));
  console.error('\nPlease create a .env file based on .env.example');
  process.exit(1);
}

async function testHandler() {
  console.log('\n🚀 Testing reminder service...\n');
  
  console.log('Configuration:');
  console.log('- MongoDB URI:', process.env.MONGODB_URI.replace(/\/\/(.+?):/g, '//****:'));
  console.log('- SES From Email:', process.env.SES_FROM_EMAIL);
  console.log('- Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
  console.log('- AWS Region:', process.env.AWS_REGION);
  console.log('\nExecuting handler...\n');

  try {
    const result = await handler({}, {});
    console.log('✅ Test completed successfully!\n');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.body) {
      const body = JSON.parse(result.body);
      console.log('\nSummary:');
      console.log('- Reminders sent:', body.remindersSent.length);
      console.log('- Errors encountered:', body.errors.length);
      
      if (body.remindersSent.length > 0) {
        console.log('\nReminders sent to:');
        body.remindersSent.forEach(reminder => {
          console.log(`- ${reminder.email} (${reminder.courseName}, ${reminder.frequency})`);
        });
      }
      
      if (body.errors.length > 0) {
        console.log('\nErrors:');
        body.errors.forEach(error => {
          console.log(`- Repository ${error.repoId}: ${error.error}`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testHandler();
