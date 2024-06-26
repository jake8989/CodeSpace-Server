import mongoose, { mongo } from 'mongoose';
interface ProjectType {
  project_id: string;
  owner_id: string;
  project_name: string;
  viewers: string[];
  collaborators: string[];
  time: string;
}
const Project = new mongoose.Schema(
  {
    project_id: { type: String, required: true },
    owner_id: {
      type: String,
      required: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    project_description: {
      type: String,
    },
    viewers: {
      type: [String],
      default: [],
    },
    collaborators: {
      type: [String],
      default: [],
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model<ProjectType>('Project', Project);
