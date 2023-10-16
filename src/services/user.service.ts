import { Roles } from '../interfaces/users.interfaces';
import { User } from '../models/user.model';

export class UserService {
	async changeUserRole(candidateId: string, newRole: Roles) {
		const candidate = await User.findById(candidateId);

		if (!candidate) {
			throw new Error('User not found');
		}

		const updatedCandidate = await User.findOneAndUpdate({ _id: candidateId }, { role: newRole });
		return updatedCandidate;
	}
}

export const userService = new UserService();
