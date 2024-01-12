import { Module } from "@nestjs/common";

import { ShoppingSellerSystematicChannelCategoryController } from "./ShoppingSellerSystematicChannelCategoryController";
import { ShoppingSellerSystematicChannelController } from "./ShoppingSellerSystematicChannelController";
import { ShoppingSellerSystematicSectionController } from "./ShoppingSellerSystematicSectionController";

@Module({
  controllers: [
    ShoppingSellerSystematicChannelCategoryController,
    ShoppingSellerSystematicChannelController,
    ShoppingSellerSystematicSectionController,
  ],
})
export class ShoppingSellerSystematicModule {}
