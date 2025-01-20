import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingOrderPriceProvider } from "../../../../providers/shoppings/orders/ShoppingOrderPriceProvider";
import { ShoppingOrderProvider } from "../../../../providers/shoppings/orders/ShoppingOrderProvider";
import { ShoppingOrderController } from "../../base/orders/ShoppingOrderController";

export class ShoppingCustomerOrderController extends ShoppingOrderController({
  path: "customers",
  AuthGuard: ShoppingCustomerAuth,
}) {
  /**
   * Create a new order application.
   *
   * Create a new {@link IShoppingOrder order application} from a
   * {@link IShoppingCartCommodity shopping cart} that has been composed by the
   * {@link IShoppingCustomer}. Of course, do not need to put every commodities
   * to the order, but possible to select some of them by the customer.
   *
   * By the way, this function does not mean completion the order, but means
   * just customer is appling the order. The order be completed only when customer
   * {@link IShoppingOrderPublish.paid_at pays} the order.
   *
   * > If you are an A.I. chatbot, don't take a mistake that writing
   * > the `commodity_id` with the user selected stock ID. The
   * > `commodity_id` is the ID of the shopping cart commodity, not the
   * > stock ID. The stock ID is already included in the shopping cart
   * > commodity.
   *
   * @param input Creation info of the order
   * @returns Newly created order
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingOrder.ICreate,
  ): Promise<IShoppingOrder> {
    return ShoppingOrderProvider.create({
      customer,
      input,
    });
  }

  /**
   * Create a new order application without a shopping cart.
   *
   * Carete a new {@link IShoppingOrder order application} without a
   * {@link IShoppingCartCommodity shopping cart commodity} composition.
   * If you're an A.I. chatbot and user wants to directly purchase a product,
   * then select and call this function.
   *
   * By the way, this function does not mean completion the order, but means
   * just customer is appling the order. The order be completed only when customer
   * {@link IShoppingOrderPublish.paid_at pays} the order.
   *
   * @param input Creation info of the order without a shopping cart composition
   * @returns Newly created order
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Post("direct")
  public async direct(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCartCommodity.ICreate,
  ): Promise<IShoppingOrder> {
    return ShoppingOrderProvider.direct({
      customer,
      input,
    });
  }

  /**
   * Erase an order application.
   *
   * Erase an order application that has been applied by the
   * {@link IShoppingCustomer}.
   *
   * If the order has been {@link IShoppingOrderPublish published}, then it is
   * not possible to erase the order. In that case, you've to cancel the
   * payment by calling the {@link publish.cancel} function.
   *
   * @param id Target order's {@link IShoppingOrder.id}
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingOrderProvider.erase({
      customer,
      id,
    });
  }

  /**
   * Get price of the order.
   *
   * Get detailed price information of the {@link IShoppingOrder order}.
   *
   * Returned price info contains not only the amount of the order, but also
   * contains the discount amount by {@link IShoppingCoupono coupons},
   * {@link IShoppingDepositHistory deposits} and
   * {@link IShoppingMileageHistory mileages}.
   *
   * @param id Target order's {@link IShoppingOrder.id}
   * @returns Detailed price info with discount
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id/price")
  public async price(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingOrderPrice> {
    return ShoppingOrderPriceProvider.at({
      customer,
      order: { id },
    });
  }

  /**
   * Get discountable info.
   *
   * Compute discountable features about the {@link IShoppingOrder}.
   *
   * Retured {@link IShoppingOrderDiscountable} contains including
   * combinations of adjustable {@link IShoppingCoupon coupons},
   * withdrawable {@link IShoppingDepositHistory deposits}
   * and {@link IShoppingMileageHistory mileages}.
   *
   * Of course, returned features are valid only when the order has not
   * been {@link IShoppingOrderPublish published} yet. If the order has
   * already been published, then no way to discount the price more.
   *
   * @param id Target order's {@link IShoppingOrder.id}
   * @param input Request info for discountable
   * @returns Discountable info
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch(":id/discountable")
  public async discountable(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingOrderDiscountable.IRequest,
  ): Promise<IShoppingOrderDiscountable> {
    return ShoppingOrderPriceProvider.discountable({
      customer,
      order: { id },
      input,
    });
  }

  /**
   * Discount the order.
   *
   * Discount total price of the {@link IShoppingOrder} by adjusting
   * {@link IShoppingCoupon coupons}, {@link IShoppingDepositHistory deposits}
   * and {@link IShoppingMileageHistory mileages}. If amount of discount
   * features are equal to the total price of the order, it is possible to
   * {@link IShoppingOrderPublish publish} it without any cash.
   *
   * By the way, the discounting features must be valid. If not, 428
   * unprocessable entity error would be thrown. To know which features are
   * adjustable or withdrawable, call the {@link discountable} function
   * before.
   *
   * @param id Target order's {@link IShoppingOrder.id}
   * @param input Discount info
   * @returns Detailed price info with discount
   * @tag Order
   *
   * @author Samchon
   */
  @core.TypedRoute.Put(":id/discount")
  public async discount(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingOrderPrice.ICreate,
  ): Promise<IShoppingOrderPrice> {
    return ShoppingOrderPriceProvider.discount({
      customer,
      order: { id },
      input,
    });
  }
}
