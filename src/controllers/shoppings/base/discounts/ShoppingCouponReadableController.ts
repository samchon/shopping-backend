import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { ShoppingCouponProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingCouponReadableController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/coupons`)
  abstract class ShoppingCouponReadableController {
    /**
     * List up every coupons.
     *
     * List up every {@link IShoppingCoupon coupons} with pagination.
     *
     * If you want, you can limit the result by configuring
     * {@link IShoppingCoupon.IRequest.search search condition} in the request
     * body. Also, it is possible to customize sequence order of records by
     * configuring {@link IShoppingCoupon.IRequest.sort sort condition}.
     *
     * For reference, if you are a {@link IShoppingCustomer customer}, then
     * only {@link IShoppingCouponTicket ticketable} coupons would be listed up.
     * Otherwise, non-ticketable coupons would also be listed up.
     *
     * @param input Request info of pagination, searching and sorting
     * @returns Paginated coupons
     * @tag Discount
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingCoupon.IRequest,
    ): Promise<IPage<IShoppingCoupon>> {
      return ShoppingCouponProvider.index(actor)(input);
    }

    /**
     * Get a coupon info.
     *
     * Get a {@link IShoppingCoupon coupon} information.
     *
     * If you are a {@link IShoppingCustomer customer}, then only
     * {@link IShoppingCouponTicket ticketable} coupons are accessible. Non
     * ticketable coupons cause 410 gone error. Otherwise you are a
     * {@link IShoppingSeller seller} or {@link IShoppingAdministrator administrator},
     * non-ticketable coupons are also accessible.
     *
     * @param id Target coupon's {@link IShoppingCoupon.id}
     * @returns Coupon info
     * @tag Discount
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string,
    ): Promise<IShoppingCoupon> {
      return ShoppingCouponProvider.at(actor)(id);
    }
  }
  return ShoppingCouponReadableController;
}
