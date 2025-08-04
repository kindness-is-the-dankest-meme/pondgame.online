import { stat } from "./server/stat.ts";

Deno.serve(/* async */ (/* { url } */) => stat(501));
