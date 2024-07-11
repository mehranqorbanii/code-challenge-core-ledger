import { SSTConfig } from "sst";
import { Api } from "./stacks/Api";
import { Database } from "./stacks/Database";
import { Bus } from "./stacks/Bus";

export default {
  config(_input) {
    return {
      name: "core-ledger",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Database);
    app.stack(Bus);
    app.stack(Api);
  },
} satisfies SSTConfig;
