import { Module } from "@nestjs/common";

import { ShoppingSellerAuthenticateController } from "./ShoppingSellerAuthenticateController";

@Module({
  controllers: [ShoppingSellerAuthenticateController],
})
export class ShoppingSellerAuthenticateModule {}
