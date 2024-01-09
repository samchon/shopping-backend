import { tags } from "typia";

/**
 * Journey of delivery.
 *
 * `IShoppingDeliveryJourney` is a subsidiary entity of {@link IShoppingDelivery},
 * describing each journey of the delivery. For reference, the word journey
 * means each step of the delivery process, such as preparing, shipping, and
 * delivering {@link IShoppingOrderGood goods} to the
 * {@link IShoppingCustomer customer}.
 *
 * @author Samchon
 */
export interface IShoppingDeliveryJourney
  extends IShoppingDeliveryJourney.ICreate {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;

  /**
   * Deletion time of the record.
   */
  deleted_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingDeliveryJourney {
  export type Type = "preparing" | "manufacturing" | "shipping" | "delivering";

  /**
   * Creation information of the delivery journey.
   */
  export interface ICreate {
    /**
     * Type of journey.
     *
     * - preparing
     * - manufacturing
     * - shipping
     * - delivering
     */
    type: Type;

    /**
     * Title of journey.
     */
    title: null | string;

    /**
     * Description of journey.
     */
    description: null | string;

    /**
     * Start time of the journey.
     */
    started_at: null | (string & tags.Format<"date-time">);

    /**
     * Completion time of the journey.
     */
    completed_at: null | (string & tags.Format<"date-time">);
  }

  export type IUpdate = ICreate;

  /**
   * Completion information of the delivery journey.
   */
  export interface IComplete {
    /**
     * Completion time of the journey.
     */

    completed_at: null | (string & tags.Format<"date-time">);
  }
}
