export interface UserDto {
    _id?: string;
    email: string;
    name: string;
    password?: string;
    status: boolean;
    image?: string;
    token?: string;
}