import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace this with your actual Google Client ID
const GOOGLE_CLIENT_ID = '957774619795-d8j8nm7q0pa9eceg1t1nsimm7adugv6g.apps.googleusercontent.com';

export const GoogleProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}; 