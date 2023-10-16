import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../models/user.model';
import { IUser, IUserRequest } from '../interfaces/users.interfaces';

export const requiresUser = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization as string;

	if (!token) {
		return res.status(403).send('forbidden');
	}

	const { id } = verify(token, process.env.SECRET_KEY as string) as { id: string };

	if (!id) {
		return res.sendStatus(403);
	}

	const user = await User.findById(id);

	if (!id || !user) {
		return res.sendStatus(403);
	}

	req.userId = id;

	return next();
};
