import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("/shoppings/customers/orders/:orderId/goods")
export class ShoppingCustomerOrderGoodsController {
  @core.TypedRoute.Put(":id/confirm")
  public async confirm(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    customer;
    orderId;
    id;
  }
}
