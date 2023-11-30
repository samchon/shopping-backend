import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSeller } from "../../actors/IShoppingSeller";

/**
 * Answers to questions about sale snapshots.
 *
 * `IShoppingSaleInquiryAnswer` is an entity that embodies the official
 * answer written by the {@link IShoppingSeller seller} to the
 * {@link IShoppingSaleInquiry inquiry} written by the
 * {@link IShoppingCustomer customer}.
 *
 * Of course, in addition to writing an official response like this, it is
 * also possible for the seller to communicate with the inqjuiry written
 * customer and multiple customers through
 * {@link IShoppingSaleInquiryComment comments} in the attribution inquiry.
 *
 * For refererence, it is not possible to write comments on this answer.
 * Encourage people to write comments on the inquiry article. This is to
 * prevent comments from being scattered in both inquiry and answer
 * articles.
 *
 * @author Samchon
 */
export interface IShoppingSaleInquiryAnswer extends IBbsArticle {
  /**
   * Seller who've written the answer.
   */
  seller: IShoppingSeller;
}
export namespace IShoppingSaleInquiryAnswer {
  export interface ISnapshot extends IBbsArticle.ISnapshot {}

  export interface ISummary extends IBbsArticle.ISummary {
    seller: IShoppingSeller;
  }
  export interface IAbridge extends IBbsArticle.IAbridge {
    seller: IShoppingSeller;
  }
  export type ICreate = IBbsArticle.ICreate;
  export type IUpdate = IBbsArticle.IUpdate;
}
