// This script helps you get your admin token from the browser
// Run this in your browser console when logged in as admin

console.log('🔍 Getting your admin token...');

// Check localStorage
const localToken = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
if (localToken) {
  console.log('✅ Token found in localStorage:');
  console.log(localToken);
  console.log('\n📋 Copy this token and replace YOUR_ADMIN_TOKEN_HERE in the script');
}

// Check sessionStorage
const sessionToken = sessionStorage.getItem('token') || sessionStorage.getItem('authToken') || sessionStorage.getItem('jwt');
if (sessionToken) {
  console.log('✅ Token found in sessionStorage:');
  console.log(sessionToken);
  console.log('\n📋 Copy this token and replace YOUR_ADMIN_TOKEN_HERE in the script');
}

// Check for any token-like strings
const allKeys = [...Object.keys(localStorage), ...Object.keys(sessionStorage)];
const tokenKeys = allKeys.filter(key => 
  key.toLowerCase().includes('token') || 
  key.toLowerCase().includes('auth') || 
  key.toLowerCase().includes('jwt')
);

if (tokenKeys.length > 0) {
  console.log('🔍 Found these potential token keys:');
  tokenKeys.forEach(key => {
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (value && value.startsWith('eyJ')) {
      console.log(`✅ ${key}: ${value}`);
    }
  });
}

if (!localToken && !sessionToken) {
  console.log('❌ No token found. Make sure you are logged in as admin.');
  console.log('💡 Try logging out and logging back in as admin.');
}

console.log('\n📝 Instructions:');
console.log('1. Copy the token (starts with "eyJ...")');
console.log('2. Open add-personal-development-course.js');
console.log('3. Replace YOUR_ADMIN_TOKEN_HERE with your token');
console.log('4. Run: node add-personal-development-course.js'); 