import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { User } from '../models/user.model';
import { IUserDocument, Roles } from '../interfaces/users.interfaces';

let token: { accessToken: string };

export const registerUser = async (req: Request, res: Response) => {
	try {
		const admin = (await User.findOne({ role: Roles.ADMINISTRATOR })) as IUserDocument;
		const bossId = req.body.bossId ?? admin.id;

		const user = await authService.register({ ...req.body, bossId });

		return res.status(200).send(user);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		token = await authService.login(req.body);

		return res.status(200).send(token);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};

export const addHeader = (req: Request, res: Response, next: NextFunction) => {
	if (!token) {
		console.log('token: undefined');
	} else {
		req.headers.authorization = token.accessToken;
	}

	next();
};
