const axios = require('axios');

async function testUserCreation() {
  try {
    const response = await axios.post('http://localhost:5000/users', {
      email: 'test@example4.com',
      password: 'testpassword123',
    });

    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
  }
}

testUserCreation();
