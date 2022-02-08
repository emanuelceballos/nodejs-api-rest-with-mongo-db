import { Application, Request, Response, NextFunction } from 'express';
import { ValidateError } from "tsoa";
import { logger } from '../../util/asyncLocalStorageLog';
import { ForbiddenError } from './forbiddenError';
import { UnauthorizedError } from './unauthorizedError';

const customErrorsResponse = (app: Application) => {

    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (err instanceof ValidateError) {

            logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);

            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }

        if (err instanceof UnauthorizedError) {
            return res.status(401).json({
                message: "Unauthorized",
                detail: err.message
            });
        }

        if (err instanceof ForbiddenError) {
            return res.status(403).json({
                message: "Forbidden",
                detail: err.message
            });
        }

        if (err instanceof Error) {

            logger.error(err.message);

            return res.status(500).json({
                message: "Internal Server Error",
                detail: err.message
            });
        }

        next();
    });

    app.use(function notFoundHandler(req: Request, res: Response) {
        res.status(404).send({
            message: "Not Found",
            detail: req.originalUrl
        });
    });
}

export default customErrorsResponse;