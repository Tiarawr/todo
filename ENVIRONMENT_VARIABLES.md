# Environment Variables Required for Deployment

This project requires the following environment variables to be set in your deployment environment (Vercel):

## Firebase Configuration
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Service account client email from Firebase
- `FIREBASE_PRIVATE_KEY` - Service account private key from Firebase (keep the \n newlines intact)

## Email Configuration (Brevo SMTP)
- `BREVO_USER` - Your Brevo SMTP username
- `BREVO_PASS` - Your Brevo SMTP password

## How to get Firebase credentials:
1. Go to Firebase Console
2. Project Settings > Service Accounts
3. Generate new private key
4. Use the values from the downloaded JSON file

## Setting up in Vercel:
1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add each variable with its corresponding value
4. Make sure to set them for Production, Preview, and Development environments

## Local Development:
Create a `.env.local` file in the root directory with:
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
BREVO_USER=your_brevo_username
BREVO_PASS=your_brevo_password
```

Note: Keep the `.env.local` file in `.gitignore` to avoid committing sensitive data.
