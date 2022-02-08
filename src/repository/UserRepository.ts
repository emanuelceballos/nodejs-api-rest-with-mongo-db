import { UserDto } from "../core/Dto/UserDto";
import { IUserRepository } from "../core/repositoryInterfaces/IUserRepository";
import { provideSingleton } from "../util/provideSingleton";
import bcrypt from 'bcrypt';
import UserSchema from '../repository/models/userModel';
import { logger } from "../util/asyncLocalStorageLog";

@provideSingleton(UserRepository)
export class UserRepository implements IUserRepository {

    public async findByIdAsync(id: string): Promise<UserDto> {
        throw new Error("Method not implemented.");
    }

    public async findByEmailAsync(email: string): Promise<UserDto> {
        const userResult: UserDto = await UserSchema.findOne({ email }, (err: any, user: UserDto) => {
            if (err) {
                logger.error(err);
                return null;
            }

            return user;
        });

        return userResult;
    }

    public async findAsync(filter: object): Promise<UserDto[]> {

        return await
            UserSchema
                .find(filter)
                .select({ name: 1, email: 1 });
    }

    public async addAsync(userDto: UserDto): Promise<boolean> {

        const hashedPassword = bcrypt.hashSync(userDto.password!, 10);

        const user = new UserSchema({
            email: userDto.email,
            name: userDto.name,
            password: hashedPassword
        });

        const userCreated = await user.save();
        return userCreated !== undefined;
    }

    public async updateAsync(userDto: UserDto): Promise<boolean> {
        let userToUpdate: any = {
            name: userDto.name
        };

        if (userDto.password !== undefined) {
            const hashedPassword = bcrypt.hashSync(userDto.password, 10);
            userToUpdate.password = hashedPassword;
        }

        const user: UserDto = await UserSchema.findOneAndUpdate({ 'email': userDto.email }, {
            $set: userToUpdate
        }, {
            new: true
        });

        return user !== null;
    }

    public async deleteAsync(email: string): Promise<boolean> {

        const user: UserDto = await UserSchema.findOneAndUpdate({ 'email': email }, {
            $set: {
                status: false
            }
        }, {
            new: true
        });

        return user !== null;
    }
}