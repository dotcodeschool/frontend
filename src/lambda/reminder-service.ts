import { Handler, Context } from 'aws-lambda';
import { MongoClient, ObjectId } from 'mongodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { differenceInDays, parseISO } from 'date-fns';

// Validate environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'SES_FROM_EMAIL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Types from lib/types/index.ts and lib/db/models/repositories.ts
type PracticeFrequencyOptions = "every_day" | "once_a_week" | "once_a_month";

type Relationship = {
  id: ObjectId;
  type: string;
};

type Repository = {
  _id: ObjectId;
  repo_name: string;
  repo_template: string;
  tester_url: string;
  test_ok?: boolean;
  relationships: Record<string, Relationship>;
  expected_practice_frequency: PracticeFrequencyOptions;
  is_reminder_enabled: boolean;
  lastEmailSent?: string; // ISO date string of when the last reminder email was sent
};

type Submission = {
  _id: ObjectId;
  repo_name: string;
  commit_sha: string;
  logstream_id: string;
  logstream_url: string;
  relationships: any[];
  created_at: string;
};

type User = {
  _id: ObjectId;
  email: string;
  name?: string;
};

// Configuration
const {
  MONGODB_URI,
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  SES_FROM_EMAIL,
  FRONTEND_URL = 'https://dotcodeschool.com'
} = process.env;

// Initialize clients
const sesClient = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!
  }
});

const mongoClient = new MongoClient(MONGODB_URI!);

const getFrequencyDays = (frequency: PracticeFrequencyOptions): number => {
  switch (frequency) {
    case 'every_day':
      return 1;
    case 'once_a_week':
      return 7;
    case 'once_a_month':
      return 30;
    default:
      return 30;
  }
};

const getFrequencyDisplay = (frequency: PracticeFrequencyOptions): string => {
  switch (frequency) {
    case 'every_day':
      return 'daily';
    case 'once_a_week':
      return 'weekly';
    case 'once_a_month':
      return 'monthly';
    default:
      return 'regular';
  }
};

const createEmailContent = (userName: string, courseName: string, frequency: PracticeFrequencyOptions) => {
  const frequencyDisplay = getFrequencyDisplay(frequency);
  
  return {
    Subject: {
      Data: `Time for your ${frequencyDisplay} ${courseName} practice!`
    },
    Body: {
      Html: {
        Data: `
          <html>
            <body>
              <h2>Hello ${userName || 'there'}!</h2>
              <p>It's time for your ${frequencyDisplay} practice session for ${courseName}.</p>
              <p>Regular practice is key to mastering programming skills. Why not take a few minutes today to work on a challenge?</p>
              <p>
                <a href="${FRONTEND_URL}/courses" style="display: inline-block; background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Practice Now</a>
              </p>
              <p>Happy coding!</p>
              <p>The Dot Code School Team</p>
              <p style="color: #666; font-size: 12px;">
                You received this email because you enabled practice reminders. 
                You can manage your notification preferences in your 
                <a href="${FRONTEND_URL}/settings">settings</a>.
              </p>
            </body>
          </html>
        `
      },
      Text: {
        Data: `Hello ${userName || 'there'}!\n\nIt's time for your ${frequencyDisplay} practice session for ${courseName}. Regular practice is key to mastering programming skills. Why not take a few minutes today to work on a challenge?\n\nVisit ${FRONTEND_URL}/courses to practice now.\n\nHappy coding!\nThe Dot Code School Team\n\nYou received this email because you enabled practice reminders. You can manage your notification preferences in your settings: ${FRONTEND_URL}/settings`
      }
    }
  };
};

export const handler: Handler = async (event: any, context: Context) => {
  console.log('Starting reminder service...');
  console.log('AWS Region:', AWS_REGION);
  console.log('SES From Email:', SES_FROM_EMAIL);
  console.log('Frontend URL:', FRONTEND_URL);

  try {
    await mongoClient.connect();
    console.log('Connected to MongoDB');
    
    const db = mongoClient.db();

    // Get all repositories with enabled reminders
    const repositories = await db
      .collection<Repository>('repositories')
      .find({ is_reminder_enabled: true })
      .toArray();

    console.log(`Found ${repositories.length} repositories with enabled reminders`);

    const remindersSent = [];
    const errors = [];

    for (const repo of repositories) {
      try {
        // Get the latest submission for this repository
        const latestSubmission = await db
          .collection<Submission>('submissions')
          .findOne(
            { repo_name: repo.repo_name },
            { sort: { created_at: -1 } }
          );

        const lastPracticeDate = latestSubmission
          ? parseISO(latestSubmission.created_at)
          : new Date(0);

        const daysSinceLastPractice = differenceInDays(
          new Date(),
          lastPracticeDate
        );

        const expectedFrequencyDays = getFrequencyDays(
          repo.expected_practice_frequency
        );

        // Calculate days since last email
        const lastEmailDate = repo.lastEmailSent
          ? parseISO(repo.lastEmailSent)
          : new Date(0);
        
        const daysSinceLastEmail = differenceInDays(
          new Date(),
          lastEmailDate
        );

        console.log(`Repository ${repo.repo_name}:`);
        console.log(`- ${daysSinceLastPractice} days since last practice (expected: ${expectedFrequencyDays})`);
        console.log(`- ${daysSinceLastEmail} days since last email`);

        // Check if reminder is needed AND enough time has passed since last email
        if (daysSinceLastPractice >= expectedFrequencyDays && daysSinceLastEmail >= expectedFrequencyDays) {
          console.log("Reminder needed");
          // Get user details
          const user = await db.collection<User>('users').findOne(
            { _id: repo.relationships.user.id }
          );

          console.log("user", user);

          if (!user?.email) {
            throw new Error(`No email found for user ${repo.relationships.user.id}`);
          }

          // Get course details
          const course = await db.collection('courses').findOne(
            { _id: repo.relationships.course.id },
            { projection: { name: 1 } }
          );

          const courseName = course?.name || 'coding';

          console.log(`Sending reminder to ${user.email} for ${courseName}`);

          try {
            // Send email
            const emailParams = {
              Destination: {
                ToAddresses: [user.email]
              },
              Message: createEmailContent(
                user.name || 'there',
                courseName,
                repo.expected_practice_frequency
              ),
              Source: SES_FROM_EMAIL
            };

            await sesClient.send(new SendEmailCommand(emailParams));
            console.log(`✅ Reminder sent to ${user.email}`);

            // Update lastEmailSent timestamp
            await db.collection<Repository>('repositories').updateOne(
              { _id: repo._id },
              { $set: { lastEmailSent: new Date().toISOString() } }
            );

            remindersSent.push({
              userId: user._id,
              email: user.email,
              courseName,
              frequency: repo.expected_practice_frequency
            });
          } catch (emailError) {
            console.error(`Failed to send email to ${user.email}:`, emailError);
            errors.push({
              repoId: repo._id,
              userId: user._id,
              email: user.email,
              error: emailError instanceof Error ? emailError.message : 'Failed to send email'
            });
          }
        }
      } catch (error) {
        console.error(`Error processing repository ${repo._id}:`, error);
        errors.push({
          repoId: repo._id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Reminder service executed successfully',
        remindersSent,
        errors,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error in reminder service:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Reminder service failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  } finally {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
};
