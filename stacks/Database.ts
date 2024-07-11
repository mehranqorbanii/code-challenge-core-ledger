import { StackContext, RDS, Script } from "sst/constructs";

export function Database({ stack }: StackContext) {
  const rds = new RDS(stack, "sharedRds", {
    defaultDatabaseName: "shared",
    engine: "postgresql13.12",
    scaling: {
      minCapacity: "ACU_2",
      maxCapacity: "ACU_2",
    },
  });

  new Script(stack, "migrations", {
    defaults: {
      function: {
        bind: [rds],
        timeout: 300,
        copyFiles: [
          {
            from: "packages/core/drizzle",
            to: "migrations",
          },
        ],
      },
    },
    onCreate: "packages/functions/src/drizzle/rds-migrate.handler.handler",
    onUpdate: "packages/functions/src/drizzle/rds-migrate.handler.handler",
  });

  stack.addOutputs({
    RDS_ARN: rds.clusterArn,
    RDS_SECRET: rds.secretArn,
    RDS_DATABASE: rds.defaultDatabaseName,
  });

  return rds;
}
