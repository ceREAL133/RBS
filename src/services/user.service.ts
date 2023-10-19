import { IUserDocument, Roles } from '../interfaces/users.interfaces';
import { User } from '../models/user.model';

export class UserService {
	async changeUserBoss(newBossId: string, id: string, currentUser: IUserDocument) {
		const user = await this.findUserById(id);
		let newBoss = await this.findUserById(newBossId);

		await this.validateChangePermissions(currentUser, user, newBoss);

		const updatedUser = await User.findByIdAndUpdate(id, { bossId: newBossId }, { new: true });

		newBoss = await this.updateNewBossRoleIfNeeded(newBoss);
		//we couldn't have situations where user haven't got bossId because the only user
		//without bossid is Adminstrator and he can't be changed
		const oldBossId = user.bossId as string;
		await this.updateOldBossRoleIfNeeded(oldBossId);

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

	async findUserById(id: string): Promise<IUserDocument> {
		const user = await User.findById(id);
		if (!user) {
			throw new Error('User is not found');
		}
		return user;
	}

	private async validateChangePermissions(currentUser: IUserDocument, user: IUserDocument, newBoss: IUserDocument) {
		const userSubordinates = await this.getUserSubordinates(user.id);
		if (currentUser.role === Roles.BOSS && user.bossId !== currentUser._id.toString()) {
			throw new Error('Not Allowed, boss can manipulate only with his subordinates');
		}
		if (userSubordinates.some((user) => user._id.toString() === newBoss.id)) {
			throw new Error("Not Allowed, new boss is this user's deep subordinate");
		}
	}

	private async updateOldBossRoleIfNeeded(oldBossId: string) {
		const oldBossHasSubordinates = await User.exists({ bossId: oldBossId });
		if (!oldBossHasSubordinates) {
			await this.changeUserRole(oldBossId, Roles.USER);
		}
	}

	private async updateNewBossRoleIfNeeded(newBoss: IUserDocument) {
		return newBoss.role === Roles.USER ? await this.changeUserRole(newBoss.id, Roles.BOSS) : newBoss;
	}

	private async getUserSubordinates(bossId: string): Promise<IUserDocument[]> {
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

	private async changeUserRole(candidateId: string, newRole: Roles): Promise<IUserDocument> {
		return (await User.findOneAndUpdate({ _id: candidateId }, { role: newRole }, { new: true })) as IUserDocument;
	}
}

export const userService = new UserService();
