import core from "@nestia/core";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { ShoppingCouponProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";
import { ShoppingCouponsReadableController } from "./ShoppingCouponsReadableController";

export function ShoppingCouponsWritableController<
  Actor extends IShoppingSeller.IInvert | IShoppingAdministrator.IInvert,
>(props: IShoppingControllerProps) {
  abstract class ShoppingCouponsWritableController extends ShoppingCouponsReadableController<Actor>(
    props,
  ) {
    @core.TypedRoute.Post()
    public async create(
      @props.AuthGuard() actor: Actor,
      @core.TypedBody() input: IShoppingCoupon.ICreate,
    ): Promise<IShoppingCoupon> {
      return ShoppingCouponProvider.create(actor)(input);
    }

    @core.TypedRoute.Delete(":id")
    public async erase(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("id") id: string,
    ): Promise<void> {
      return ShoppingCouponProvider.erase(actor)(id);
    }
  }
  return ShoppingCouponsWritableController;
}
