import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "./IShoppingDeliveryJourney";
import { IShoppingDeliveryPiece } from "./IShoppingDeliveryPiece";
import { IShoppingDeliveryShipper } from "./IShoppingDeliveryShipper";
import { IShoppingOrder } from "./IShoppingOrder";

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
   * List of journeys of the delivery.
   */
  journeys: IShoppingDeliveryJourney[];

  /**
   * List of pieces of the delivery.
   */
  pieces: IShoppingDeliveryPiece[] & tags.MinItems<1>;

  /**
   * List of shippers of the delivery.
   */
  shippers: IShoppingDeliveryShipper[];

  /**
   * State of the delivery.
   */
  state: IShoppingDelivery.State;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDelivery {
  /**
   * State of delivery
   *
   * - `none`: No delivery or journey record
   * - `underway`: Some pieces are over preparing, but others are not
   * - `preparing`: At least preparing
   * - `manufacturing`: At least manufacturing
   * - `shipping`: At least shipping
   * - `delivering`: At least delivering
   * - `arrived`: Every pieces are arrived
   */
  export type State =
    | "none"
    | "underway"
    | "preparing"
    | "manufacturing"
    | "shipping"
    | "delivering"
    | "arrived";

  export interface IRequest extends IPage.IRequest {
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export type SortableColumns = "delivery.created_at";
  }

  /**
   * Invert information of the delivery.
   */
  export interface IInvert extends IShoppingDelivery {
    /**
     * List of orders of the delivery.
     */
    orders: IShoppingOrder.IInvertFromDelivery[] & tags.MinItems<1>;
  }

  /**
   * Creation information of the delivery.
   */
  export interface ICreate {
    /**
     * List of pieces of the delivery.
     */
    pieces: IShoppingDeliveryPiece.ICreate[] & tags.MinItems<1>;

    /**
     * List of journeys of the delivery.
     *
     * This is initial data, and it is also possible to accumulate journey data
     * after the delivery creation.
     */
    journeys: IShoppingDeliveryJourney.ICreate[];

    /**
     * List of shippers of the delivery.
     */
    shippers: IShoppingDeliveryShipper.ICreate[];
  }
}
