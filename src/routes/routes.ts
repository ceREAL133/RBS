import { Express } from 'express';
import { login, registerUser } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, userSchema } from '../schemas/user.schema';
import { requiresUser } from '../middlewares/requiresUser';
import { changeBossController, getUsersController } from '../controllers/user.controller';
import { validateIdFormat } from '../middlewares/validateId';

export default function routes(app: Express) {
	app.post('/register', validateRequest(userSchema), registerUser);
	app.post('/login', validateRequest(loginSchema), login);

	app.patch('/changeboss/:id', [validateIdFormat, requiresUser], changeBossController);
	app.get('/users', requiresUser, getUsersController);
}
