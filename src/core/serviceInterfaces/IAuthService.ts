import UserEntity from '../entities/UserEntity';
import UserLoginRequest from '../../api/contracts/requests/userLoginRequest';

export interface IAuthService {
    login(userRequest: UserLoginRequest): Promise<UserEntity>;
}