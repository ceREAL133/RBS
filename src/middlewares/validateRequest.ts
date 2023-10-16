import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
	const { error } = schema.validate(req.body);

	if (error) {
		const errorMessage = error.details.map((detail) => detail.message).join('; ');
		console.error(errorMessage);
		return res.status(400).send(errorMessage);
	} else {
		return next();
	}
};
