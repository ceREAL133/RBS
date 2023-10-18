import { IUserDocument, Roles } from '../interfaces/users.interfaces';
import { User } from '../models/user.model';

export class UserService {
	async changeUserBoss(newBossId: string, id: string, currentUser: IUserDocument) {
		const user = (await User.findById(id)) as IUserDocument;
		let newBoss = await User.findById(newBossId);
		const oldBossId = user?.bossId as string; //we couldn't have situations where user havent got bossId because the only user without bossid is Adminstrator and he can't change

		const userSubordinates = await this.getUserSubordinates(id);

		if (currentUser.role === Roles.BOSS && user.bossId !== currentUser._id.toString()) {
			throw new Error('Not Allowed, boss can manipulate only with his subordinates');
		}

		if (userSubordinates.some((user) => user._id.toString() === newBossId)) {
			throw new Error("Not Allowed, new boss is this user's deep subordinate");
		}

		if (!user || !newBoss) {
			throw new Error('Not found');
		}

		if (newBoss.role === Roles.USER) {
			newBoss = await User.findByIdAndUpdate(newBossId, { role: Roles.BOSS }, { new: true });
		}

		const updatedUser = await User.findByIdAndUpdate(id, { bossId: newBossId }, { new: true });

		const oldBossHasSubordinates = await User.exists({ bossId: oldBossId });

		if (!oldBossHasSubordinates) {
			await this.changeUserRole(oldBossId, Roles.USER);
		}

		return { newBoss, user: updatedUser };
	}

	async getUsers(user: IUserDocument) {
		if (user.role === Roles.BOSS) {
			return {
				boss: user,
				subordinates: await this.getUserSubordinates(user.id),
			};
		} else if (user.role === Roles.ADMINISTRATOR) {
			return await User.find();
		} else {
			return await User.findById(user.id);
		}
	}

	async getUserSubordinates(bossId: string): Promise<IUserDocument[]> {
		const subordinates = await User.find({ bossId });

		const recursiveSubordinates: IUserDocument[] = [];

		for (const subordinate of subordinates) {
			if (subordinate.role === Roles.BOSS) {
				const childSubordinates = await this.getUserSubordinates(subordinate.id);

				recursiveSubordinates.push(...childSubordinates);
			}
		}

		return [...subordinates, ...recursiveSubordinates];
	}

	async changeUserRole(candidateId: string, newRole: Roles) {
		return await User.findOneAndUpdate({ _id: candidateId }, { role: newRole }, { new: true });
	}
}

export const userService = new UserService();
