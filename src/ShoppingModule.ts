import { Module } from "@nestjs/common";

import { MonitorModule } from "./controllers/monitors/MonitorModule";
import { ShoppingAdminModule } from "./controllers/shoppings/admins/ShoppingAdminModule";
import { ShoppingCustomerModule } from "./controllers/shoppings/customers/ShoppingCustomerModule";
import { ShoppingSellerModule } from "./controllers/shoppings/sellers/ShoppingSellerModule";

@Module({
  imports: [
    MonitorModule,
    ShoppingAdminModule,
    ShoppingCustomerModule,
    ShoppingSellerModule,
  ],
})
export class ShoppingModule {}
