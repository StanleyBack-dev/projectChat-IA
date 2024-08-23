import express from 'express';
import { chatController } from '../controllers/apiChatController.js';

// CREATE A ROUTER INSTANCE
const router = express.Router();

// DEFINE POST ROUTE FOR /CHAT THAT USES CHATCONTROLLER
router.post('/chat', chatController);

export default router;