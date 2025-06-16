import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with absolute path
dotenv.config({ path: join(__dirname, '..', '.env') });

// Debug logging
console.log('Current working directory:', process.cwd());
console.log('All environment variables:', Object.keys(process.env));
console.log('Environment variables check:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
  NODE_ENV: process.env.NODE_ENV,
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  envPath: join(__dirname, '..', '.env')
});

if (!process.env.GOOGLE_CLIENT_ID) {
  console.error('GOOGLE_CLIENT_ID is not set in environment variables');
  console.error('Please check that your .env file exists and contains GOOGLE_CLIENT_ID');
  process.exit(1);
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Log client configuration (without sensitive data)
console.log('Google OAuth client configured with:', {
  clientId: process.env.GOOGLE_CLIENT_ID,
  hasClient: !!client
});

export default client; 