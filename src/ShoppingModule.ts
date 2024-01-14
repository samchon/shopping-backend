import { EncryptedModule } from "@nestia/core";

import { ShoppingGlobal } from "./ShoppingGlobal";
import { MonitorModule } from "./controllers/monitors/MonitorModule";
import { ShoppingAdminModule } from "./controllers/shoppings/admins/ShoppingAdminModule";
import { ShoppingCustomerModule } from "./controllers/shoppings/customers/ShoppingCustomerModule";
import { ShoppingSellerModule } from "./controllers/shoppings/sellers/ShoppingSellerModule";

@EncryptedModule(
  {
    imports: [
      MonitorModule,
      ShoppingAdminModule,
      ShoppingCustomerModule,
      ShoppingSellerModule,
    ],
  },
  () => ({
    key: ShoppingGlobal.env.SHOPPING_API_ENCRYPTION_KEY,
    iv: ShoppingGlobal.env.SHOPPING_API_ENCRYPTION_IV,
  }),
)
export class ShoppingModule {}
