import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";

import { ShoppingCouponProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingCouponsWritableController } from "../../base/discounts/ShoppingCouponsWritableController";

export class ShoppingAdminCouponsController extends ShoppingCouponsWritableController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  },
) {
  /**
   * @internal
   */
  @core.TypedRoute.Delete(":id/destroy")
  public async destroy(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingCouponProvider.destroy(admin)(id);
  }
}
