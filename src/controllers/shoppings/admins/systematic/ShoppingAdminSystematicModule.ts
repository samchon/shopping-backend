import { Module } from "@nestjs/common";

import { ShoppingAdminSystematicChannelCategoryController } from "./ShoppingAdminSystematicChannelCategoryController";
import { ShoppingAdminSystematicChannelController } from "./ShoppingAdminSystematicChannelController";
import { ShoppingAdminSystematicSectionController } from "./ShoppingAdminSystematicSectionController";

@Module({
  controllers: [
    ShoppingAdminSystematicChannelCategoryController,
    ShoppingAdminSystematicChannelController,
    ShoppingAdminSystematicSectionController,
  ],
})
export class ShoppingAdminSystematicModule {}
