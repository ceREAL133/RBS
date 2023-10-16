import Joi from 'joi';

const passwordPattern = new RegExp('^[a-zA-Z0-9]{3,30}$');

export const userSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'], deny: ['ru'] } })
		.required(),
	password: Joi.string().pattern(passwordPattern),
	role: Joi.number().min(0).max(2).default(2),
	bossId: Joi.string().hex().length(24),
});

export const loginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { deny: ['ru'] } })
		.required(),
	password: Joi.string().pattern(passwordPattern),
});
