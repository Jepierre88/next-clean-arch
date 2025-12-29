import { inject, injectable } from "tsyringe";
import { SomeRepository } from "../repositories/some.repository";
import { TOKENS } from "@/shared/di/tokens";

@injectable()
export class SomeUseCase {

    constructor(
        @inject(TOKENS.SomeRepository)
        private someRepository: SomeRepository
    ) {}

    async someExecution(): Promise<String> {
        return await this.someRepository.someMethod();
    }

}