import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleSnapshotsController } from "../../base/sales/ShoppingSaleSnapshotsController";

export class ShoppingSellerSaleSnapshotsController extends ShoppingSaleSnapshotsController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  },
) {
  @core.TypedRoute.Post(":id/replica")
  public async replica(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingSale.ICreate> {
    seller;
    saleId;
    id;
    return null!;
  }
}
