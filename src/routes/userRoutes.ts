import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
const router = express.Router();
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

router.post(
	'/new-user',
	async (req: express.Request, res: express.Response) => {
		try {
			const { userId, name, email, password, strategy } = req.body;
			const isUserExistsWithThisEmail = await User.findOne({ email });
			if (isUserExistsWithThisEmail) {
				return res.status(400).json({ message: 'Email Is Taken' });
			}
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = {
				userId,
				name,
				email,
				password: hashedPassword,
				strategy,
			};
			// console.log(user);

			const newUser = new User(user);
			newUser
				.save()
				.then(async () => {
					const clUser = { user: { email, token: genToken(userId) } };
					return res
						.status(200)
						.json({ clUser, message: 'User Created Successfully' });
				})
				.catch((err) => {
					console.log(err);
					return res.status(500).json({ message: 'Server Error!' });
				});
		} catch (error) {
			return res.status(400).json({ message: 'Server Error' });
		}
	}
);
router.post(
	'/login-user',
	async (req: express.Request, res: express.Response) => {
		try {
			const { userid, email, password } = req.body;
			const already: any = await User.findOne({ email: email });
			if (!already) {
				return res
					.status(400)
					.json({ message: 'No User Found With This Email' });
			}
			if (already.strategy !== 'LOCALEMAIL') {
				return res.status(400).json({ message: 'Invalid Platform!' });
			}
			// if (!bcrypt.compareSync(password, already.password)) {
			// 	return res
			// 		.status(400)
			// 		.json({ message: 'Email or password may be wrong' });
			// }
			const clUser = { user: { email, token: genToken(userid) } };
			return res
				.status(200)
				.json({ clUser, message: 'Logged In Successfully' });
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}
);

router.post(
	'/googleRequestHandler',
	async (req: express.Request, res: express.Response) => {
		const { userId, name, email, strategy, isNewAccount } = req.body;
		try {
			const findExistUser: any = await User.findOne({ userId: userId });
			if (!findExistUser && isNewAccount) {
				const user = {
					userId,
					name,
					email,
					strategy,
				};
				const newUser = new User(user);
				newUser
					.save()
					.then(async () => {
						const clUser = { user: { email, token: genToken(userId) } };
						if (newUser.strategy !== 'GOOGLE') {
							return res.status(401).json({ message: 'Invalid Platform' });
						}
						return res
							.status(200)
							.json({ clUser, message: 'User Created Successfully' });
					})
					.catch((err) => {
						console.log(err);
						return res.status(500).json({ message: 'Server Error!' });
					});
			} else {
				const clUser = { user: { email, token: genToken(userId) } };
				//protect

				return res.status(200).json({ clUser, message: 'Action Successfull' });
			}
		} catch (error) {
			return res.status(400).json({ message: error.message });
		}
	}
);
const genToken = (uid: string) => {
	const token = jwt.sign(
		{
			userId: uid,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '7d',
		}
	);
	return token;
};
router.get('/test-user', (req, res) => {
	res.send('Hii');
});
export default router;
