import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
const router = express.Router();
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import Project from '../models/Project';
router.post(
	'/create-new-project',
	(req: express.Request, res: express.Response) => {
		const { project_id, owner_id, project_name, time } = req.body;
		const project = { project_id, owner_id, project_name, time };
		const newProject = new Project(project);
		newProject
			.save()
			.then(() => {
				return res
					.status(200)
					.json({ newProject, message: 'Project Created Succefully' });
			})
			.catch(() => {
				return res.status(400).json({ message: 'Something Went Wrong' });
			});
	}
);
router.get(
	'/get-all-projects',
	async (req: express.Request, res: express.Response) => {
		try {
			const owner_id = req.query.owner_id;
			const allProjects = await Project.find({ owner_id: owner_id });
			return res.status(200).json({ allProjects });
		} catch (error) {
			return res.status(400).json({ message: 'Server Error' });
		}
	}
);
export default router;
