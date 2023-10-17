import { IUser, IUserDocument, Roles } from '../interfaces/users.interfaces';
import { User } from '../models/user.model';

export class UserService {
	async changeUserRole(candidateId: string, newRole: Roles) {
		return await User.findOneAndUpdate({ _id: candidateId }, { role: newRole }, { new: true });
	}

	async changeUserBoss(newBossId: string, id: string) {
		const user = await User.findById(id);
		let newBoss = await User.findById(newBossId);

		if (!user || !newBoss) {
			throw new Error('Not found');
		}

		if (newBoss.role === Roles.USER) {
			newBoss = await User.findByIdAndUpdate(newBossId, { role: Roles.BOSS }, { new: true });
		}

		const updatedUser = await User.findByIdAndUpdate(id, { bossId: newBossId }, { new: true });

		return { newBoss, user: updatedUser };
	}

	async getUsers(user: IUserDocument) {
		if (user.role === Roles.BOSS) {
			return await this.getUserSubordinates(user);
		} else if (user.role === Roles.ADMINISTRATOR) {
			return await User.find();
		} else {
			return await User.findById(user.id);
		}
	}

	async getUserSubordinates(user: IUserDocument) {
		const subordinates = await User.find({
			where: {
				bossId: user.id,
			},
		});
		const recursiveSubordinates: IUser[] = [];

		for (const subordinate of subordinates) {
			if (subordinate.role === Roles.BOSS) {
				const childSubordinates = await this.getUserSubordinates(subordinate);

				recursiveSubordinates.push(...childSubordinates);
			}
		}

		return [...subordinates, ...recursiveSubordinates];
	}
}

export const userService = new UserService();
