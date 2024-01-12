import { Module } from "@nestjs/common";

import { ShoppingSellerCouponController } from "./ShoppingSellerCouponController";

@Module({
  controllers: [ShoppingSellerCouponController],
})
export class ShoppingSellerDiscountModule {}
