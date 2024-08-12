import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSaleSnapshotController } from "../../base/sales/ShoppingSaleSnapshotController";

export class ShoppingSellerSaleSnapshotController extends ShoppingSaleSnapshotController(
  {
    path: "sellers",
    AuthGuard: ShoppingSellerAuth,
  }
) {
  /**
   * Get replica of a snapshot.
   *
   * Get a {@link IShoppingSale.ICreate} typed info of the target
   * {@link IShoppingSaleSnapshot snapshot} record for replication.
   *
   * It would be useful for creating a new replication {@link IShoppingSale sale}
   * from the old snapshot.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param id Target snapshot's {@link IShoppingSaleSnapshot.id}
   * @returns Creation info of the sale for replication
   * @tag Sale
   *
   * @author Samchon
   */
  @core.TypedRoute.Post(":id/replica")
  public async replica(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<IShoppingSale.ICreate> {
    seller;
    saleId;
    id;
    return null!;
  }
}
