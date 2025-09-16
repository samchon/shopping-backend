import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { ShoppingGlobal } from "../ShoppingGlobal";
import { ShoppingSetupWizard } from "../setup/ShoppingSetupWizard";

async function execute(
  database: string,
  username: string,
  password: string,
  script: string,
): Promise<void> {
  try {
    const prisma = new PrismaClient({
      adapter: new PrismaPg(
        {
          connectionString: `postgresql://${username}:${password}@${ShoppingGlobal.env.SHOPPING_POSTGRES_HOST}:${ShoppingGlobal.env.SHOPPING_POSTGRES_PORT}/${database}?schema=${ShoppingGlobal.env.SHOPPING_POSTGRES_SCHEMA}`,
        },
        { schema: ShoppingGlobal.env.SHOPPING_POSTGRES_SCHEMA },
      ),
    });
    const queries: string[] = script
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => !!str);
    for (const query of queries)
      try {
        await prisma.$queryRawUnsafe(query);
      } catch (e) {
        console.log(e);
      }
    await prisma.$disconnect();
  } catch (err) {
    console.log(err);
  }
}

async function main(): Promise<void> {
  const config = {
    database: ShoppingGlobal.env.SHOPPING_POSTGRES_DATABASE,
    schema: ShoppingGlobal.env.SHOPPING_POSTGRES_SCHEMA,
    username: ShoppingGlobal.env.SHOPPING_POSTGRES_USERNAME,
    readonlyUsername: ShoppingGlobal.env.SHOPPING_POSTGRES_USERNAME_READONLY,
    password: ShoppingGlobal.env.SHOPPING_POSTGRES_PASSWORD,
  };
  const root = {
    account: process.argv[2] ?? "postgres",
    password: process.argv[3] ?? "root",
  };

  await execute(
    "postgres",
    root.account,
    root.password,
    `
      CREATE USER ${config.username} WITH ENCRYPTED PASSWORD '${config.password}';
      ALTER ROLE ${config.username} WITH CREATEDB
      CREATE DATABASE ${config.database} OWNER ${config.username};
    `,
  );

  await execute(
    config.database,
    root.account,
    root.password,
    `
      CREATE SCHEMA ${config.schema} AUTHORIZATION ${config.username};
    `,
  );

  await execute(
    config.database,
    root.account,
    root.password,
    `
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ${config.schema} TO ${config.username};

      CREATE USER ${config.readonlyUsername} WITH ENCRYPTED PASSWORD '${config.password}';
      GRANT USAGE ON SCHEMA ${config.schema} TO ${config.readonlyUsername};
      GRANT SELECT ON ALL TABLES IN SCHEMA ${config.schema} TO ${config.readonlyUsername};
    `,
  );

  console.log("------------------------------------------");
  console.log("CREATE TABLES");
  console.log("------------------------------------------");
  ShoppingGlobal.testing = true;
  await ShoppingSetupWizard.schema();

  console.log("------------------------------------------");
  console.log("INITIAL DATA");
  console.log("------------------------------------------");
  await ShoppingSetupWizard.seed();
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
