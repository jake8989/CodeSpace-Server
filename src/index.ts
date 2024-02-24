import express, { Express } from 'express';
// import env from 'dotenv';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

import connectDb from './config/Db';
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRoutes);
app.get('/', (req, res) => {
	res.send('Hii Server Working');
});
app.use('/api/v1/users', userRoutes);
connectDb().then(() => {
	app.listen(8080, () => {
		console.log('Server Running...');
	});
});
