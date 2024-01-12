import { Module } from "@nestjs/common";

import { ShoppingCustomerSystematicChannelCategoryController } from "./ShoppingCustomerSystematicChannelCategoryController";
import { ShoppingCustomerSystematicChannelController } from "./ShoppingCustomerSystematicChannelController";
import { ShoppingCustomerSystematicSectionController } from "./ShoppingCustomerSystematicSectionController";

@Module({
  controllers: [
    ShoppingCustomerSystematicChannelCategoryController,
    ShoppingCustomerSystematicChannelController,
    ShoppingCustomerSystematicSectionController,
  ],
})
export class ShoppingCustomerSystematicModule {}
