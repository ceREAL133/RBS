import { Express } from 'express';
import { healthcheck, login, registerUser } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { loginSchema, userSchema } from '../schemas/user.schema';
import { requiresUser } from '../middlewares/requiresUser';
import { changeRole } from '../controllers/user.controller';

export default function routes(app: Express) {
	app.get('/healthcheck', healthcheck);

	app.post('/register', validateRequest(userSchema), registerUser);
	app.post('/login', validateRequest(loginSchema), login);

	app.patch('/changerole/:id', requiresUser, changeRole);
}
