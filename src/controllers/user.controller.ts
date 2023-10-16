import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { IUserDocument } from '../interfaces/users.interfaces';
import { userService } from '../services/user.service';

export const changeRole = async (req: Request, res: Response) => {
	const { role } = (await User.findById(req.userId)) as IUserDocument;
	const { newRole } = req.body;
	const { id } = req.params;

	try {
		if (role === 2) {
			return res.status(403).send('forbidden');
		}
		const updatedUser = await userService.changeUserRole(id, newRole);

		return res.status(200).send(updatedUser);
	} catch (e: any) {
		return res.status(409).send(e.message);
	}
};
