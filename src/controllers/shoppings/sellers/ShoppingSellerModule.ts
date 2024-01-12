import { Module } from "@nestjs/common";

import { ShoppingSellerAuthenticateModule } from "./authenticate/ShoppingSellerAuthenticateModule";
import { ShoppingSellerDeliveryModule } from "./deliveries/ShoppingSellerDeliveryModule";
import { ShoppingSellerDiscountModule } from "./discounts/ShoppingSellerDiscountModule";
import { ShoppingSellerOrderModule } from "./orders/ShoppingSellerOrderModule";
import { ShoppingSellerSaleModule } from "./sales/ShoppingSellerSaleModule";
import { ShoppingSellerSystematicModule } from "./systematic/ShoppingSellerSystematicModule";

@Module({
  imports: [
    ShoppingSellerAuthenticateModule,
    ShoppingSellerDeliveryModule,
    ShoppingSellerDiscountModule,
    ShoppingSellerOrderModule,
    ShoppingSellerSaleModule,
    ShoppingSellerSystematicModule,
  ],
})
export class ShoppingSellerModule {}
