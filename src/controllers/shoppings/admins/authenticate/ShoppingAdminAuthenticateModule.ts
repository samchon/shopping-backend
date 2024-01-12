import { Module } from "@nestjs/common";

import { ShoppingAdminAuthenticateController } from "./ShoppingAdminAuthenticateController";

@Module({
  controllers: [ShoppingAdminAuthenticateController],
})
export class ShoppingAdminAuthenticateModule {}
