import core from "@nestia/core";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { ShoppingCouponProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";
import { ShoppingCouponReadableController } from "./ShoppingCouponReadableController";

export function ShoppingCouponWritableController<
  Actor extends IShoppingSeller.IInvert | IShoppingAdministrator.IInvert,
>(props: IShoppingControllerProps) {
  abstract class ShoppingCouponWritableController extends ShoppingCouponReadableController<Actor>(
    props
  ) {
    /**
     * Create a new coupon.
     *
     * Create a new {@link IShoppingCoupon coupon} with given information.
     *
     * By the way, if you are a {@link IShoppingSeller seller}, you have to
     * add include direction's {@link IShoppingCouponSellerCriteria} or
     * {@link IShoppingCouponSaleCriteria} condition. This is because only
     * {@link IShoppingAdministrator administrators} can create a coupon
     * which can be used throughout the market. Seller must limit the usage
     * range by his/her {@link IShoppingSale sale(s)}.
     *
     * Of course, when adminstrator is planning to make a general coupon
     * that can be used throughout the market, the administrator must
     * get agree from the sellers who are going to be affected.
     *
     * @param input Creation info of the coupon
     * @returns Newly created coupon
     * @tag Discount
     *
     * @author Samchon
     */
    @core.TypedRoute.Post()
    public async create(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingCoupon.ICreate
    ): Promise<IShoppingCoupon> {
      return ShoppingCouponProvider.create(actor)(input);
    }

    /**
     * Erase a coupon.
     *
     * Erase a {@link IShoppingCoupon coupon} with given ID.
     *
     * For reference, if there're some {@link IShoppingCouponTicket tickets}
     * which are already issued from the target coupon, they would not be affected.
     * Those tickets are still valid until their expration time.
     *
     * @param id Target coupon's {@link IShoppingCoupon.id}
     * @tag Discount
     *
     * @author Samchon
     */
    @core.TypedRoute.Delete(":id")
    public async erase(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string
    ): Promise<void> {
      return ShoppingCouponProvider.erase(actor)(id);
    }
  }
  return ShoppingCouponWritableController;
}
