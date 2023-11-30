import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";
import { ShoppingSalesController } from "../../base/sales/ShoppingSalesController";

export class ShoppingSellerSalesController extends ShoppingSalesController({
  path: "sellers",
  AuthGuard: ShoppingSellerAuth,
}) {
  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedBody() input: IShoppingSale.ICreate,
  ): Promise<IShoppingSale> {
    seller;
    input;
    return null!;
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSale.ICreate,
  ): Promise<IShoppingSale> {
    seller;
    id;
    input;
    return null!;
  }

  @core.TypedRoute.Post(":id/replica")
  public async replica(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingSale.ICreate> {
    seller;
    id;
    return null!;
  }

  @core.TypedRoute.Delete(":id/pause")
  public async pause(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    seller;
    id;
  }

  @core.TypedRoute.Delete(":id/suspend")
  public async suspend(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    seller;
    id;
  }

  @core.TypedRoute.Put(":id/restore")
  public async restore(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    seller;
    id;
  }
}
