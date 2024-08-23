import dotenv from 'dotenv';
import { CohereClient } from "cohere-ai";

dotenv.config();

// FUNCTION TO INITIALIZE THE CLIENT API, SEND THE MESSAGE TO THE COHERE API AND RETURN DATA
const sendChatIA = async (message) => {
  try {

    const apiKey = process.env.API_KEY_COHERE;
    const cohere = new CohereClient({
      token: apiKey,
    });

    // START THE CHAT BY PASSING THE MESSAGE TO HIM
    const response = await cohere.chat({
      message: message,
    });

    // RETURNS ONLY THE RESPONSE TEXT
    return { response: response.text };

  } catch (error) {
    console.error("Error accessing AI CHAT:", error.message);
    throw error;
  }
};

export { sendChatIA };