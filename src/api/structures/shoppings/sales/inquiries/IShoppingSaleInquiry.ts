import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingCustomer } from "../../actors/IShoppingCustomer";
import { IShoppingSaleInquiryAnswer } from "./IShoppingSaleInquiryAnswer";

/**
 * Inquiry about a sale.
 *
 * `IShoppingSaleInquiry` is a subtype entity of {@link IBbsArticle}, and
 * represents inquiries written by {@link IShoppingCustomer customers} about
 * a {@link IShoppingSale sale} registered by the {@link IShoppingSeller seller}
 * (however, to trace the exact {@link IShoppingSaleSnapshot snapshot}, it is
 * referencing not sale but snapshot).
 *
 * In addition, since the customer is waiting for the seller's response after
 * writing the inquiry, whether the seller has viewed the inquiry written by the
 * customer is provided for reference as {@link read_by_seller} property.
 * Of course, since the inquiry itself is a subtype of a article, it is also
 * possible for sellers to communicate with each other through
 * {@link IShoppingSaleInquiryComment comments} before an official response.
 *
 * However, comments themselves can be made by every customers, even if they are
 * not the person who wrote the article. Of course, it cannot be written unless
 * the seller is a party.
 *
 * @template Type Type of the derived inquiry
 * @template Snapshot Type of the snapshot content
 * @author Samchon
 */
export interface IShoppingSaleInquiry<
  Type extends "question" | "review",
  Snapshot extends IBbsArticle.ISnapshot,
> extends IBbsArticle<Snapshot> {
  /**
   * Type of the derived inquiry.
   *
   * - `question`: {@link IShoppingSaleQuestion}
   * - `review`: {@link IShoppingSaleReview}
   */
  type: Type;

  /**
   * Customer who wrote the inquiry.
   */
  customer: IShoppingCustomer;

  /**
   * Formal answer for the inquiry by the seller.
   */
  answer: null | IShoppingSaleInquiryAnswer;

  /**
   * Whether the seller has viewed the inquiry or not.
   */
  read_by_seller: boolean;
}
export namespace IShoppingSaleInquiry {
  /**
   * Request of summarized informations with pagination searching/sorting options.
   */
  export interface IRequest<
    Search extends IRequest.ISearch,
    Sortable extends IRequest.SortableColumns | string,
  > extends IBbsArticle.IRequest<Search, Sortable> {}
  export namespace IRequest {
    export interface ISearch extends IBbsArticle.IRequest.ISearch {
      name?: null | string;
      nickname?: null | string;
      answered?: null | boolean;
    }
    export type SortableColumns =
      | "nickname"
      | "answered_at"
      | IBbsArticle.IRequest.SortableColumns;
  }

  /**
   * Summarized information of an inquiry.
   */
  export interface ISummary extends IBbsArticle.ISummary {
    /**
     * Customer who wrote the inquiry.
     */
    customer: IShoppingCustomer;

    /**
     * Formal answer for the inquiry by the seller.
     */
    answer: IShoppingSaleInquiryAnswer.ISummary | null;

    /**
     * Whether the seller has viewed the inquiry or not.
     */
    read_by_seller: boolean;
  }

  export interface IAbridge extends IBbsArticle.IAbridge {
    /**
     * Customer who wrote the inquiry.
     */
    customer: IShoppingCustomer;

    /**
     * Formal answer for the inquiry by the seller.
     */
    answer: IShoppingSaleInquiryAnswer.IAbridge | null;

    /**
     * Whether the seller has viewed the inquiry or not.
     */
    read_by_seller: boolean;
  }
}
