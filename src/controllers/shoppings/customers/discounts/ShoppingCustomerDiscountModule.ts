import { Module } from "@nestjs/common";

import { ShoppingCustomerCouponController } from "./ShoppingCustomerCouponController";
import { ShoppingCustomerCouponTicketController } from "./ShoppingCustomerCouponTicketController";
import { ShoppingCustomerDepositChargeController } from "./ShoppingCustomerDepositChargeController";
import { ShoppingCustomerDepositChargePublishController } from "./ShoppingCustomerDepositChargePublishController";
import { ShoppingCustomerDepositHistoryController } from "./ShoppingCustomerDepositHistoryController";
import { ShoppingCustomerMileageHistoryController } from "./ShoppingCustomerMileageHistoryController";

@Module({
  controllers: [
    ShoppingCustomerCouponController,
    ShoppingCustomerCouponTicketController,
    ShoppingCustomerDepositChargeController,
    ShoppingCustomerDepositChargePublishController,
    ShoppingCustomerDepositHistoryController,
    ShoppingCustomerMileageHistoryController,
  ],
})
export class ShoppingCustomerDiscountModule {}
