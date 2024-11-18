import { tags } from "typia";

import { IShoppingPrice } from "../base/IShoppingPrice";
import { IShoppingCouponTicketPayment } from "../coupons/IShoppingCouponTicketPayment";

/**
 * Price infromation of the order including discounts.
 *
 * @author Samchon
 */
export interface IShoppingOrderPrice extends IShoppingOrderPrice.ISummary {
  /**
   * List of discount coupon ticket payments.
   */
  ticket_payments: IShoppingCouponTicketPayment[];
}
export namespace IShoppingOrderPrice {
  /**
   * Summarized information of the order price.
   */
  export interface ISummary extends IShoppingPrice {
    /**
     * Amount of the cash payment.
     */
    cash: number &
      tags.Minimum<0> &
      tags.JsonSchemaPlugin<{
        "x-wrtn-payment-price": true;
      }>;

    /**
     * Amount of the deposit payment.
     */
    deposit: number & tags.Minimum<0>;

    /**
     * Amount of the mileage payment.
     */
    mileage: number & tags.Minimum<0>;

    /**
     * Amount of the discount coupon ticket payment.
     */
    ticket: number & tags.Minimum<0>;
  }

  export interface ICreate {
    deposit: number;
    mileage: number;
    coupon_ids: Array<string & tags.Format<"uuid">>;
  }
}
