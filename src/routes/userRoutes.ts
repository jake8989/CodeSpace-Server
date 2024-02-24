import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
const router = express.Router();
router.post(
	'/new-user',
	async (req: express.Request, res: express.Response) => {
		try {
			const { userId, name, email, password, strategy } = req.body;
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(password, 10);
			const user = {
				userId,
				name,
				email,
				password: hashedPassword,
				strategy,
			};
			console.log(user);
			const newUser = new User(user);
			newUser
				.save()
				.then(() => {
					return res.status(200).json({ message: 'User Created Successfully' });
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
	'/googleRequestHandler',
	async (req: express.Request, res: express.Response) => {}
);
router.get('/test-user', (req, res) => {
	res.send('Hii');
});
export default router;
