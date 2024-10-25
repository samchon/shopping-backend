import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";

import { ShoppingCouponProvider } from "../../../../providers/shoppings/coupons/ShoppingCouponProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingCouponWritableController } from "../../base/discounts/ShoppingCouponWritableController";

export class ShoppingAdminCouponController extends ShoppingCouponWritableController(
  {
    path: "admins",
    AuthGuard: ShoppingAdminAuth,
  }
) {
  /**
   * @internal
   */
  @core.TypedRoute.Delete(":id/destroy")
  public destroy(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<void> {
    return ShoppingCouponProvider.destroy({
      admin,
      id,
    });
  }
}
