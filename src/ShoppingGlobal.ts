import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

interface IEnvironments {
  SHOPPING_MODE: "local" | "dev" | "real";
  SHOPPING_API_PORT: `${number}`;

  SHOPPING_SYSTEM_PASSWORD: string;
  SHOPPING_JWT_SECRET_KEY: string;
  SHOPPING_JWT_REFRESH_KEY: string;

  SHOPPING_POSTGRES_HOST: string;
  SHOPPING_POSTGRES_PORT: `${number}`;
  SHOPPING_POSTGRES_DATABASE: string;
  SHOPPING_POSTGRES_SCHEMA: string;
  SHOPPING_POSTGRES_USERNAME: string;
  SHOPPING_POSTGRES_USERNAME_READONLY: string;
  SHOPPING_POSTGRES_PASSWORD: string;
  SHOPPING_POSTGRES_URL: string;

  SHOPPING_ADDRESS_SECRET_KEY: string;
  SHOPPING_CITIZEN_SECRET_KEY: string;
  SHOPPING_DELIVERY_SHIPPER_SECRET_KEY: string;
  SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_KEY: string;
  SHOPPING_EXTERNAL_USER_SECRET_KEY: string;
  SHOPPING_ORDER_PUBLISH_SECRET_KEY: string;

  SHOPPING_ADDRESS_SECRET_IV: string;
  SHOPPING_CITIZEN_SECRET_IV: string;
  SHOPPING_DELIVERY_SHIPPER_SECRET_IV: string;
  SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_IV: string;
  SHOPPING_EXTERNAL_USER_SECRET_IV: string;
  SHOPPING_ORDER_PUBLISH_SECRET_IV: string;

  OPENAI_API_KEY?: string | undefined;
}
const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});

/**
 * Global variables of the shopping server.
 *
 * @author Samchon
 */
export class ShoppingGlobal {
  public static testing: boolean = false;

  public static readonly prisma: PrismaClient = new PrismaClient({
    adapter: new PrismaPg(
      { connectionString: environments.get().SHOPPING_POSTGRES_URL },
      { schema: environments.get().SHOPPING_POSTGRES_SCHEMA },
    ),
  });

  public static get env(): IEnvironments {
    return environments.get();
  }

  /**
   * Current mode.
   *
   *   - local: The server is on your local machine.
   *   - dev: The server is for the developer.
   *   - real: The server is for the real service.
   */
  public static get mode(): "local" | "dev" | "real" {
    return (modeWrapper.value ??= environments.get().SHOPPING_MODE);
  }

  /**
   * Set current mode.
   *
   * @param mode The new mode
   */
  public static setMode(mode: typeof ShoppingGlobal.mode): void {
    typia.assert<typeof mode>(mode);
    modeWrapper.value = mode;
  }
}

interface IMode {
  value?: "local" | "dev" | "real";
}
const modeWrapper: IMode = {};
