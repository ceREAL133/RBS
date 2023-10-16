import { Request } from 'express';
import { Document } from 'mongoose';

export enum Roles {
	ADMINISTRATOR,
	BOSS,
	USER,
}

export interface IUser {
	name: String;
	email: String;
	password: String;
	role: Roles;
	bossId?: String;
}

export interface ILoginData {
	email: String;
	password: String;
}

export interface IUserDocument extends Document {
	name: string;
	email: string;
	password: string;
	role: Roles;
	bossId?: String;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserRequest extends Request {
	user: string;
}
