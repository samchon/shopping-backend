import { Module } from "@nestjs/common";

import { ShoppingSellerOrderController } from "./ShoppingSellerOrderController";

@Module({
  controllers: [ShoppingSellerOrderController],
})
export class ShoppingSellerOrderModule {}
