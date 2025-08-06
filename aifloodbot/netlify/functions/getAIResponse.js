
const fetch = require('node-fetch');

exports.handler = async (event) => {
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  
  const { contents } = JSON.parse(event.body);

  
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key is not set on the server.' }),
    };
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google API Error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.error.message }),
      };
    }

    const result = await response.json();

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
         return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to extract text from Google API response.' }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
    
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
