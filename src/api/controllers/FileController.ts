import "reflect-metadata";
import {
    Controller,
    Post,
    Route,
    Request,
    Response,
    SuccessResponse,
    Tags,
} from "tsoa";
import ErrorResponse from "../contracts/responses/errorResponse";
import { IFileService } from "../../core/serviceInterfaces";
import { inject } from "inversify";
import { provideSingleton } from "../../util/provideSingleton";
import { logger } from "../../util/asyncLocalStorageLog";
import { handleFileLocal, handleFileS3 } from "../middlewares/fileUploadMiddleware";
import express from "express";

@provideSingleton(FileController)
@Route("api/v1/file")
@Tags("file")
export class FileController extends Controller {

    private readonly fileService: IFileService;

    constructor(
        @inject(Symbol.for("IFileService"))
        fileService: IFileService
    ) {
        super();

        this.fileService = fileService;
    }

    @Post("localdisk")
    @SuccessResponse("200", "OK")
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async uploadSingle(

        // Swagger does not detect this signature by default.
        // You will need to manually add it to the ./tsoa.json in the spec object.
        @Request() request: express.Request
    ): Promise<void> {

        const result = await handleFileLocal(request);
        logger.info(result);
    }

    @Post("s3")
    @SuccessResponse("200", "OK")
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async uploadMulti(
        @Request() request: express.Request
    ): Promise<void> {

        const result = await handleFileS3(request);
        logger.info(result);
    }
}