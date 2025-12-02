import { STATUS_TEXT, type StatusCode } from "@std/http/status";
import { fres } from "./fres.ts";

export const stat = (code: StatusCode) =>
  fres(`${code} ${STATUS_TEXT[code]}`, {
    status: code,
    statusText: STATUS_TEXT[code],
  });
