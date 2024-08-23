import { sendChatIA } from '../../src/api/apiCohere.js';

// Função para lidar com solicitações de chat
export const chatController = async (req, res) => {
  try {
    const { message } = req.body; 

    if (!message) {
      return res.status(400).json({ error: "Mensagem não fornecida." });
    }

    const response = await sendChatIA(message);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
