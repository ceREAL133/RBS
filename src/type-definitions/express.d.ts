import { Express } from 'express-serve-static-core';

// i've changed default Express.Request type by adding userId param to it

declare module 'express-serve-static-core' {
	interface Request {
		userId: string;
	}
}
