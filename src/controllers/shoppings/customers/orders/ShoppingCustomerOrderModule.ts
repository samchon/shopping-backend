import { Module } from "@nestjs/common";

import { ShoppingCustomerCartCommodityController } from "./ShoppingCustomerCartCommodityController";
import { ShoppingCustomerOrderController } from "./ShoppingCustomerOrderController";
import { ShoppingCustomerOrderGoodController } from "./ShoppingCustomerOrderGoodController";
import { ShoppingCustomerOrderPublishController } from "./ShoppingCustomerOrderPublishController";

@Module({
  controllers: [
    ShoppingCustomerCartCommodityController,
    ShoppingCustomerOrderController,
    ShoppingCustomerOrderGoodController,
    ShoppingCustomerOrderPublishController,
  ],
})
export class ShoppingCustomerOrderModule {}
