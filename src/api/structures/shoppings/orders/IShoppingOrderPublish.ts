import { tags } from "typia";

import { IShoppingAddress } from "../actors/IShoppingAddress";
import { IShoppingDelivery } from "./IShoppingDelivery";

/**
 * Order completion and payment information.
 *
 * `IShoppingOrderPublish` is an entity that embodies the series of processes
 * in which a {@link IShoppingCustomer customer} pays for his or her
 * {@link IShoppingOrder order}, thereby completing the order. And only after
 * the order is {@link paid_at completed}, can the {@link IShoppingSeller seller}
 * recognize that the customer has purchased his product.
 *
 * By the way, please note that just because the `IShoppingOrderPublish` record
 * exists, it does not mean that the payment has been completed. Of course, with
 * "credit cards" and "Google Pay", payment application and payment occur at the
 * same time. However, there are some cases where payment is made after the
 * payment application, such as "bank transfer" or "virtual account payment".
 * Therefore, to see the completion of payment, be sure to check the
 * {@link paid_at} property.
 *
 * In addition, even after payment has been made, there may be cases where it is
 * suddenly cancelled, so please be aware of this as well.
 *
 * @author Samchon
 */
export interface IShoppingOrderPublish
  extends IShoppingOrderPublish.IInvertFromDelivery {
  /**
   * List of deliveries.
   *
   * An {@link IShoppingOrder order} can be delivered in multiple times.
   * Of course, the opposite case is also possible, that a
   * {@link IShoppingDelivery delivery} can be composed of multiple orders.
   */
  deliveries: IShoppingDelivery[];

  /**
   * State of the order, about the deliveries.
   */
  state: IShoppingDelivery.State;
}
export namespace IShoppingOrderPublish {
  /**
   * Invert information from the delivery.
   */
  export interface IInvertFromDelivery {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Creation time of the record.
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * Time when the order was paid.
     */
    paid_at: null | (string & tags.Format<"date-time">);

    /**
     * Time when the payment was cancelled.
     */
    cancelled_at: null | (string & tags.Format<"date-time">);

    /**
     * Address where the {@link IShoppingOrderGood goods} to be delivered.
     */
    address: IShoppingAddress;
  }

  /**
   * Creation info of the publish.
   */
  export interface ICreate {
    /**
     * Address to receive.
     */
    address: IShoppingAddress.ICreate;

    /**
     * Payment identifier from the payment vendor service.
     *
     * If the order has been discounted for entire order price, then no need
     * to send payment vendor info. Instead, you just configure the `null`
     * value to this property.
     */
    vendor: IPaymentIdentifier | null;
  }

  /**
   * Payment identifier from the payment vendor service.
   */
  export interface IPaymentIdentifier {
    /**
     * The vendor code who will receive the payment.
     */
    code: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-payment-vendor": true;
      }>;

    /**
     * The payment uid.
     */
    uid: string &
      tags.JsonSchemaPlugin<{
        "x-wrtn-payment-uid": true;
      }>;
  }
}
