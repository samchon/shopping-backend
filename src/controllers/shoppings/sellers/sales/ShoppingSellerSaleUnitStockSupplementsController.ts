import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSaleUnitStockSupplement } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnitStockSupplement";

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
    seller;
    saleId;
    unitId;
    stockId;
    input;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingSellerAuth() seller: IShoppingSeller.IInvert,
    @core.TypedParam("saleId") saleId: string & tags.Format<"uuid">,
    @core.TypedParam("unitId") unitId: string & tags.Format<"uuid">,
    @core.TypedParam("stockId") stockId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingSaleUnitStockSupplement.ICreate,
  ): Promise<IShoppingSaleUnitStockSupplement> {
    seller;
    saleId;
    unitId;
    stockId;
    input;
    return null!;
  }
}
