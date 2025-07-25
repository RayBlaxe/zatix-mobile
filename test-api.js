// Simple script to test API endpoint
const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('Testing API endpoint: https://api.zatix.id/api/login');
    
    const response = await axios.post('https://api.zatix.id/api/login', {
      email: 'crew.keren@zatix.id',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error details:');
    console.log('- Message:', error.message);
    console.log('- Code:', error.code);
    if (error.response) {
      console.log('- Status:', error.response.status);
      console.log('- Data:', error.response.data);
    } else if (error.request) {
      console.log('- No response received');
    }
  }
};

testLogin();
