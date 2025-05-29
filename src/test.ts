import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const testAuth = async () => {
  try {
    console.log('1. Testing registration with first user...');
    const registerResponse1 = await axios.post(`${API_URL}/auth/register`, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    console.log('Registration response:', registerResponse1.data);

    console.log('\n2. Testing duplicate registration (should fail)...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'differentpassword'
      });
    } catch (error: any) {
      console.log('Expected error:', error.response.data);
    }

    console.log('\n3. Testing login with wrong password (should fail)...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'john@example.com',
        password: 'wrongpassword'
      });
    } catch (error: any) {
      console.log('Expected error:', error.response.data);
    }

    console.log('\n4. Testing login with correct credentials...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.data);

    console.log('\n5. Testing registration with second user...');
    const registerResponse2 = await axios.post(`${API_URL}/auth/register`, {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456'
    });
    console.log('Registration response:', registerResponse2.data);

    console.log('\n6. Testing login with second user...');
    const loginResponse2 = await axios.post(`${API_URL}/auth/login`, {
      email: 'jane@example.com',
      password: 'password456'
    });
    console.log('Login response:', loginResponse2.data);

    console.log('\n7. Testing login with non-existent user (should fail)...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'password123'
      });
    } catch (error: any) {
      console.log('Expected error:', error.response.data);
    }

  } catch (error: any) {
    console.error('Unexpected error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
};

testAuth(); 