import { sendChatIA } from '../../src/api/apiCohere.js';

// FUNCTION TO SEND THE MESSAGE TO THE CHAT API
const chatController = async (req, res) => {
  try {
    
    // GET THE MESSAGE PARAMETER FROM THE REQUEST BODY
    const { message } = req.body; 

    if (!message) {
      return res.status(400).json({ error: "Mensagem não fornecida." });
    }

    // CALL THE FUNCTION TO SEND THE MESSAGE TO THE API
    const response = await sendChatIA(message);
    res.json(response);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { chatController };