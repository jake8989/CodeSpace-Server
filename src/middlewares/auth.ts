import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import express from 'express';

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: firebaseConfig.project_id,
		privateKey: firebaseConfig.private_key,
		clientEmail: firebaseConfig.client_email,
	}),
});
interface RequestWithuserId extends express.Request {
	userId: string;
}
async function decodeIdToken(
	req: RequestWithuserId,
	res: express.Response,
	next: express.NextFunction
) {
	try {
		const header = req.headers?.authorization;
		if (
			header !== 'Bearer' &&
			req.headers?.authorization?.startsWith('Bearer ')
		) {
			const idToken = req.headers.authorization.split('Bearer ')[1];
			console.log(idToken);
			const decodeToken: any = jwt.verify(idToken, process.env.JWT_SECRET);
			if (!decodeToken) {
				return res.status(401).json({ message: 'Error Authenticating' });
			}
			req.userId = decodeToken.userId;
			// console.log('Verified');
			// console.log(req.userId);
		} else {
			return res
				.status(401)
				.json({ message: 'Token Missing Please Login again to continue' });
		}
	} catch (error) {
		return res
			.status(401)
			.json({ message: 'Authentication Error Please login again to continue' });
	}
	next();
}
export default decodeIdToken;
