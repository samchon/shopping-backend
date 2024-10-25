import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ShoppingOrderGoodProvider } from "../../../../providers/shoppings/orders/ShoppingOrderGoodProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("/shoppings/customers/orders/:orderId/goods")
export class ShoppingCustomerOrderGoodController {
  /**
   * Confirm an order good.
   *
   * Confirm an {@link IShoppingOrderGood order good} that has been
   * completed {@link IShoppingDelivery delivering} to the
   * {@link IShoppingCustomer customer}.
   *
   * In other words, belonged {@link IShoppingOrder order} must be
   * {@link IShoppingPublish.paid_at published, paid} and delivery of
   * the good must be {@link IShoppingDeliveryJourney arrived} to the
   * customer. If not, 428 unprocessable entity error would be thrown.
   *
   * @param orderId Belonged order's {@link IShoppingOrder.id}
   * @param id Target good's {@link IShoppingOrderGood.id}
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id/confirm")
  public async confirm(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<void> {
    return ShoppingOrderGoodProvider.confirm({
      customer,
      order: { id: orderId },
      id,
    });
  }
}
