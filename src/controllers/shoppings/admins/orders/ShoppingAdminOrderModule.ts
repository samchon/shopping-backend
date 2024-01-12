import { Module } from "@nestjs/common";

import { ShoppingAdminOrderController } from "./ShoppingAdminOrderController";

@Module({
  controllers: [ShoppingAdminOrderController],
})
export class ShoppingAdminOrderModule {}
