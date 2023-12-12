import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { MutexConnector } from "mutex-server";
import { MutableSingleton, Singleton } from "tstl";
import typia from "typia";

import { ShoppingConfiguration } from "./ShoppingConfiguration";

/**
 * Global variables of the shopping server.
 *
 * @author Samchon
 */
export class ShoppingGlobal {
  public static testing: boolean = false;

  public static readonly prisma: PrismaClient = new PrismaClient();

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

  public static readonly critical: MutableSingleton<
    MutexConnector<string, null>
  > = new MutableSingleton(async () => {
    const connector: MutexConnector<string, null> = new MutexConnector(
      ShoppingConfiguration.SYSTEM_PASSWORD(),
      null,
    );
    await connector.connect(
      `ws://${ShoppingConfiguration.MASTER_IP()}:${ShoppingConfiguration.UPDATOR_PORT()}/api`,
    );
    return connector;
  });
}

interface IEnvironments {
  SHOPPING_MODE: "local" | "dev" | "real";
  SHOPPING_UPDATOR_PORT: `${number}`;
  SHOPPING_API_PORT: `${number}`;
  SHOPPING_SYSTEM_PASSWORD: string;

  SHOPPING_POSTGRES_HOST: string;
  SHOPPING_POSTGRES_PORT: `${number}`;
  SHOPPING_POSTGRES_DATABASE: string;
  SHOPPING_POSTGRES_SCHEMA: string;
  SHOPPING_POSTGRES_USERNAME: string;
  SHOPPING_POSTGRES_USERNAME_READONLY: string;
  SHOPPING_POSTGRES_PASSWORD: string;
}

interface IMode {
  value?: "local" | "dev" | "real";
}

const modeWrapper: IMode = {};

const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});
