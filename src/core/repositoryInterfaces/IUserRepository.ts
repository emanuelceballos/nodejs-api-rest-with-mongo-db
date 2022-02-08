import { UserDto } from "../Dto/UserDto";

export interface IUserRepository {
    findByIdAsync(id: string): Promise<UserDto>;
    findByEmailAsync(email: string): Promise<UserDto>;
    findAsync(filter: object): Promise<UserDto[]>;
    addAsync(user: UserDto): Promise<boolean>;
    updateAsync(user: UserDto): Promise<boolean>;
    deleteAsync(email: string): Promise<boolean>;
}