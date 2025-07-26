import express from 'express';
import { getAllUsersExceptCurrent } from '../controller/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsersExceptCurrent);

export default router;