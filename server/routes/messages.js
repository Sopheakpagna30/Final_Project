import express from 'express';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteConversation   // import the new controller function
} from '../controller/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticateToken, getConversations);
router.post('/conversations', authenticateToken, createConversation);
router.get('/conversations/:conversationId', authenticateToken, getMessages);
router.post('/conversations/:conversationId', authenticateToken, sendMessage);
// New DELETE route for deleting conversation by id
router.delete('/conversations/:id', authenticateToken, deleteConversation);

export default router;