"use client";

import "client-only";
import "reflect-metadata";
import { container } from "tsyringe";
import { registerSingletonOnce } from "@/shared/di/register-once";

// registerSingletonOnce(
//     container,
//     "SomeRepository",
//     SomeRepositoryImplementation,
// )

export { container as clientContainer };