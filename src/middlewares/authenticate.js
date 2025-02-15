import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  console.log('Authenticate middleware executed');
  const authHeader = req.get('Authorization');
  console.log('Authorization header:', authHeader);
  if (!authHeader) {
    console.log('Authorization header is missing');
    return next(createHttpError(401, 'Please provide an Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    console.log('Invalid Authorization header format');
    return next(
      createHttpError(400, 'Authorization header should be of type Bearer'),
    );
  }

  console.log('Token received:', token);

  const session = await SessionsCollection.findOne({ accessToken: token });

  if (!session) {
    console.log('Session not found for token:', token);
    return next(createHttpError(401, 'Session not found'));
  }

  const isAccessTokenExpired = Date.now() > session.accessTokenValidUntil;

  if (isAccessTokenExpired) {
    console.log('Access token expired');
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await UsersCollection.findById(session.userId);

  if (!user) {
    console.log('User not found for session');
    return next(createHttpError(401, 'User not found'));
  }

  console.log('Authenticated user:', user);

  req.user = user;

  next();
};
