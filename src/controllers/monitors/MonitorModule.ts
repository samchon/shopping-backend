import { EncryptedModule } from "@nestia/core";

import { ShoppingGlobal } from "../../ShoppingGlobal";
import { MonitorHealthController } from "./MonitorHealthController";
import { MonitorPerformanceController } from "./MonitorPerformanceController";
import { MonitorSystemController } from "./MonitorSystemController";

@EncryptedModule(
  {
    controllers: [
      MonitorHealthController,
      MonitorPerformanceController,
      MonitorSystemController,
    ],
  },
  () => ({
    key: ShoppingGlobal.env.SHOPPING_API_ENCRYPTION_KEY,
    iv: ShoppingGlobal.env.SHOPPING_API_ENCRYPTION_IV,
  }),
)
export class MonitorModule {}
