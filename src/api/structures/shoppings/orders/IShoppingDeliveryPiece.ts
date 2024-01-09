import { tags } from "typia";

/**
 * Which stocks are delivered.
 *
 * `IShoppingDeliveryPiece` is a subsidiary entity of {@link IShoppingDelivery},
 * describing how much quantity is delivered for each
 * {@link IShoppingSaleUnitStock stock} in {@link IShoppingOrder}.
 *
 * For reference, as an order can be delivered in multiple times due to volume
 * or weight problem, it is possible to have multiple `IShoppingDeliveryPiece`
 * records for a single stock.
 *
 * @author Samchon
 */
export interface IShoppingDeliveryPiece extends IShoppingDeliveryPiece.ICreate {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;
}
export namespace IShoppingDeliveryPiece {
  export interface IRequest {
    publish_ids: Array<string & tags.Format<"uuid">>;
  }

  /**
   * Creation information of the delivery piece.
   */
  export interface ICreate {
    /**
     * Target order's {@link IShoppingOrderPublish.id}.
     */
    publish_id: string & tags.Format<"uuid">;

    /**
     * Target good's {@link IShoppingOrderGood.id}.
     */
    good_id: string & tags.Format<"uuid">;

    /**
     * Target stock's {@link IShoppingSaleUnitStock.id}.
     */
    stock_id: string & tags.Format<"uuid">;

    /**
     * Quantity of the stock.
     *
     * It can be precision value to express splitted shipping.
     */
    quantity: number & tags.Minimum<0>;
  }
}
