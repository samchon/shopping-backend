import { Module } from "@nestjs/common";

import { ShoppingAdminCouponController } from "./ShoppingAdminCouponController";
import { ShoppingAdminDepositController } from "./ShoppingAdminDepositController";
import { ShoppingAdminMileageController } from "./ShoppingAdminMileageController";
import { ShoppingAdminMileageDonationController } from "./ShoppingAdminMileageDonationController";

@Module({
  controllers: [
    ShoppingAdminCouponController,
    ShoppingAdminDepositController,
    ShoppingAdminMileageController,
    ShoppingAdminMileageDonationController,
  ],
})
export class ShoppingAdminDiscountModule {}
