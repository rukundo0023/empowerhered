import { sendWelcomeEmail } from './utils/SendWelcomeEmail.js';

sendWelcomeEmail({ name: 'Test User', email: 'clevisrukundo@gmail.com' })
  .then(() => console.log('Test email sent!'))
  .catch(error => console.error('Failed to send email:', error));
