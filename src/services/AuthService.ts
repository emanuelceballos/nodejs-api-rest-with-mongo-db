import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from 'config';
import UserEntity from '../core/entities/UserEntity';
import UserLoginRequest from '../api/contracts/requests/userLoginRequest';
import { IAuthService } from '../core/serviceInterfaces/IAuthService';
import { provideSingleton } from '../util/provideSingleton';
import { IUserRepository } from '../core/repositoryInterfaces/IUserRepository';
import { inject } from 'inversify';
import { UserDto } from '../core/Dto/UserDto';

// Replaces @injectable()
@provideSingleton(AuthService)
export class AuthService implements IAuthService {

    private readonly userRepository: IUserRepository;

    constructor(
        @inject(Symbol.for("IUserRepository"))
        userRepository: IUserRepository
    ) {
        this.userRepository = userRepository;
    }

    public async login(userRequest: UserLoginRequest): Promise<UserEntity> {

        const dbUser: UserDto = await this.userRepository.findByEmailAsync(userRequest.email);

        if (!dbUser) {
            return null as any;
        }

        const validPassword = bcrypt.compareSync(userRequest.password, dbUser.password!);

        if (!validPassword) {
            return null as any;
        }

        const token = jwt.sign(
            {
                user: {
                    _id: dbUser._id,
                    name: dbUser.name,
                    email: dbUser.email
                }
            },
            config.get('configToken.seed'),
            {
                expiresIn: config.get('configToken.expiration')
            });

        const userDto: UserEntity = {
            id: dbUser._id!,
            name: dbUser.name,
            email: dbUser.email,
            token: token,
            password: '',
            image: '',
            status: dbUser.status
        };

        return userDto;
    }
}