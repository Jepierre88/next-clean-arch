import { SomeRepository } from "@/server/domain/repositories/some.repository";
import { inject, injectable } from "tsyringe";
import { SomeDataSourceService } from "../datasources/some-datasource.service";
import { TOKENS } from "@/shared/di/tokens";

@injectable()
export class SomeRepositoryImp implements SomeRepository {
    constructor(@inject(TOKENS.SomeDataSourceService) private someDatasourceService: SomeDataSourceService){}

    async someMethod(): Promise<String> {
        return this.someDatasourceService.someMethod();
    }
}