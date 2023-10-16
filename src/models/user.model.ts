import mongoose from 'mongoose';
import { IUserDocument, Roles } from '../interfaces/users.interfaces';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: Number,
			enum: Roles,
			default: Roles.USER,
		},
		bossId: {
			type: String,
		},
	},
	{ versionKey: false }
);

userSchema.pre('save', async function (next: (err?: Error) => void) {
	const user = this as IUserDocument;
	if (!user.isModified('password')) return next();

	const salt = await bcrypt.genSalt(10);

	const hash = await bcrypt.hashSync(user.password, salt);

	user.password = hash;

	return next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
	const user = this as IUserDocument;

	return bcrypt.compare(candidatePassword, user.password).catch((e: any) => false);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);
