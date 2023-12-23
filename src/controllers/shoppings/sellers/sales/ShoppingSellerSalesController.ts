import core from "@nestia/core";
import { tags } from "typia";

import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";

import { ShoppingSaleProvider } from "../../../../providers/shoppings/sales/ShoppingSaleProvider";

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
    return ShoppingSaleProvider.create(seller)(input);
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSale.IUpdate,
  ): Promise<IShoppingSale> {
    return ShoppingSaleProvider.update(seller)(id)(input);
  }

  @core.TypedRoute.Put(":id/open")
  public async open(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSale.IUpdateOpeningTime,
  ): Promise<void> {
    return ShoppingSaleProvider.updateOpeningTime(seller)(id)(input);
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
