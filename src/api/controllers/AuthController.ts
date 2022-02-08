import "reflect-metadata";
import {
    Body,
    Controller,
    Post,
    Route,
    SuccessResponse,
    Res,
    Response,
    Tags,
    TsoaResponse,
} from "tsoa";
import UserEntity from '../../core/entities/UserEntity';
import ErrorResponse from "../contracts/responses/errorResponse";
import UserLoginResponse from "../contracts/responses/userLoginResponse";
import UserLoginRequest from "../contracts/requests/userLoginRequest";
import { IAuthService } from "../../core/serviceInterfaces";
import { inject } from "inversify";
import { provideSingleton } from "../../util/provideSingleton";

@provideSingleton(AuthController)
@Route("api/v1/auth")
@Tags("auth")
export class AuthController extends Controller {

    private readonly authService: IAuthService;

    constructor(
        @inject(Symbol.for("IAuthService"))
        authService: IAuthService
    ) {
        super();

        this.authService = authService;
    }

    @Post("")
    @SuccessResponse("200", "OK")
    @Response<ErrorResponse>(400, 'Incorrect user or password.')
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async loginUser(@Body() userRequest: UserLoginRequest, @Res() incorrectUserOrPassword: TsoaResponse<400, ErrorResponse>): Promise<UserLoginResponse> {

        const user: UserEntity = await this.authService.login(userRequest);

        if (!user) {
            return incorrectUserOrPassword(400, {
                error: "Incorrect user or password."
            });
        }

        const userResponse: UserLoginResponse = {
            user: {
                _id: user.id,
                email: user.email,
                name: user.name
            },
            token: user.token!
        }

        return userResponse;
    }
}