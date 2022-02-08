import "reflect-metadata";
import UserRequest from '../api/contracts/requests/userRequest';
import UserUpdateRequest from '../api/contracts/requests/userUpdateRequest';
import { UserDto } from "../core/Dto/UserDto";
import UserEntity from '../core/entities/userEntity';
import { IUserService } from '../core/serviceInterfaces';
import { provideSingleton } from "../util/provideSingleton";
import { IUserRepository } from "../core/repositoryInterfaces/IUserRepository";
import { inject } from "inversify";

// Replaces @injectable()
@provideSingleton(UserService)
export class UserService implements IUserService {

    private readonly userRepository: IUserRepository;

    constructor(
        @inject(Symbol.for("IUserRepository"))
        userRepository: IUserRepository
    ) {
        this.userRepository = userRepository;
    }

    public async listActiveUsers(): Promise<UserEntity[]> {

        const users: UserDto[] = await this.userRepository.findAsync({ 'status': true });

        return users.map<UserEntity>((u) => ({
            id: u._id!,
            email: u.email,
            name: u.name,
            status: u.status
        }));
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {

        const user: UserDto = await this.userRepository.findByEmailAsync(email);

        if (user == null) {
            return null;
        }

        return {
            email,
            id: user._id!,
            name: user.name,
            status: user.status
        }
    }

    public async createUser(userRequest: UserRequest): Promise<boolean> {

        return await this.userRepository.addAsync({
            email: userRequest.email,
            name: userRequest.name,
            password: userRequest.password,
            status: true,
        });
    }

    public async updateUser(email: string, userRequest: UserUpdateRequest): Promise<boolean> {

        return await this.userRepository.updateAsync({
            email: email,
            name: userRequest.name,
            status: true,
        });
    }

    public async deactivateUser(email: string): Promise<boolean> {
        return await this.userRepository.deleteAsync(email);
    }
}