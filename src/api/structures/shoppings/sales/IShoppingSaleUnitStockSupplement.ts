import { tags } from "typia";

import { IPage } from "../../common/IPage";

/**
 * Supplementation of inventory quantity of stock.
 *
 * You know what? If a {@link IShoppingSaleUnitStock stock} has been sold over
 * its {@link IShoppingSaleUnitStock.ICreate.quantity initial inventory quantity},
 * the stock can't be sold anymore, because of out of stock. In that case, how the
 * {@link IShoppingSeller} should do?
 *
 * When the sotck is sold out, seller can supplement the inventory record by
 * registering this `IShoppingSaleUnitStockSupplement` record. Right, this
 * `IShoppingSaleUnitStockSupplement` is an entity that embodies the
 * supplementation of the inventory quantity of the belonged stock.
 *
 * @author Samchon
 */
export interface IShoppingSaleUnitStockSupplement {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Supplemented quantity.
   */
  value: number & tags.Type<"uint32">;

  /**
   * Creation time of the record.
   *
   * Another words, the time when inventory of the stock being supplemented.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingSaleUnitStockSupplement {
  /**
   * Request information of the stock supplement list.
   */
  export interface IRequest extends IPage.IRequest {
    /**
     * Sortable columns.
     */
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export type SortableColumns = "created_at";
  }

  /**
   * Creation information of the supplement.
   */
  export interface ICreate {
    /**
     * Supplemented quantity.
     */
    value: number & tags.Type<"uint32">;
  }

  /**
   * Update information of the supplement.
   */
  export type IUpdate = ICreate;
}
