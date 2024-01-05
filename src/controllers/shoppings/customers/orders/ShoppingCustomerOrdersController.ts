import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { ShoppingOrderPriceProvider } from "../../../../providers/shoppings/orders/ShoppingOrderPriceProvider";
import { ShoppingOrderProvider } from "../../../../providers/shoppings/orders/ShoppingOrderProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";
import { ShoppingOrdersController } from "../../base/orders/ShoppingOrdersController";

export class ShoppingCustomerOrdersController extends ShoppingOrdersController({
  path: "customers",
  AuthGuard: ShoppingCustomerAuth,
}) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingOrder.ICreate,
  ): Promise<IShoppingOrder> {
    return ShoppingOrderProvider.create(customer)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingOrderProvider.erase(customer)(id);
  }

  @core.TypedRoute.Get(":id/price")
  public async price(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingOrderPrice> {
    return ShoppingOrderPriceProvider.at(customer)({ id });
  }

  @core.TypedRoute.Patch(":id/discountable")
  public async discountable(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingOrderDiscountable.IRequest,
  ): Promise<IShoppingOrderDiscountable> {
    return ShoppingOrderPriceProvider.discountable(customer)({ id })(input);
  }

  @core.TypedRoute.Put(":id/discount")
  public async discount(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingOrderPrice.ICreate,
  ): Promise<IShoppingOrderPrice> {
    return ShoppingOrderPriceProvider.discount(customer)({ id })(input);
  }
}
