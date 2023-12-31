import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ShoppingOrderPublishProvider } from "../../../../providers/shoppings/orders/ShoppingOrderPublishProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/orders/:orderId/publish`)
export class ShoppingCustomerOrderPublishesController {
  @core.TypedRoute.Get("able")
  public async able(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
  ): Promise<void> {
    await ShoppingOrderPublishProvider.able(customer)({ id: orderId });
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingOrderPublish.ICreate,
  ): Promise<IShoppingOrderPublish> {
    return ShoppingOrderPublishProvider.create(customer)({ id: orderId })(
      input,
    );
  }

  @core.TypedRoute.Delete()
  public async cancel(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingOrderPublishProvider.cancel(customer)({ id: orderId });
  }
}
