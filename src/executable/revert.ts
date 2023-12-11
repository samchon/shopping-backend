import { MutexConnector, RemoteMutex } from "mutex-server";
import { Promisive } from "tgrid/typings/Promisive";
import { UniqueLock } from "tstl/thread/UniqueLock";

import ShoppingApi from "@samchon/shopping-api";
import { ISystem } from "@samchon/shopping-api/lib/structures/monitors/ISystem";

import { ShoppingConfiguration } from "../ShoppingConfiguration";
import { ShoppingGlobal } from "../ShoppingGlobal";
import { IUpdateController } from "../updator/internal/IUpdateController";

async function main(): Promise<void> {
  // CONFIGURE MODE & COMMIT-ID
  const commit = process.argv[3];
  if (!commit)
    throw new Error("Error on Updator.revert(): no commit-id specified.");
  else if (!process.argv[2])
    throw new Error("Error on Updator.revert(): no mode specified.");
  ShoppingGlobal.setMode(process.argv[2] as "local");

  // CONNECT TO THE UPDATOR SERVER
  const connector: MutexConnector<string, null> = new MutexConnector(
    ShoppingConfiguration.SYSTEM_PASSWORD(),
    null,
  );
  await connector.connect(
    `ws://${ShoppingConfiguration.MASTER_IP()}:${ShoppingConfiguration.UPDATOR_PORT()}/update`,
  );

  // REQUEST UPDATE WITH MONOPOLYING A GLOBAL MUTEX
  const mutex: RemoteMutex = await connector.getMutex("update");
  const success: boolean = await UniqueLock.try_lock(mutex, async () => {
    const updator: Promisive<IUpdateController> = connector.getDriver();
    await updator.revert(commit);
  });
  await connector.close();

  // SUCCESS OR NOT
  if (success === false) {
    console.log("Already on reverting.");
    process.exit(-1);
  }

  // PRINT THE COMMIT STATUS
  const connection: ShoppingApi.IConnection = {
    host: `http://${ShoppingConfiguration.MASTER_IP()}:${ShoppingConfiguration.API_PORT()}`,
  };
  const system: ISystem = await ShoppingApi.functional.monitors.system.get(
    connection,
  );
  console.log("branch", system.arguments[2], system.commit.branch);
  console.log("hash", system.commit.hash);
  console.log("commit-time", system.commit.commited_at);
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
