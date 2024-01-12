import { Module } from "@nestjs/common";

import { ShoppingCustomerAuthenticateController } from "./ShoppingCustomerAuthenticateController";
import { ShoppingCustomerAuthenticatePasswordController } from "./ShoppingCustomerAuthenticatePasswordController";

@Module({
  controllers: [
    ShoppingCustomerAuthenticateController,
    ShoppingCustomerAuthenticatePasswordController,
  ],
})
export class ShoppingCustomerAuthenticateModule {}
