import { tags } from "typia";

import { IShoppingCartCommodityStockChoice } from "./IShoppingCartCommodityStockChoice";

/**
 * Final stock information of commodity added to the shopping cart.
 *
 * `IShoppingCartCommodityStock` is a subsidiary entity of
 * {@link IShoppingCartCommodity} that embodies the information of the
 * {@link IShoppingSaleSnapshot snapshot} of the items in the shopping cart,
 * and is a concept that corresponds to the individual
 * {@link IShoppingSaleUnit units} in the target item snapshot and the
 * {@link IShoppingSaleUnitStock stock} finally selected among those units.
 *
 * Therefore, if the {@link IShoppingCustomer customer} selects multiple units
 * and stocks from the target sale snapshot, the attributed commodity record also
 * has multiple corresponding `IShoppingCartCommodityStock` records.
 *
 * And `IShoppingCartCommodityStock` has a {@link quantity} property that indicates
 * how many final stocks would be purchased in total. The final quantity actually
 * purchased can be multiplied by the {@link IShoppingCartCommodity.volume} value
 * of the parent entity.
 *
 * @author Samchon
 */
export namespace IShoppingCartCommodityStock {
  /**
   * Creation information of the commodity stock of shopping cart.
   *
   * When record being created, its corresponding structure would be
   * {@link IShoppingSaleSnapshotUnit.IInvert} and
   * {@link IShoppingSaleSnapshotUnitStock.IInvert}.
   */
  export interface ICreate {
    /**
     * Target unit's {@link IShoppingSaleUnit.id}.
     */
    unit_id: string & tags.Format<"uuid">;

    /**
     * Target stock's {@link IShoppingSaleUnitStock.id}.
     *
     * It must be matched with the {@link choices} property.
     */
    stock_id: string & tags.Format<"uuid">;

    /**
     * Creation information of the choices for each option.
     */
    choices: IShoppingCartCommodityStockChoice.ICreate[];

    /**
     * Quantity of the stock to purchase.
     *
     * This value is multiplied by the {@link IShoppingCartCommodity.volume}.
     */
    quantity: number & tags.Type<"uint32"> & tags.Minimum<1>;
  }
}
