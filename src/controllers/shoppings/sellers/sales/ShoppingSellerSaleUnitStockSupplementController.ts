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
export class ShoppingSellerSaleUnitStockSupplementController {
  /**
   * List up every supplements.
   *
   * List up every {@link IShoppingSaleUnitStockSupplement supplement histories}
   * of a specific {@link IShoppingSaleUnitStock stock}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingSaleUnitStockSupplement.IRequest.search search condition} in
   * the request body. Also, it is possible to customize sequence order of
   * records by configuring {@link IShoppingSaleUnitStockSupplement.IRequest.sort}
   * property.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param unitId Belonged unit's {@link IShoppingSaleUnit.id}
   * @param stockId Target stock's {@link IShoppingSaleUnitStock.id}
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated supplements
   * @tag Sale
   *
   * @author Samchon
   */
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

  /**
   * Create a supplement.
   *
   * Create a {@link IShoppingSaleUnitStockSupplement supplement history} of a
   * specific {@link IShoppingSaleUnitStock stock}.
   *
   * Therefore, {@link IShoppingSaleUnitStockInventory.income inventory} of the
   * target stock will be increased by the
   * {@link IShoppingSaleUnitStockSupplement.value supplement's value}.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param unitId Belonged unit's {@link IShoppingSaleUnit.id}
   * @param stockId Target stock's {@link IShoppingSaleUnitStock.id}
   * @param input Ceate info of the supplement
   * @returns Created supplement
   * @tag Sale
   *
   * @author Samchon
   */
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

  /**
   * Update a supplement.
   *
   * Update quantity value of a {@link IShoppingSaleUnitStockSupplement supplement}
   * of a specific {@link IShoppingSaleUnitStock stock}.
   *
   * Therefore, {@link IShoppingSaleUnitStockInventory.income inventory} of the
   * target stock will be changed by the
   * {@link IShoppingSaleUnitStockSupplement.value supplement's value}.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param unitId Belonged unit's {@link IShoppingSaleUnit.id}
   * @param stockId Target stock's {@link IShoppingSaleUnitStock.id}
   * @param id Target supplement's {@link IShoppingSaleUnitStockSupplement.id}
   * @param input Update info (quantity) of the supplement
   * @tag Sale
   *
   * @author Samchon
   */
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

  /**
   * Erase a supplement.
   *
   * Erase a {@link IShoppingSaleUnitStockSupplement supplement} of a specific
   * {@link IShoppingSaleUnitStock stock}.
   *
   * Therefore, {@link IShoppingSaleUnitStockInventory.income inventory} of the
   * target stock will be decreased by the
   * {@link IShoppingSaleUnitStockSupplement.value supplement's value}.
   *
   * @param saleId Belonged sale's {@link IShoppingSale.id}
   * @param unitId Belonged unit's {@link IShoppingSaleUnit.id}
   * @param stockId Target stock's {@link IShoppingSaleUnitStock.id}
   * @param id Target supplement's {@link IShoppingSaleUnitStockSupplement.id}
   * @tag Sale
   *
   * @author Samchon
   */
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
