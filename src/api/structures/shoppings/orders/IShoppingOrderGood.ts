import { tags } from "typia";

import { IShoppingCartCommodity } from "./IShoppingCartCommodity";
import { IShoppingDelivery } from "./IShoppingDelivery";
import { IShoppingOrderPrice } from "./IShoppingOrderPrice";

/**
 * Information about the individual goods that make up your order.
 *
 * `IShoppingOrderGood` is an entity that represents each good ordered by a
 * {@link IShoppingCustomer customer}, and the record is created in the process
 * of upgrading the product {@link IShoppingCartCommodity commodity} in the
 * shopping cart to a good due to the customer's {@link IShoppingOrder order}
 * request.
 *
 * And `IShoppingOrderGood`, like {@link IShoppingCartCommodity}, is a concept
 * that corresponds to the listing {@link IShoppingSaleSnapshot sale snapshot}.
 *
 * For reference, `IShoppingOrderGood` also contains {@link volume} information
 * separately from the belonging {@link IShoppingCartCommodity.volume}. This is
 * because there are some cases where you put 3 books in your shopping cart and
 * then change them to 4 during the actual order application process. This is to
 * increase the reusability of the shopping cart by changing the volume attribute
 * of the current entity rather than directly changing the commodity information.
 *
 * In addition, `IShoppingOrderGood` becomes the most basic unit for the post-order
 * process, that is, after service (A/S). For example, after receiving a
 * customer's product, confirming the order is recorded in the {@link confirmed_at}
 * attribute. Additionally, `IShoppingOrderGood` is the unit in which customers
 * issues or request exchanges or refunds for ordered products.
 *
 * @author Samchon
 */
export interface IShoppingOrderGood {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Commodity that is the basis of the good.
   */
  commodity: IShoppingCartCommodity;

  /**
   * Volume of the good.
   *
   * The value multiplied to {@link IShoppingCartCommodityStock.quantity}.
   * It's purpose is exactly same with {@link IShoppingCartCommodity.volume},
   * but rewritten because the {@link IShoppingCartCommodity} records are reusable
   * until payment.
   */
  volume: number & tags.Type<"uint32">;

  /**
   * Price information including discounts and multipled volume.
   */
  price: IShoppingOrderPrice.ISummary;

  /**
   * State of delivery about the good.
   */
  state: null | IShoppingDelivery.State;

  /**
   * Confirmation time of order good.
   *
   * When be confirmed, customer can't request refund or exchange.
   *
   * The confirmation be accomplished by following cases.
   *
   * - Customer does it directly.
   * - 14 days after the delivery.
   */
  confirmed_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingOrderGood {
  /**
   * Creation information of the good.
   */
  export interface ICreate {
    /**
     * Target commodity's {@link IShoppingCartCommodity.id}.
     */
    commodity_id: string & tags.Format<"uuid">;

    /**
     * Volume of the good.
     *
     * The value multiplied to {@link IShoppingCartCommodityStock.quantity}.
     * It's purpose is exactly same with {@link IShoppingCartCommodity.volume},
     * but rewritten because the {@link IShoppingCartCommodity} records are reusable
     * until payment.
     */
    volume: number & tags.Type<"uint32">;
  }
}
