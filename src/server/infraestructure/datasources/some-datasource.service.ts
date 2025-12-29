import { SomeRepository } from "@/server/domain/repositories/some.repository";
import { injectable } from "tsyringe";

@injectable()
export class SomeDataSourceService implements SomeRepository{
    async someMethod(): Promise<String> {
        return "some data from datasource";
    }
}