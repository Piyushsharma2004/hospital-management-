import axios from 'axios';

// Ensure the API key is being loaded correctly.
// Note: NEXT_PUBLIC_ variables are only available in browser-side code in Next.js.
// If this runs on the server, it should be process.env.YOUR_SERVER_SIDE_API_KEY
const geminiApiKey = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT ||"AQ.Ab8RN6LN2n3HZdt5C6jK2v2vOg0ew5sywsNCOGmad5j-1D3_9g";

// Define the correct response structure from the Generative Language API
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

interface ChatContext {
  userName: string | null;
}

// This context will reset every time the serverless function spins up.
// For persistent context, you would need a database or session management.
let chatContext: ChatContext = {
  userName: null
};

/**
 * Sends a prompt to the Gemini API using the Google Generative Language endpoint.
 * @param prompt The user's message.
 * @returns A string response from the AI or a contextual message.
 */
const apichat = async (prompt: string): Promise<string> => {
  // Validate message length
  if (prompt.length > 100) {
    return 'Please keep your message under 100 words.';
  }

  // Check if user name is set
  if (!chatContext.userName) {
    // If the prompt seems like a name, set it
    if (prompt.trim().split(' ').length === 1 && prompt.length > 1) {
      chatContext.userName = prompt.trim();
      return `Nice to meet you, ${chatContext.userName}! How can I help you today?`;
    }
    
    // If no name is set, prompt for name
    return 'Before we begin, could you tell me your name?';
  }

  // --- FIXES START HERE ---

  // 1. FIX: Use the correct Google Generative Language API endpoint and a compatible model.
  // We use :generateContent (non-streaming) because the axios call expects a single JSON response.
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${geminiApiKey}`;

  // 2. FIX: Structure the payload correctly for the Generative Language API.
  // The system prompt goes into `systemInstruction`, and the user prompt goes into `contents`.
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }] // The user's direct message
      }
    ],
    systemInstruction: {
      parts: [
        {
          // The persistent instructions for the model
          text: `You are Medigo AI, a medical assistant. Always address the user by name: ${chatContext.userName}. Provide a helpful, concise medical response.`
        }
      ]
    },
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7
    }
  };

  // --- FIXES END HERE ---

  try {
    const response = await axios.post<GeminiResponse>(
      apiUrl,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the text from the correct response structure
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return text || 'Sorry, I received a response, but it was empty.';

  } catch (error:any) {
    console.error('Gemini API Error:', error.response ? error.response.data : error.message);
    
    // Check for specific API key error
    if (error.response && error.response.status === 400) {
      return 'Sorry, there might be an issue with the API key. Please check the console.';
    }
    
    return 'Sorry, I encountered an error processing your request.';
  }
};

export default apichat;