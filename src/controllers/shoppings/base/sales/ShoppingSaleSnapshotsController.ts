import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";

import { IShoppingControllerProps } from "../IShoppingControllerProps";

export function ShoppingSaleSnapshotsController<
  Actor extends IShoppingActorEntity,
>(props: IShoppingControllerProps) {
  @Controller(`shoppings/${props.path}/sales/:saleId/snapshots`)
  abstract class ShoppingSaleSnapshotsController {
    @core.TypedRoute.Patch()
    public async index(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedBody() input: IPage.IRequest,
    ): Promise<IPage<IShoppingSaleSnapshot.ISummary>> {
      actor;
      saleId;
      input;
      return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSaleSnapshot> {
      actor;
      saleId;
      id;
      return null!;
    }

    @core.TypedRoute.Get(":id/flip")
    public async flip(
      @props.AuthGuard() actor: Actor,
      @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
      @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingSale> {
      actor;
      saleId;
      id;
      return null!;
    }
  }
  return ShoppingSaleSnapshotsController;
}
