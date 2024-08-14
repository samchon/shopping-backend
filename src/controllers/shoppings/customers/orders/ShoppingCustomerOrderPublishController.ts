import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrderPublish } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPublish";

import { ShoppingOrderPublishProvider } from "../../../../providers/shoppings/orders/ShoppingOrderPublishProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/orders/:orderId/publish`)
export class ShoppingCustomerOrderPublishController {
  /**
   * Check publishable.
   *
   * Test whether the {@link IShoppingOrder order} is publishable or not.
   *
   * If the order has not been {@link IShoppingOrderPublish published} and
   * not deleted yet, then it is possible to publish the order. Even thouogh
   * target {@link IShoppingSale sale} is suspended or
   * {@link IShoppingSaleUnitStockInventory out of stock}, it is still possible
   * to publish because the order already has been applied.
   *
   * @param orderId Target order's {@link IShoppingOrder.id}
   * @returns Whether the order is publishable or not
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Get("able")
  public async able(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
  ): Promise<boolean> {
    return ShoppingOrderPublishProvider.able(customer)({ id: orderId });
  }

  /**
   * Publish an order.
   *
   * {@link IShoppingOrderPublish Publish} an {@link IShoppingOrder order} that
   * has been applied by the {@link IShoppingCustomer} with
   * {@link IShoppingAddress address} to delivery and payment information gotten
   * from the payment vendor system.
   *
   * If the order has been discounted for entire order price, then no need
   * to send payment vendor info. Instead, only address info is required.
   *
   * Also, the payment time can be different with the publish time. For example,
   * if the payment method is manual bank account transfer, then the payment
   * would be delayed until the customer actually transfer the money. In that
   * case, {@link IShoppingOrderPublish.paid_at} would be `null` value, so
   * that you have to check it after calling this publish function.
   *
   * @param orderId Target order's {@link IShoppingOrder.id}
   * @param input Creation info of the publish
   * @returns Newly created publish
   * @tag Order
   *
   * @author Samchon
   */
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

  /**
   * Cancel the publish (payment).
   *
   * Cancel payment of an {@link IShoppingOrder order} that has been
   * {@link IShoppingOrderPublish published}.
   *
   * If target publish's payment method is manual bank account transfer,
   * then it would be cancelled directly. If not, then payment cancel
   * request would be sent to the payment vendor system.
   *
   * @param orderId Target order's {@link IShoppingOrder.id}
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete()
  public async cancel(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("orderId") orderId: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingOrderPublishProvider.cancel(customer)({ id: orderId });
  }
}
