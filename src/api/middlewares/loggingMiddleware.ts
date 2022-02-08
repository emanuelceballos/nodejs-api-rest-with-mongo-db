import express from "express";
import { asyncLocalStorage, logger } from "../../util/asyncLocalStorageLog";
import { v4 as uuidv4 } from "uuid";

export const loggingMiddleware = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
): Promise<void> => {

    const requestId: string = request.headers['x-request-id'] as string || uuidv4();
    response.setHeader('x-request-id', requestId);

    // There's a bug that prevents us from using 
    // asyncLocalStorage.run();
    asyncLocalStorage.enterWith({ requestId });

    const requestBody = request.method == "POST" || request.method == "PUT"
        ? ` - ${JSON.stringify(request.body)}`
        : "";
    logger.info(`${request.method} - ${request.originalUrl}${requestBody}`);

    return next();
}