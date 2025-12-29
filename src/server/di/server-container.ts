import "server-only";
import "reflect-metadata";
import { container } from "tsyringe";
import { registerSingletonOnce } from "@/shared/di/register-once";
import { TOKENS } from "@/shared/di/tokens";
import { SomeDataSourceService } from "../infraestructure/datasources/some-datasource.service";
import { SomeRepositoryImp } from "../infraestructure/repositories/some.repository-imp";

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

export { container as serverContainer };