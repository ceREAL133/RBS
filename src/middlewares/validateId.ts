import { Request, Response, NextFunction } from 'express';

const validIdRegex = /^[a-f\d]{24}$/i;

export const validateIdFormat = (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	if (!validIdRegex.test(id)) {
		return res.status(400).json({ error: 'Invalid Id format' });
	}

	next();
};
