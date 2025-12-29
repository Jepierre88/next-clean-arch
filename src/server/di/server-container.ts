import "server-only";
import "reflect-metadata";
import { container } from "tsyringe";
import { registerSingletonOnce } from "@/shared/di/register-once";
import { TOKENS } from "@/shared/di/tokens";
import { SomeDataSourceService } from "../infraestructure/datasources/some-datasource.service";
import { SomeRepositoryImp } from "../infraestructure/repositories/some.repository-imp";
import { AuthDataSourceService } from "../infraestructure/datasources/auth.datasource";
import { AuthRepositoryImp } from "../infraestructure/repositories/auth.repository-imp";

// registerSingletonOnce(
//     container,
//     "SomeRepository",
//     SomeRepositoryImplementation
// )

registerSingletonOnce(
    container,
    TOKENS.SomeDataSourceService,
    SomeDataSourceService
)

registerSingletonOnce(
    container,
    TOKENS.SomeRepository,
    SomeRepositoryImp
)

registerSingletonOnce(
    container,
    TOKENS.AuthDataSourceService,
    AuthDataSourceService
)

registerSingletonOnce(
    container,
    TOKENS.AuthRepository,
    AuthRepositoryImp
)

export { container as serverContainer };