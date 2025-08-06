// --- SPECIAL DEBUGGING CODE ---
// This will not call Google. It only checks if the API key is available.

exports.handler = async (event) => {
  // Get the secret API key from the environment variables
  const apiKey = process.env.GOOGLE_API_KEY;

  let message = '';

  // Check if the key was found or not
  if (apiKey && apiKey.length > 5) {
    // For security, we only show the first 4 and last 4 characters.
    const partialKey = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
    message = `Success! The serverless function found the API key. It starts with "${partialKey}".`;
  } else {
    message = "Error: The serverless function could NOT find the GOOGLE_API_KEY. Please double-check the variable name and that you re-deployed the site.";
  }

  // Return the message to the front-end app
  return {
    statusCode: 200,
    body: JSON.stringify({ text: message }),
  };
};

