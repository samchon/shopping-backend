import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "./IShoppingDeliveryJourney";
import { IShoppingDeliveryPiece } from "./IShoppingDeliveryPiece";

/**
 * Delivery information.
 *
 * When delivering {@link IShoppingOrderGood goods} to
 * {@link IShoppingCustomer customer}, {@link IShoppingSeller seller} can deliver
 * multiple {@link IShoppingSaleUnitStock stocks}, goods at once. Also, it is
 * possible to deliver a stock or good in multiple times due to physical restriction
 * like volume or weight problem.
 *
 * As you can see from above, the relationship between delivery with
 * {@link IShoppingOrder order} (or {@link IShoppingOrderGood good}) is not 1: 1 or
 * N: 1, but M: N. Entity `IShoppingDelivery` has been designed to represent such
 * relationship, by referencing target stocks or goods through subsidiary entity
 * {@link IShoppingDeliveryPiece}.
 *
 * Also, delivery does not end with only one step. It has multiple processes like
 * manufacturing, planning, shipping and delivering. Those steps are represented by
 * another subsidiary entity {@link IShoppingDeliveryJourney}.
 *
 * @author Samchon
 */
export interface IShoppingDelivery {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Seller who've delivered the goods.
   */
  seller: IShoppingSeller;

  /**
   * Invoice code if exists.
   */
  invoice_code: string | null;

  /**
   * List of pieces of the delivery.
   */
  pieces: IShoppingDeliveryPiece[];

  /**
   * List of journeys of the delivery.
   */
  journeys: IShoppingDeliveryJourney[];

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace ShoppingDelivery {
  /**
   * Creation information of the delivery.
   */
  export interface ICreate {
    /**
     * Invoice code if exists.
     */
    invoice_code: string | null;

    /**
     * List of pieces of the delivery.
     */
    pieces: IShoppingDeliveryPiece.ICreate[];

    /**
     * List of journeys of the delivery.
     *
     * This is initial data, and it is also possible to accumulate journey data
     * after the delivery creation.
     */
    journeys: IShoppingDeliveryJourney.ICreate[];
  }
}
