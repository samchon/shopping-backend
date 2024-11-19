import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingPrice } from "../base/IShoppingPrice";
import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingSaleSnapshot } from "./IShoppingSaleSnapshot";
import { IShoppingSaleReview } from "./inquiries/IShoppingSaleReview";

/**
 * Seller sales products.
 *
 * `IShoppingSale` is an entity that embodies "product sales" (sales)
 * information registered by the {@link ISoppingSeller seller}. And the main
 * information of the sale is recorded in the sub {@link IShoppingSaleSnapshot},
 * not in the main `IShoppingSale`. When a seller changes a previously registered
 * item, the existing `IShoppingSale` record is not changed, but a new
 * {@link IShoppingSaleSnapshot snapshot} record be created.
 *
 * This is to preserve the {@link IShoppingCustomer customer}'s
 * {@link IShoppingOrder purchase history} flawlessly after the customer
 * purchases a specific item, even if the seller changes the components or
 * price of the item. It is also intended to support sellers in so-called A/B
 * testing, which involves changing components or prices and measuring the
 * performance in each case.
 *
 * @author Samchon
 */
export interface IShoppingSale
  extends IShoppingSaleSnapshot,
    IShoppingSale.ITimestamps {
  /**
   * Belonged section.
   */
  section: IShoppingSection;

  /**
   * Seller who has registered the sale.
   */
  seller: IShoppingSeller.IInvert;
}
export namespace IShoppingSale {
  /**
   * Definitions of timepoints of sale.
   */
  export interface ITimestamps {
    /**
     * Creation time of the record.
     *
     * Note that, this property is different with {@link opened_at},
     * which means the timepoint of the sale is opened.
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * Last updated time of the record.
     *
     * In another words, creation time of the last snapshot.
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * Paused time of the sale.
     *
     * The sale is paused by the seller, for some reason.
     *
     * {@link IShoppingCustomer Customers} can still see the sale on the
     * both list and detail pages, but the sale has a warning label
     * "The sale is paused by the seller".
     */
    paused_at: null | (string & tags.Format<"date-time">);

    /**
     * Suspended time of the sale.
     *
     * The sale is suspended by the seller, for some reason.
     *
     * {@link IShoppingCustomer Customers} cannot see the sale on the
     * both list and detail pages. It is almost same with soft delettion,
     * but there's a little bit difference that the owner
     * {@link IShoppingSeller seller} can still see the sale and resume it.
     *
     * Of course, the {@link IShoppingCustomer customers} who have
     * already purchased the sale can still see the sale on the
     * {@link IShoppingOrder order} page.
     */
    suspended_at: null | (string & tags.Format<"date-time">);

    /**
     * Opening time of the sale.
     */
    opened_at: null | (string & tags.Format<"date-time">);

    /**
     * Closing time of the sale.
     *
     * If this value is `null`, the sale be continued forever.
     */
    closed_at: null | (string & tags.Format<"date-time">);
  }

  /**
   * Request of summarized sales with pagination and searching/sorting options.
   */
  export interface IRequest extends IPage.IRequest {
    /**
     * Search conditions.
     */
    search?: null | IRequest.ISearch;

    /**
     * Sorting conditions.
     */
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      show_paused?: null | boolean;
      show_suspended?: null | boolean | "only";
      title?: null | string;
      content?: null | string;
      title_or_content?: null | string;
      price?: null | IShoppingPrice.ISearch;
      review?: null | IShoppingSaleReview.IInvertSearch;
      section_codes?: null | string[];
      channel_codes?: null | string[];
      channel_category_ids?: null | string[];
      tags?: null | string[];
      seller?: null | IShoppingSeller.IRequest.ISearch;
    }

    export type SortableColumns =
      | IShoppingSeller.IRequest.SortableColumns
      | "goods.publish_count"
      | "goods.payments.real"
      | "reviews.average"
      | "reviews.count"
      | "sale.created_at"
      | "sale.updated_at"
      | "sale.opened_at"
      | "sale.closed_at"
      | "sale.content.title"
      | "sale.price_range.lowest.real"
      | "sale.price_range.highest.real";
  }

  /**
   * Summarized information of sale.
   *
   * This summarized information being used for pagination.
   */
  export interface ISummary
    extends IShoppingSaleSnapshot.ISummary,
      ITimestamps {
    /**
     * Belonged section.
     */
    section: IShoppingSection;

    /**
     * Seller who has registered the sale.
     */
    seller: IShoppingSeller.IInvert;
  }

  /**
   * Creation information of sale.
   */
  export interface ICreate extends IShoppingSaleSnapshot.ICreate {
    /**
     * Belonged section's {@link IShoppingSection.code}.
     */
    section_code: string;

    /**
     * Initial status of the sale.
     *
     * `null` or `undefined`: No restriction
     * `paused`: Starts with {@link ITimestamps.paused_at paused} status
     * `suspended`: Starts with {@link ITimestamps.suspended_at suspended} status
     */
    status?: null | "paused" | "suspended";

    /**
     * Opening time of the sale.
     */
    opened_at: null | (string & tags.Format<"date-time">);

    /**
     * Closing time of the sale.
     *
     * If this value is `null`, the sale be continued forever.
     */
    closed_at: null | (string & tags.Format<"date-time">);
  }

  /**
   * Update information of sale.
   */
  export type IUpdate = IShoppingSaleSnapshot.ICreate;

  /**
   * Update opening time information of sale.
   */
  export interface IUpdateOpeningTime {
    /**
     * Opening time of the sale.
     */
    opened_at: null | (string & tags.Format<"date-time">);

    /**
     * Closing time of the sale.
     *
     * If this value is `null`, the sale be continued forever.
     */
    closed_at: null | (string & tags.Format<"date-time">);
  }
}
