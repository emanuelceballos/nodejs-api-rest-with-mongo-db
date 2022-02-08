interface UserLogin {
    _id: string;
    name: string;
    email: string;
}

interface UserLoginResponse {
    user: UserLogin;
    token: string;
}

export default UserLoginResponse;