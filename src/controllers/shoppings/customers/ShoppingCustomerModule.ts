import { Module } from "@nestjs/common";

import { ShoppingCustomerAuthenticateModule } from "./authenticate/ShoppingCustomerAuthenticateModule";
import { ShoppingCustomerDiscountModule } from "./discounts/ShoppingCustomerDiscountModule";
import { ShoppingCustomerOrderModule } from "./orders/ShoppingCustomerOrderModule";
import { ShoppingCustomerSaleModule } from "./sales/ShoppingCustomerSaleModule";
import { ShoppingCustomerSystematicModule } from "./systematic/ShoppingCustomerSystematicModule";

@Module({
  imports: [
    ShoppingCustomerAuthenticateModule,
    ShoppingCustomerDiscountModule,
    ShoppingCustomerOrderModule,
    ShoppingCustomerSaleModule,
    ShoppingCustomerSystematicModule,
  ],
})
export class ShoppingCustomerModule {}
