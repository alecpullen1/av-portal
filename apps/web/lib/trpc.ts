import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../../../apps/api/src/routers"

export const trpc = createTRPCReact<AppRouter>()