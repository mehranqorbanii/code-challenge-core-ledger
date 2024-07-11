import { StackContext, Api as SSTApi, use } from "sst/constructs";
import { Database } from "./Database";
import { Bus } from "./Bus";

export function Api({ stack }: StackContext) {
  const db = use(Database);
  const bus = use(Bus);

  const api = new SSTApi(stack, "api", {
    defaults: {
      function: {
        // TODO: let's discuss the timeout time.
        timeout: "900 seconds",
        bind: [db, bus],
      },
    },
      routes: {
          "GET /api/v1/users/{id}":
              "packages/functions/src/modules/user/user.api-handler.get",
          "POST /api/v1/users":
              "packages/functions/src/modules/user/user.api-handler.create",
          "POST /api/v1/users/{id}/accounts":
              "packages/functions/src/modules/account/account.api-handler.create",
          "GET /api/v1/users/{id}/accounts":
              "packages/functions/src/modules/account/account.api-handler.list",
          "POST /api/v1/fees":
              "packages/functions/src/modules/fee/fee.api-handler.create",
          "GET /api/v1/fees":
              "packages/functions/src/modules/fee/fee.api-handler.list",
          "DELETE /api/v1/fees/{id}":
              "packages/functions/src/modules/fee/fee.api-handler.remove",
          "POST /api/v1/transactions":
              "packages/functions/src/modules/transaction/transaction.api-handler.create",
          "GET /api/v1/users/{id}/transactions":
              "packages/functions/src/modules/transaction/transaction.api-handler.get",
          "GET /api/v1/transactions/reports":
              "packages/functions/src/modules/transaction/transaction.api-handler.report",
      },
  });

    stack.addOutputs({
        ApiEndpoint: api.url,
  });

  return Api;
}
