import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
const router = express.Router();
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

router.get('/test', (req: express.Request, res: express.Response) => {
	return res.status(200).json({ message: 'Hii Tester' });
});
export default router;
