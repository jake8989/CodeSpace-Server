import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
const router = express.Router();
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import jwt from 'jsonwebtoken';
import Project from '../models/Project';
// import { nanoid } from 'nanoid';
// import ProjectType from '../models/Project';
router.post(
  '/create-new-project',
  async (req: express.Request, res: express.Response) => {
    const { project_id, owner_id, project_name, project_description, time } =
      req.body;
    ///an user cannot make same name projects

    // console.log(allProjects);
    // let exists = 0;
    // Project.find({ owner_id: owner_id })
    //   .then((projects) => {
    //     // console.log(projects);
    //     projects.forEach((project) => {
    //       if (project.project_name == project_name) {
    //         console.log('Found');
    //         exists = 1;
    //       }
    //       if (exists == 1) {
    //         return res
    //           .status(403)
    //           .json({ message: 'Project With Same Name Exists' });
    //       }
    //       // return;
    //     });
    //   })
    //   .catch((err) => {
    //     return res.status(502).json({ message: 'Error From Project Route' });
    //     // console.log(err);
    //   });
    // console.log(exists);

    try {
      const project = {
        project_id,
        owner_id,
        project_name,
        project_description,
        time,
      };

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
    } catch (error) {
      return res.status(500).json({ message: 'Server Error\n' });
    }
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
