import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { transactionId } = req.params;

  if (!isValidObjectId(transactionId)) {
    return next(createHttpError(400, 'Id is not valid'));
  }

  next();
};
