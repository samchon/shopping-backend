import { IBbsArticleComment } from "../../../common/IBbsArticleComment";
import { IShoppingCustomer } from "../../actors/IShoppingCustomer";
import { IShoppingSeller } from "../../actors/IShoppingSeller";

export interface IShoppingSaleInquiryComment extends IBbsArticleComment {
    writer: IShoppingCustomer | IShoppingSeller;
}
export namespace IShoppingSaleInquiryComment {
    export interface ISnapshot extends IBbsArticleComment.ISnapshot {}

    export interface IRequest
        extends IBbsArticleComment.IRequest<
            IRequest.ISearch,
            IRequest.SortableColumns
        > {}
    export namespace IRequest {
        export interface ISearch extends IBbsArticleComment.IRequest.ISearch {
            name?: string;
            nickname?: string;
        }
        export type SortableColumns =
            IBbsArticleComment.IRequest.SortableColumns;
    }

    export interface IStore extends IBbsArticleComment.IStore {}
    export type IUpdate = Partial<IStore>;
}
