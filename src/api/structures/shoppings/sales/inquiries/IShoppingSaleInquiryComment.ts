import { IBbsArticleComment } from "../../../common/IBbsArticleComment";
import { IShoppingActorEntity } from "../../actors/IShoppingActorEntity";

/**
 * A comment written on an inquiry article.
 *
 * `IShoppingSaleInquiryComment` is a subtype entity of {@link IBbsArticleComment},
 * and is used when you want to communicate with multiple people about an
 * {@link IShoppingSaleInquiry inquiry} written by a
 * {@link IShoppingCustomer customer}.
 *
 * For reference, only related parties can write comments for
 * {@link IShoppingSeller sellers}, but there is no limit to
 * {@link IShoppingCustomer customers}. In other words, anyone customer can
 * freely write a comment, even if they are not the person who wrote the inquiry.
 *
 * @author Samchon
 */
export interface IShoppingSaleInquiryComment extends IBbsArticleComment {
  /**
   * Writer of the comment.
   *
   * Both customer and seller can write comment on the sale inquiry.
   *
   * By the way, no restriction on the customer, but seller must be the
   * person who've registered the sale.
   */
  writer: IShoppingActorEntity;
}
export namespace IShoppingSaleInquiryComment {
  /**
   * Snapshot content of the comment.
   */
  export interface ISnapshot extends IBbsArticleComment.ISnapshot {}

  /**
   * Request of the comments with pagination and searching/sorting options.
   */
  export interface IRequest
    extends IBbsArticleComment.IRequest<
      IRequest.ISearch,
      IRequest.SortableColumns
    > {}
  export namespace IRequest {
    export interface ISearch extends IBbsArticleComment.IRequest.ISearch {
      name?: null | string;
      nickname?: null | string;
    }
    export type SortableColumns = IBbsArticleComment.IRequest.SortableColumns;
  }

  /**
   * Creation information of the comment.
   */
  export interface ICreate extends IBbsArticleComment.ICreate {}

  /**
   * Updating information of the comment.
   */
  export type IUpdate = ICreate;
}
