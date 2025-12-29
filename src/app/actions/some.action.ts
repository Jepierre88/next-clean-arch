"use server"

import { serverContainer } from "@/server/di/server-container"
import { SomeUseCase } from "@/server/domain/usecases/some.usecase"


export async function someAction(): Promise<String> {
    try {
        const useCase = serverContainer.resolve<SomeUseCase>(SomeUseCase)
        return await useCase.someExecution()
    } catch (error) {
        throw error
    }
}