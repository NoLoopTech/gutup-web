import { QueryClient } from "@tanstack/react-query"
import rtkQueryConfig from "./rtkQuery.config"

export const rtkQueryClient = new QueryClient(rtkQueryConfig)
