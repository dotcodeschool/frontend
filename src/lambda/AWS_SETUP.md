# AWS SES Setup Guide

Follow these steps to set up AWS SES for the reminder service:

## 1. Create an IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Name: `dot-code-school-reminder-service`
4. Click "Next"
5. Select "Attach policies directly"
6. Create a new policy:
   - Click "Create policy"
   - Switch to JSON editor
   - Paste this policy:
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
   - Name it: `DotCodeSchoolSESPolicy`
7. Attach the created policy to the user
8. Click through to create the user
9. **Important**: Save the Access Key ID and Secret Access Key shown at the end

## 2. Verify Email in SES

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Ensure you're in the correct region (us-east-1)
3. Click "Verified identities" → "Create identity"
4. Choose "Email address"
5. Enter the email you want to use for sending reminders
6. Click "Create identity"
7. Check your email and click the verification link

## 3. Configure AWS Credentials Locally

1. Install AWS CLI if you haven't:
   ```bash
   brew install awscli
   ```

2. Configure AWS credentials:
   ```bash
   aws configure
   ```
   Enter:
   - AWS Access Key ID from step 1
   - AWS Secret Access Key from step 1
   - Default region: us-east-1
   - Default output format: json

## 4. Update Environment Variables

Update your .env file with:
```
AWS_REGION="us-east-1"
SES_FROM_EMAIL="your-verified@email.com"  # The email you verified in step 2
```

## 5. Test the Setup

1. First, test AWS credentials:
   ```bash
   aws sts get-caller-identity
   ```
   You should see your AWS account info.

2. Then run the reminder service test:
   ```bash
   cd src/lambda
   node test.js
   ```

## Notes

- SES starts in sandbox mode, which only allows sending to verified email addresses
- To move out of sandbox mode for production, you'll need to request production access from AWS
- In sandbox mode, both sender and recipient emails must be verified
