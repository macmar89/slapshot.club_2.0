import axios from 'axios';

const BACKEND_URL = 'http://localhost:4000/api/v1'; // Adjust if needed

async function testFeedback() {
  try {
    console.log('Testing feedback endpoint...');

    // We need an auth cookie or token if isAuth middleware is active.
    // If the server is running locally with session cookies, we might need a real session.
    // Let's try to send it and see if we get a 401 or the actual result.

    const response = await axios.post(
      `${BACKEND_URL}/feedback`,
      {
        type: 'idea',
        message: 'Test feedback from script',
        pageUrl: '/test',
      },
      {
        withCredentials: true,
      },
    );

    console.log('Response:', response.data);
  } catch (error: any) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testFeedback();
