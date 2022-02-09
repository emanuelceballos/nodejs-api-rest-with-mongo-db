import "reflect-metadata";
import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Path,
    Route,
    SuccessResponse,
    Res,
    Response,
    Security,
    Tags,
    TsoaResponse,
} from "tsoa";
import UserEntity from '../../core/entities/UserEntity';
import ErrorResponse from "../contracts/responses/errorResponse";
import UserResponse from "../contracts/responses/userResponse";
import UserRequest from "../contracts/requests/userRequest";
import UserUpdateRequest from "../contracts/requests/userUpdateRequest";
import { IUserService } from "../../core/serviceInterfaces";
import { inject } from "inversify";
import { provideSingleton } from "../../util/provideSingleton";
import { logger } from "../../util/asyncLocalStorageLog";

@provideSingleton(UserController)
@Route("api/v1/user")
@Tags("user")
export class UserController extends Controller {

    private readonly userService: IUserService;

    constructor(
        @inject(Symbol.for("IUserService"))
        userService: IUserService
    ) {
        super();

        this.userService = userService;
    }

    /**
     * Gets all users from the DB filtered by their status, only active users are returned.
     * @summary Returns all active users.
     */
    @Get("")
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async getUsers(): Promise<UserResponse[]> {

        const users: UserEntity[] = await this.userService.listActiveUsers();

        if (users) {

            let usersResponse: UserResponse[] = [];
            users.map((u: UserEntity, i: number) => {
                usersResponse[i] = {
                    _id: u.id,
                    email: u.email,
                    name: u.name
                };
            });

            logger.info(`Total active users: ${usersResponse.length}`);
            return usersResponse;
        }

        return null as any;
    }

    @Post("")
    @SuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, 'User already exists.')
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async createUser(@Body() userRequest: UserRequest, @Res() userExists: TsoaResponse<400, ErrorResponse>): Promise<void> {

        const user: UserEntity | null = await this.userService.findByEmail(userRequest.email);

        if (user != null) {
            return userExists(400, {
                error: "User already exists."
            });
        }

        const created: boolean = await this.userService.createUser(userRequest);

        if (created) {
            return this.setStatus(201);
        }

        return this.setStatus(400);
    }

    @Put("{email}")
    @SuccessResponse("204", "No content")
    @Response(404, 'Not found')
    @Response(400, 'Bad request')
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async updateUser(@Path() email: string, @Body() userRequest: UserUpdateRequest): Promise<void> {

        const user: UserEntity | null = await this.userService.findByEmail(email);

        if (!user) {
            return this.setStatus(404);
        }

        const updatedUser: boolean = await this.userService.updateUser(email, userRequest);

        if (updatedUser == null) {
            return this.setStatus(400);
        }

        return;
    }

    /**
     * This endpoint doesn't physically delete users from the DB, it flags them as inactive instead.
     * @summary Performs a soft delete on the user.
     */
    @Delete("{email}")
    // In case scopes are required in security:
    // @Security("jwt", ["admin"])
    @Security("api_key")
    @SuccessResponse("204", "No content")
    @Response(400, 'Bad request')
    @Response(401, 'Unauthorized')
    @Response(404, 'Not found')
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async deleteUser(@Path() email: string): Promise<void> {

        const user: UserEntity | null = await this.userService.findByEmail(email);

        if (!user) {
            return this.setStatus(404);
        }

        const deletedUser: boolean = await this.userService.deactivateUser(email);

        if (deletedUser == null) {
            return this.setStatus(400);
        }

        logger.info(`User '${email}' deleted`);

        return;
    }
}