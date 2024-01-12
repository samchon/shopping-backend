import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCouponTicket } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCouponTicket";

import { ShoppingCouponTicketProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponTicketProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/coupons/tickets`)
export class ShoppingCustomerCouponTicketController {
  /**
   * List up every coupon tickets.
   *
   * List up every {@link IShoppingCouponTicket coupon tickets} of the
   * {@link IShoppingCustomer customer} with {@link IPage pagination}.
   *
   * For reference, coupon ticket means that a {@link IShoppingCoupon coupon}
   * has been taken by a customer. If the target coupon has expiration day or
   * date, the coupon ticket also has
   * {@link IShoppingCouponTicket.expired_at expiration time}, and such expired
   * tickets would not be listed up. Likewise, tickets used to
   * {@link IShoppingCouponTicketPayment pay} for the {@link IShoppingOrder order}
   * would not be listed up, either.
   *
   * Additionally, you can limit the result by configuring
   * {@link IShoppingCouponTicket.IRequest.search search condition} in the request
   * body. Also, it is possible to customize sequence order of records by
   * configuring {@link IShoppingCouponTicket.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated coupon tickets
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCouponTicket.IRequest,
  ): Promise<IPage<IShoppingCouponTicket>> {
    return ShoppingCouponTicketProvider.index(customer)(input);
  }

  /**
   * Get a coupon ticket.
   *
   * Get a {@link IShoppingCouponTicket coupon ticket} information with its ID.
   *
   * By the way, if the target coupon ticket has been
   * {@link IShoppingCouponTicket.expired_at expired} or used to
   * {@link IShoppingCouponTicketPayment pay} for the {@link IShoppingOrder order},
   * 410 gone exception would be thrown.
   *
   * @param id Target coupon ticket's {@link IShoppingCouponTicket.id}
   * @returns Coupon ticket info
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingCouponTicket> {
    return ShoppingCouponTicketProvider.at(customer)(id);
  }

  /**
   * Create a new coupon ticket.
   *
   * Create a new {@link IShoppingCouponTicket coupon ticket} of a specific
   * {@link IShoppingCoupon coupon} for the {@link IShoppingCustomer customer}.
   *
   * By the way, if the target coupon has been
   * {@link IShoppingCoupon.expired_at expired} or
   * {@link IShoppingCoupon.IInventory.volume out of stock} or
   * {@link IShoppingCoupon.IInventory.volume_per_citizen exhausted for him/her},
   * 410 gone exception would be thrown.
   *
   * Also, even though succeeded to create a new coupon ticket from the target
   * coupon, if the coupon has expiration day or date, the newly created ticket
   * also has {@link IShoppingCouponTicket.expired_at expiration time}, and it
   * would be disabled after the expiration time.
   *
   * @param input Creation info of coupon ticket
   * @returns Newly created coupon ticket
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCouponTicket.ICreate,
  ): Promise<IShoppingCouponTicket> {
    return ShoppingCouponTicketProvider.create(customer)(input);
  }

  // @core.TypedRoute.Post("take")
  // public async take(
  //   @ShoppingCustomerAuth() customer: IShoppingCustomer,
  //   @core.TypedBody() input: IShoppingCouponTicket.ITake,
  // ): Promise<IShoppingCouponTicket> {
  //   customer;
  //   input;
  //   return null!;
  // }
}
