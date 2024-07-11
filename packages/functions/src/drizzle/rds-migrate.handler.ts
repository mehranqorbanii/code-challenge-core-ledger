import { ApiHandler } from "sst/node/api";
import { migrate } from "@coding-challenge-core-ledger/core/drizzle";

export const handler = ApiHandler(async (_evt) => {
  await migrate();

  return {
    statusCode: 200,
    body: `Migration Successfull`,
  };
});
