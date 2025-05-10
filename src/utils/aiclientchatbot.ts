import axios from 'axios';

const geminiApiKey = process.env.NEXT_PUBLIC_API_GENERATIVE_LANGUAGE_CLIENT;

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

let chatContext: ChatContext = {
  userName: null
};

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

  try {
    const response = await axios.post<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are Medigo AI, a medical assistant. Always address the user by name: ${chatContext.userName}. 
                Provide a helpful, concise medical response to: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0]?.content.parts[0]?.text || 'No response generated.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Sorry, I encountered an error processing your request.';
  }
};

export default apichat;