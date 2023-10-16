import { ILoginData, IUser, IUserDocument } from '../interfaces/users.interfaces';
import { User } from '../models/user.model';
import { sign } from 'jsonwebtoken';
import 'dotenv/config';

const secret = process.env.SECRET_KEY as string;

export class AuthService {
	async register(data: IUser): Promise<IUser> {
		const user = await User.create(data);

		return user;
	}

	async login(data: ILoginData) {
		const user = await this.validatePassword(data);

		const accessToken = this.createAccessToken(user.id);

		return { accessToken };
	}

	createAccessToken(id: string) {
		const accessToken = sign({ id }, secret, { expiresIn: '1h' });

		return accessToken;
	}

	async validatePassword(data: ILoginData): Promise<{ id: string }> {
		const user = await User.findOne({ email: data.email });

		if (!user) {
			throw new Error('User not found');
		}

		const isValid = await user.comparePassword(data.password as string);

		if (!isValid) {
			throw new Error("Passwords doesn't match");
		}

		const { _id } = user;

		return { id: _id };
	}
}

export const authService = new AuthService();
