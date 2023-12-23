import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleUnitStockSupplement } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

import { ShoppingSaleSnapshotUnitStockSupplementProvider } from "../../../../providers/shoppings/sales/ShoppingSaleSnapshotUnitStockSupplementProvider";

import { ShoppingSellerAuth } from "../../../../decorators/ShoppingSellerAuth";

@Controller(
  "shoppings/sellers/sales/:saleId/units/:unitId/stocks/:stockId/supplements",
)
export class ShoppingSellerSaleUnitStockSupplementsController {
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("unitId") unitId: string & tags.Format<"uuid">,
    @core.TypedParam("stockId") stockId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleUnitStockSupplement.IRequest,
  ): Promise<IPage<IShoppingSaleUnitStockSupplement>> {
    return ShoppingSaleSnapshotUnitStockSupplementProvider.index(seller)({
      sale: { id: saleId },
      unit: { id: unitId },
      stock: { id: stockId },
    })(input);
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("unitId") unitId: string & tags.Format<"uuid">,
    @core.TypedParam("stockId") stockId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleUnitStockSupplement.ICreate,
  ): Promise<IShoppingSaleUnitStockSupplement> {
    return ShoppingSaleSnapshotUnitStockSupplementProvider.create(seller)({
      sale: { id: saleId },
      unit: { id: unitId },
      stock: { id: stockId },
    })(input);
  }

  @core.TypedRoute.Put(":id")
  public async update(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("unitId") unitId: string & tags.Format<"uuid">,
    @core.TypedParam("stockId") stockId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleUnitStockSupplement.ICreate,
  ): Promise<void> {
    return ShoppingSaleSnapshotUnitStockSupplementProvider.update(seller)({
      sale: { id: saleId },
      unit: { id: unitId },
      stock: { id: stockId },
    })(id)(input);
  }

  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("unitId") unitId: string & tags.Format<"uuid">,
    @core.TypedParam("stockId") stockId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingSaleSnapshotUnitStockSupplementProvider.erase(seller)({
      sale: { id: saleId },
      unit: { id: unitId },
      stock: { id: stockId },
    })(id);
  }
}
