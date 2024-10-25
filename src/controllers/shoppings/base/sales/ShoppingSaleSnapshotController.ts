import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";

import { ShoppingSaleSnapshotProvider } from "../../../../providers/shoppings/sales/ShoppingSaleSnapshotProvider";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleSnapshotController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/sales/:saleId/snapshots`)
  abstract class ShoppingSaleSnapshotController {
    /**
     * List up every snapshots.
     *
     * Whenever {@link IShoppingSeller seller} updates a
     * {@link IShoppingSale sale}, the sale record is not updated but a new
     * {@link IShoppingSaleSnapshot snapshot} record is created to keep the
     * integrity of the sale history. This API function is for listing up
     * such snapshot records.
     *
     * Also, as you can see from the return type, returned snapshots are
     * summarized, not detailed. If you want to get the detailed information
     * of a snapshot, use {@link at} or {@link flipo} function for each snapshot.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s snapshots. Otherwise,
     * you can access to every snapshots of the sales even though the sale has
     * been closed or suspended.
     *
     * @param saleId Target sale's {@link IShoppingSale.id}
     * @param input Requestion info of pagination
     * @returns Paginated snapshots with summarized information
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IPage.IRequest
    ): Promise<IPage<IShoppingSaleSnapshot.ISummary>> {
      return ShoppingSaleSnapshotProvider.index({
        actor,
        sale: { id: saleId },
        input,
      });
    }

    /**
     * Get a snapshot info.
     *
     * Get a {@link IShoppingSaleSnapshot snapshot} with detailed information.
     *
     * As you can see from the return type, returned snapshot does not contain
     * the {@link IShoppingSale sale} info. If you want to get the sale info,
     * use the {@link flip} function instead.
     *
     * For reference, if you're a {@link IShoppingSeller seller}, you can only
     * access to the your own {@link IShoppingSale sale}'s snapshots. Otherwise,
     * you can access to every snapshots of the sales even though the sale has
     * been closed or suspended.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param id Target snapshot's {@link IShoppingSaleSnapshot.id}
     * @returns Detailed information of the snapshot
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingSaleSnapshot> {
      return ShoppingSaleSnapshotProvider.at({
        actor,
        sale: { id: saleId },
        id,
      });
    }

    /**
     * Get a flipped snapshot info.
     *
     * Get a {@link IShoppingSale sale} info of a flipped snapshot.
     *
     * As you can see from the return type, this function returns the
     * {@link IShoppingSale sale} info. By the way, the sale info is not the
     * latest one, but a flipped info in the snapshot side.
     *
     * Also, if you're a {@link IShoppingSeller seller}, you can only access to
     * the your own {@link IShoppingSale sale}'s snapshots. Otherwise, you can
     * access to every snapshots of the sales even though the sale has been
     * closed or suspended.
     *
     * @param saleId Belonged sale's {@link IShoppingSale.id}
     * @param id Target snapshot's {@link IShoppingSaleSnapshot.id}
     * @returns Detailed sale information in the snapshot side
     * @tag Sale
     *
     * @author Samchon
     */
    @core.TypedRoute.Get(":id/flip")
    public async flip(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">
    ): Promise<IShoppingSale> {
      return ShoppingSaleSnapshotProvider.flip({
        actor,
        sale: { id: saleId },
        id,
      });
    }
  }
  return ShoppingSaleSnapshotController;
}
