import {ObjectId} from 'bson';
import {validationResult} from 'express-validator';
import {constants} from 'http2';

export class ClientError extends Error {
  constructor(message, public code?: number) {
    super(message);
  }
}

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(constants.HTTP_STATUS_BAD_REQUEST).json({errors: errors.array()});
  };
};

export const errorHandler = (app) => {
  app.use((err: Error, req, res, next) => {
    if (err instanceof ClientError) {
      return res.status(err.code || constants.HTTP_STATUS_BAD_REQUEST).json(err.message);
    }
    return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json(err.message);
  });
};

export function parseObjectId(id: string | ObjectId): ObjectId {
  try {
    return new ObjectId(id);
  } catch (e) {
    throw new ClientError('Bad mongo id!');
  }
}
