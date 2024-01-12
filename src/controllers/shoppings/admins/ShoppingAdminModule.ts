import { Module } from "@nestjs/common";

import { ShoppingAdminAuthenticateModule } from "./authenticate/ShoppingAdminAuthenticateModule";
import { ShoppingAdminDiscountModule } from "./discounts/ShoppingAdminDiscountModule";
import { ShoppingAdminOrderModule } from "./orders/ShoppingAdminOrderModule";
import { ShoppingAdminSaleModule } from "./sales/ShoppingAdminSaleModule";
import { ShoppingAdminSystematicModule } from "./systematic/ShoppingAdminSystematicModule";

@Module({
  imports: [
    ShoppingAdminAuthenticateModule,
    ShoppingAdminDiscountModule,
    ShoppingAdminOrderModule,
    ShoppingAdminSaleModule,
    ShoppingAdminSystematicModule,
  ],
})
export class ShoppingAdminModule {}
