import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';

let token: { accessToken: string };

export const registerUser = async (req: Request, res: Response) => {
	try {
		const user = await authService.register(req.body);

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

/// dont forget to remove it
export const healthcheck = async (req: Request, res: Response) => {
	res.status(200).send('all good');
};
