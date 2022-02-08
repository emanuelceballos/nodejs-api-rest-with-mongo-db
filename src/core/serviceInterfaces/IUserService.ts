import UserEntity from '../entities/UserEntity';
import UserRequest from '../../api/contracts/requests/userRequest';
import UserUpdateRequest from '../../api/contracts/requests/userUpdateRequest';

export interface IUserService {
    listActiveUsers(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    createUser(userRequest: UserRequest): Promise<boolean>;
    updateUser(email: string, userRequest: UserUpdateRequest): Promise<boolean>;
    deactivateUser(email: string): Promise<boolean>;
}