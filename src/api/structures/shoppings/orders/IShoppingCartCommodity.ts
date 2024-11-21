import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingPrice } from "../base/IShoppingPrice";
import { IShoppingSale } from "../sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "../sales/IShoppingSaleSnapshot";
import { IShoppingCartCommodityStock } from "./IShoppingCartCommodityStock";

/**
 * Item in a shopping cart.
 *
 * `IShoppingCartCommodity` is an entity that represents a
 * {@link IShoppingSaleSnapshot snapshot} of the items that
 * {@link IShoppingCustomer customer} has placed into his shopping cart with a
 * {@link IShoppingOrder purchase} in mind. And if the customer continues this
 * into an actual order in the future, `IShoppingCartCommodity` be changed to
 * {@link IShoppingOrderGood}.
 *
 * And while adding a sale snapshot to the shopping cart, the customer inevitably
 * selects specific {@link IShoppingSaleUnit units} and
 * {@link IShoppingSaleUnitStock final stocks} within the listing snapshot.
 * Information about these units and stocks is recorded in the subsidiary entity
 * {@link IShoppingCartCommodityStock}. Also, there is an attribute {@link volume}
 * that indicates how many sets of snapshots of the target commodity will be
 * purchased. This "volume" is a value that will be multiplied by
 * {@link IShoppingSaleUnitStock.IInvert.quantity}, the quantity for each
 * component.
 *
 * @author Samchon
 */
export interface IShoppingCartCommodity {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Invert information of the sale (snapshot), in the perspective of commodity.
   */
  sale: IShoppingSaleSnapshot.IInvert;

  /**
   * Whether current commodity is orderable or not.
   *
   * If this attribute is `false`, then the commodity is not orderable, because
   * it has already been ordered.
   */
  orderable: boolean;

  /**
   * Whether current commodity is pseudo or not.
   *
   * When this attribute is `true`, then the commodity is not the real one,
   * but just fake information only for calculating the discount effect by
   * {@link IShoppingCoupon coupons}.
   */
  pseudo: boolean;

  /**
   * Volume of the commodity to purchase.
   *
   * A value indicating how many sets would be multiplied to the children
   * {@link IShoppingSaleUnitStock.IInvert.quantity} values.
   */
  volume: number & tags.Type<"uint32"> & tags.Minimum<1>;

  /**
   * Price of the commodity.
   *
   * For reference, this price value has not been multiplied by the
   * {@link volume} value. It just sumed up the prices of the children
   * {@link IShoppingSaleUnitStock.IInvert.price} values.
   */
  price: IShoppingPrice;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCartCommodity {
  export interface IRequest extends IPage.IRequest {
    search?: IRequest.ISearch;
    sort?: IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      min_price?: number;
      max_price?: number;
      min_volumed_price?: number;
      max_volumed_price?: number;
      sale?: IShoppingSale.IRequest.ISearch;
    }
    export type SortableColumns =
      | IShoppingSale.IRequest.SortableColumns
      | "commodity.price"
      | "commodity.volume"
      | "commodity.volumed_price"
      | "commodity.created_at";
  }

  /**
   * Creation information of a shopping cart commodity.
   */
  export interface ICreate {
    /**
     * Target sale's {@link IShoppingSale.id}.
     */
    sale_id: string & tags.Format<"uuid">;

    /**
     * List of the stocks to be purchased.
     */
    stocks: IShoppingCartCommodityStock.ICreate[] & tags.MinItems<1>;

    /**
     * Volume of the commodity to purchase.
     *
     * A value indicating how many sets would be multiplied to the children
     * {@link IShoppingSaleUnitStock.IInvert.quantity} values.
     */
    volume: number & tags.Type<"uint32"> & tags.Minimum<1>;

    /**
     * Whether to accumulate the volume or not.
     *
     * If this attribute is not `false` and there's same commodity that
     * composed with same stocks and options, then the volume will be
     * accumulated to the existed one.
     *
     * Otherwise, duplicated commodity would be newly created.
     *
     * @default true
     */
    accumulate?: null | boolean;
  }

  /**
   * Update information of a shopping cart commodity.
   */
  export interface IUpdate {
    /**
     * Volume of the commodity to purchase.
     *
     * A value indicating how many sets would be multiplied to the children
     * {@link IShoppingSaleUnitStock.IInvert.quantity} values.
     */
    volume: number & tags.Type<"uint32"> & tags.Minimum<1>;
  }
}
