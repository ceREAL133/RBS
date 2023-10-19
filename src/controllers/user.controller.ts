import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { IUserDocument, Roles } from '../interfaces/users.interfaces';
import { userService } from '../services/user.service';

export const changeBossController = async (req: Request, res: Response) => {
	const currentUser = await userService.findUserById(req.userId);
	const { newBossId } = req.body;
	const { id } = req.params;

	try {
		// if this is the regular user or you are trying to change your own boss
		if (currentUser.role === Roles.USER || id === req.userId) {
			return res.status(403).send('forbidden');
		}

		const response = await userService.changeUserBoss(newBossId, id, currentUser);

		return res.status(200).send(response);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};

export const getUsersController = async (req: Request, res: Response) => {
	const user = await userService.findUserById(req.userId);

	try {
		const response = await userService.getUsers(user);

		return res.status(200).send(response);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};
