import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { HttpCode } from './constants';

export const passportHelpers = {
	authenticate: async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate('bearer', { session: false }, async function (err: Error, token: string) {
				if (err || !token) {
					return new Error('Unauthorized');
				} else {
					next();
				}
		})(req, res, next);
	},
	graphqlAuthentication: (req: Request, res: Response, next:NextFunction) => {
		const allowedOperations = ['getBooks', 'book', 'chaptersByBook', 'IntrospectionQuery'];
		passport.authenticate('bearer', { session: false }, function (err: Error, token: string) {
			try {
				if (err || !token || !allowedOperations.includes(req.body.operationName)) {
					return res.status(HttpCode.UNAUTHORIZED).send({
						success: false,
						message: 'Unauthorized.'
					});
				}
				next();
			} catch (err) {
				console.log(err);
			}
		})(req, res);
	},
	login: async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate('login', async function (err: Error, user: any, info: any) {
			try {
				if (err || !user) {
					return res.status(HttpCode.UNAUTHORIZED).send({
						success: false,
						message: (info && info.message) || 'Unauthorized'
					});
				}
				req.user = user;
				next();
			} catch (err) {
				console.log(err);
			}
		})(req, res, next);
	}
};
