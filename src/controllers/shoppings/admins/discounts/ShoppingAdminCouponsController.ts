import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";

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
    @ShoppingAdminAuth() admin: IShoppingAdministrator,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    admin;
    id;
  }
}
