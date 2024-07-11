import { StackContext, EventBus, use } from "sst/constructs";
import { Database } from "./Database";

export function Bus({ stack }: StackContext) {
  const db = use(Database);

  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 3,
    },
  });

  bus.subscribe("user.created", {
    bind: [db],
    handler:
      "packages/functions/src/modules/notification/user-created.event-handler.handler",
  });


  bus.subscribe("user.created", {
    bind: [db],
    handler:
        "packages/functions/src/modules/account/account.event-handler.handler",
  });


  stack.addOutputs({
    busName: bus.eventBusName,
  });

  return bus;
}
