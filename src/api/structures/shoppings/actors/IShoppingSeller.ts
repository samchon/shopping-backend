import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingBusinessAggregate } from "../sales/aggregates/IShoppingBusinessAggregate";
import { IShoppingCitizen } from "./IShoppingCitizen";
import { IShoppingCustomer } from "./IShoppingCustomer";
import { IShoppingMember } from "./IShoppingMember";

/**
 * Seller information.
 *
 * `IShoppingSeller` is an entity that embodies a person who registers
 * {@link IShoppingSale sales} to operate selling activities, with
 * {@link IShoppingMember membership} joining.
 *
 * For reference, unlike {@link IShoppingCustomer customers} which can
 * participate even without membership joining, seller must join membership
 * to operate sales. Also, seller must do the
 * {@link IShoppingCitizen real-name and mobile authentication}, too.
 *
 * @author Samchon
 */
export interface IShoppingSeller {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /**
   * Aggregation of business performance.
   */
  aggregate: IShoppingBusinessAggregate;

  /**
   * Creation tmie of record.
   *
   * Another words, the time when the seller has signed up.
   */
  created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingSeller {
  /**
   * Invert information starting from seller info.
   *
   * Instead of accessing to the seller information from the
   * {@link IShoppingCustomer.member} -> {@link IShoppingMember.seller},
   * `IShoppingSeller.IInvert` starts from the seller information
   * and access to the customer, member and {@link IShoppingCitizen citizen}
   * informations inversely.
   */
  export interface IInvert extends IShoppingSeller {
    /**
     * Discriminant for the type of customer.
     */
    type: "seller";

    /**
     * Membership joining information.
     */
    member: IShoppingMember.IInvert;

    /**
     * Customer, the connection information.
     */
    customer: IShoppingCustomer.IInvert;

    /**
     * Real-name and mobile number authentication information.
     */
    citizen: IShoppingCitizen;
  }

  export interface IRequest extends IPage.IRequest {
    search?: IRequest.ISearch;
    sort?: IPage.Sort<IRequest.SortableColumns>;
  }
  export namespace IRequest {
    export interface ISearch {
      id?: string & tags.Format<"uuid">;
      mobile?: string & tags.Pattern<"^[0-9]*$">;
      name?: string;
      email?: string & tags.Format<"email">;
      nickname?: string;
    }
    export type SortableColumns =
      | "seller.created_at"
      | "seller.goods.payments.real"
      | "seller.goods.publish_count"
      | "seller.reviews.average"
      | "seller.reviews.count";
  }

  export interface IJoin {}
}
