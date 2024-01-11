import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSaleInquiry } from "./IShoppingSaleInquiry";

/**
 * Question about sale snapshot.
 *
 * `IShoppingSaleQuestion` is a subtype entity of {@link IShoppingSaleInquiry},
 * and is used when a {@link IShoppingCustomer customer} wants to ask something
 * about a {@link IShoppingSale sale} ({@link IShoppingSaleSnapshot snapshot} at
 * the time) registered by the {@link IShoppingSeller seller}.
 *
 * And, like most shopping malls, `IShoppingSaleQuestion` also provides
 * a {@link secret} attribute, allowing you to create a "secret message" that can
 * only be viewed by the seller and the customer who wrote the question.
 *
 * @author Samchon
 */
export interface IShoppingSaleQuestion
  extends IShoppingSaleInquiry<"question", IShoppingSaleQuestion.ISnapshot> {
  /**
   * Whether the question article is secret or not.
   *
   * If secret article, only the writer customer and related seller can see
   * the detailed content.
   */
  secret: boolean;
}
export namespace IShoppingSaleQuestion {
  /**
   * Snapshot content of the question.
   */
  export type ISnapshot = IBbsArticle.ISnapshot;

  /**
   * Request of summarized informations with pagination searching/sorting options.
   */
  export interface IRequest
    extends IShoppingSaleInquiry.IRequest<
      IRequest.ISearch,
      IRequest.SortableColumns
    > {}
  export namespace IRequest {
    export type ISearch = IShoppingSaleInquiry.IRequest.ISearch;
    export type SortableColumns = IShoppingSaleInquiry.IRequest.SortableColumns;
  }

  /**
   * Summarized information of the question.
   */
  export interface ISummary extends IShoppingSaleInquiry.ISummary {
    /**
     * Whether the question article is secret or not.
     *
     * If secret article, only the writer customer and related seller can see
     * the detailed content.
     */
    secret: boolean;
  }

  /**
   * Abridged information of the question.
   */
  export interface IAbridge extends IShoppingSaleInquiry.IAbridge {
    /**
     * Whether the question article is secret or not.
     *
     * If secret article, only the writer customer and related seller can see
     * the detailed content.
     */
    secret: boolean;
  }

  /**
   * Creation information of the question.
   */
  export interface ICreate extends IBbsArticle.ICreate {
    /**
     * Whether the question article is secret or not.
     *
     * If secret article, only the writer customer and related seller can see
     * the detailed content.
     */
    secret: boolean;
  }

  /**
   * Updating information of the question.
   */
  export type IUpdate = IBbsArticle.IUpdate;
}
