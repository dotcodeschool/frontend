# Practice Reminder Service

A Lambda function that sends practice reminder emails to users based on their preferred practice frequency settings.

## Overview

This service:
1. Checks all repositories with enabled reminders
2. Compares last practice date with user's frequency preference
3. Sends reminder emails via Amazon SES when practice is due

## Environment Variables

```
MONGODB_URI=mongodb://your-mongodb-connection-string
SES_FROM_EMAIL=notifications@yourdomain.com
FRONTEND_URL=https://dotcodeschool.com
```

## Deployment

1. Build the TypeScript code:
```bash
pnpm install
pnpm run build
```

2. Create a ZIP file containing:
- `dist/` directory (compiled JavaScript)
- `node_modules/` directory
- `package.json`

3. Upload to AWS Lambda:
- Runtime: Node.js 20.x
- Handler: dist/reminder-service.handler
- Memory: 256 MB (recommended)
- Timeout: 1-2 minutes (depending on your user base size)

## AWS Configuration

### IAM Permissions

The Lambda function needs these permissions:
1. SES permissions to send emails:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
    ]
}
```

2. CloudWatch Logs permissions (automatically added by AWS Lambda)

### EventBridge Schedule

Set up a scheduled trigger to run the function:

1. Daily schedule (recommended):
```
cron(0 12 * * ? *)  # Runs at 12:00 PM UTC every day
```

2. Or multiple times per day for different timezones:
```
cron(0 */12 * * ? *)  # Runs every 12 hours
```

## Testing

1. Enable SES sandbox mode for testing:
- Verify your test email addresses in SES
- Use these verified emails in your test environment

2. Test the function locally:
```bash
pnpm run build
node -e "require('./dist/reminder-service').handler({})"
```

## Monitoring

Monitor the function using CloudWatch:
- Error logs
- Success metrics (remindersSent count)
- Execution duration
- Memory usage

Set up CloudWatch Alarms for:
- Error rate
- Duration threshold (e.g., > 30 seconds)
- Failure rate

## Troubleshooting

Common issues:

1. MongoDB Connection:
- Check MONGODB_URI is correct
- Ensure Lambda has network access to MongoDB (VPC settings if needed)
- Verify MongoDB user permissions

2. SES Issues:
- Verify SES is out of sandbox mode for production
- Check email sending limits
- Verify FROM email is verified in SES

3. Timeouts:
- Increase Lambda timeout if processing large user base
- Consider batch processing for very large user bases

## Development

1. Install dependencies:
```bash
pnpm install
```

2. Build TypeScript:
```bash
pnpm run build
```

3. Local testing:
```bash
# Set environment variables
export MONGODB_URI="your-mongodb-uri"
export SES_FROM_EMAIL="your-verified-email"
export FRONTEND_URL="your-frontend-url"

# Run the function
node -e "require('./dist/reminder-service').handler({})"
