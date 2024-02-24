import mongoose, { mongo } from 'mongoose';
interface UserType {
	userId: string;
	name: string;
	email: string;
	strategy: string;
}
const User = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		strategy: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);
export default mongoose.model<UserType>('User', User);
