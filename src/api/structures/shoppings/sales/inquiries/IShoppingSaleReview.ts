import { tags } from "typia";

import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSaleInquiry } from "./IShoppingSaleInquiry";

/**
 * Reviews for sale snapshots.
 *
 * `IShoppingSaleReview` is a subtype entity of {@link IShoppingSaleInquiry},
 * and is used when a {@link IShoppingCustomer customer} purchases a
 * {@link IShoppingSale sale} ({@link IShoppingSaleSnapshot snapshot} at the time)
 * registered by the {@link IShoppingSeller seller} as a product and leaves a
 * review and rating for it.
 *
 * For reference, `IShoppingSaleReview` and
 * {@link IShoppingOrderGod shopping_order_goods} have a logarithmic relationship
 * of N: 1, but this does not mean that customers can continue to write reviews
 * for the same product indefinitely. Wouldn't there be restrictions, such as
 * if you write a review once, you can write an additional review a month later?
 *
 * @author Samchon
 */
export interface IShoppingSaleReview
  extends IShoppingSaleInquiry<"review", IShoppingSaleReview.ISnapshot> {}
export namespace IShoppingSaleReview {
  /**
   * Snapshot content of the review article.
   */
  export interface ISnapshot extends IBbsArticle.ISnapshot {
    /**
     * Score of the review.
     */
    score: number & tags.Minimum<0> & tags.Maximum<100>;
  }

  /**
   * Request of summarized informations with pagination searching/sorting options.
   */
  export interface IRequest
    extends IShoppingSaleInquiry.IRequest<
      IRequest.ISearch,
      IRequest.SortableColumns
    > {}
  export namespace IRequest {
    export interface ISearch
      extends IShoppingSaleInquiry.IRequest.ISearch,
        IInvertSearch.IScoreRange {}
    export type SortableColumns =
      | IShoppingSaleInquiry.IRequest.SortableColumns
      | "score";
  }

  /**
   * Summarized information of the review.
   */
  export interface ISummary extends IShoppingSaleInquiry.ISummary {
    /**
     * Score of the review.
     */
    score: number;
  }

  /**
   * Abridged information of the review.
   */
  export interface IAbridge extends IShoppingSaleInquiry.IAbridge {
    /**
     * Score of the review.
     */
    score: number & tags.Minimum<0> & tags.Maximum<100>;
  }

  export interface IInvertSearch {
    score?: null | IInvertSearch.IScoreRange;
    count?: null | IInvertSearch.ICountRange;
  }

  export namespace IInvertSearch {
    export interface IScoreRange {
      minimum?: null | (number & tags.Minimum<0> & tags.Maximum<100>);
      maximum?: null | (number & tags.Minimum<0> & tags.Maximum<100>);
    }
    export interface ICountRange {
      minimum?: null | (number & tags.Type<"uint32">);
      maximum?: null | (number & tags.Type<"uint32">);
    }
  }

  /**
   * Creation information of the review.
   */
  export interface ICreate extends IBbsArticle.ICreate {
    /**
     * Target good's {@link IShoppingOrderGood.id}.
     */
    good_id: string & tags.Format<"uuid">;

    /**
     * Score of the review.
     */
    score: number & tags.Minimum<0> & tags.Maximum<100>;
  }

  /**
   * Updating information of the review.
   */
  export interface IUpdate extends IBbsArticle.IUpdate {
    /**
     * Score of the review.
     */
    score: number & tags.Minimum<0> & tags.Maximum<100>;
  }
}
