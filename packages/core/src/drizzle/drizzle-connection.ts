import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { RDS } from "sst/node/rds";

export const db = drizzle(new RDSDataClient(), {
  logger: true,

  database: RDS.sharedRds.defaultDatabaseName,
  secretArn: RDS.sharedRds.secretArn,
  resourceArn: RDS.sharedRds.clusterArn,
});
