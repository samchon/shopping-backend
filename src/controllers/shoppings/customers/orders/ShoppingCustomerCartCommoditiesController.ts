import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";

import { ShoppingCartCommodityProvider } from "../../../../providers/shoppings/orders/ShoppingCartCommodityProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/carts/:cartId/commodities`)
export class ShoppingCustomerCartCommoditiesController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartCommodity.IRequest,
  ): Promise<IPage<IShoppingCartCommodity>> {
    return ShoppingCartCommodityProvider.index(customer)(
      cartId ? { id: cartId } : null,
    )(input);
  }

  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingCartCommodity> {
    return ShoppingCartCommodityProvider.at(customer)(
      cartId ? { id: cartId } : null,
    )(id);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartCommodity.ICreate,
  ): Promise<IShoppingCartCommodity> {
    return ShoppingCartCommodityProvider.create(customer)(
      cartId ? { id: cartId } : null,
    )(input);
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingCartCommodity.IUpdate,
  ): Promise<void> {
    return ShoppingCartCommodityProvider.update(customer)(
      cartId ? { id: cartId } : null,
    )(id)(input);
  }

  @core.TypedRoute.Get(":id/replica")
  public async replica(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingCartCommodity.ICreate> {
    customer;
    cartId;
    id;
    return null!;
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingCartCommodityProvider.erase(customer)(
      cartId ? { id: cartId } : null,
    )(id);
  }

  @core.TypedRoute.Patch("discountable")
  public async discountable(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("cartId")
    cartId: null | (string & tags.Format<"uuid">),
    @core.TypedBody() input: IShoppingCartDiscountable.IRequest,
  ): Promise<IShoppingCartDiscountable> {
    customer;
    cartId;
    input;
    return null!;
  }
}
