import { google } from 'googleapis';

export function getOAuthClient(accessToken, refreshToken) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  return oAuth2Client;
} 
