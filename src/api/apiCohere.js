import { CohereClient } from "cohere-ai";
import dotenv from 'dotenv';

dotenv.config();

// Função para inicializar o cliente e enviar uma mensagem
const sendChatIA = async (message) => {
  try {
    const apiKey = process.env.API_KEY_COHERE;
    const cohere = new CohereClient({
      token: apiKey,
    });

    const response = await cohere.chat({
      message: message,
    });
    console.log(response);
    // Retorna apenas o texto da resposta
    return { response: response.text };
  } catch (error) {
    console.error("Erro ao acessar CHAT IA:", error.message);
    throw error;
  }
};

export { sendChatIA };
