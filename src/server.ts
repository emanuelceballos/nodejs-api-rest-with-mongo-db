import express, { Application, Request, Response } from 'express';
import db from './repository/db/dbConnection';
import bodyParser from "body-parser";
import { RegisterRoutes } from "../dist/routes";
import customErrorsResponse from './api/customErrors/customErrorsResponse';
import swaggerUi from "swagger-ui-express";
import { loggingMiddleware } from './api/middlewares/loggingMiddleware';
import { logger } from './util/asyncLocalStorageLog';

db.connect();

const app: Application = express();

// Use body parser to read sent json payloads
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());

app.use(loggingMiddleware);

RegisterRoutes(app);

app.use("/swagger", swaggerUi.serve, async (_req: Request, res: Response) => {
    return res.send(
        swaggerUi.generateHTML(await import("../dist/swagger.json"))
    );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info('API REST up & running');

    customErrorsResponse(app);
});
