import "reflect-metadata";
import { Container, decorate, injectable } from "inversify";
import { IAuthService, IUserService } from "./core/serviceInterfaces";
import { AuthService, UserService } from './services';
import { Controller } from "tsoa";
import { buildProviderModule } from "inversify-binding-decorators";
import { IUserRepository } from "./core/repositoryInterfaces/IUserRepository";
import { UserRepository } from "./repository/UserRepository";

const iocContainer = new Container();

// Makes tsoa's Controller injectable
decorate(injectable(), Controller);

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

iocContainer
    .bind<IUserService>(Symbol.for("IUserService"))
    .to(UserService);
iocContainer
    .bind<IAuthService>(Symbol.for("IAuthService"))
    .to(AuthService);
iocContainer
    .bind<IUserRepository>(Symbol.for("IUserRepository"))
    .to(UserRepository);

export { iocContainer as iocContainer };