import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { IUserDocument, Roles } from '../interfaces/users.interfaces';
import { userService } from '../services/user.service';

export const changeRoleController = async (req: Request, res: Response) => {
	const { role } = (await User.findById(req.userId)) as IUserDocument;
	const { newRole } = req.body;
	const { id } = req.params;

	try {
		if (role === Roles.USER || id === req.userId) {
			return res.status(403).send('forbidden');
		}
		const updatedUser = await userService.changeUserRole(id, newRole);

		return res.status(200).send(updatedUser);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};

export const changeBossController = async (req: Request, res: Response) => {
	const { role } = (await User.findById(req.userId)) as IUserDocument;
	const { newBossId } = req.body;
	const { id } = req.params;

	try {
		if (role !== Roles.ADMINISTRATOR || id === req.userId) {
			return res.status(403).send('forbidden');
		}

		const response = await userService.changeUserBoss(newBossId, id);

		return res.status(200).send(response);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};

export const getUsersController = async (req: Request, res: Response) => {
	const user = (await User.findById(req.userId)) as IUserDocument;

	try {
		const response = await userService.getUsers(user);

		return res.status(200).send(response);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};
