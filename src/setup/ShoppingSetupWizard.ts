import cp from "child_process";

import { ShoppingGlobal } from "../ShoppingGlobal";
import { ShoppingAdministratorSeeder } from "./seeders/ShoppingAdministratorSeeder";
import { ShoppingChannelSeeder } from "./seeders/ShoppingChannelSeeder";
import { ShoppingDepositSeeder } from "./seeders/ShoppingDepositSeeder";
import { ShoppingMileageSeeder } from "./seeders/ShoppingMileageSeeder";
import { ShoppingSaleSeeder } from "./seeders/ShoppingSaleSeeder";
import { ShoppingSectionSeeder } from "./seeders/ShoppingSectionSeeder";

export namespace ShoppingSetupWizard {
  export async function schema(): Promise<void> {
    if (ShoppingGlobal.testing === false)
      throw new Error(
        "Erron on SetupWizard.schema(): unable to reset database in non-test mode.",
      );
    const execute = (type: string) => (argv: string) =>
      cp.execSync(`npx prisma migrate ${type} --schema=prisma/schema ${argv}`, {
        stdio: "inherit",
      });
    execute("reset")("--force");
    execute("dev")("--name init");

    await ShoppingGlobal.prisma.$executeRawUnsafe(
      `GRANT SELECT ON ALL TABLES IN SCHEMA ${ShoppingGlobal.env.SHOPPING_POSTGRES_SCHEMA} TO ${ShoppingGlobal.env.SHOPPING_POSTGRES_USERNAME_READONLY}`,
    );
  }

  export async function seed(): Promise<void> {
    await ShoppingChannelSeeder.seed();
    await ShoppingSectionSeeder.seed();
    await ShoppingAdministratorSeeder.seed();
    await ShoppingDepositSeeder.seed();
    await ShoppingMileageSeeder.seed();
    await ShoppingSaleSeeder.seed();
  }
}
