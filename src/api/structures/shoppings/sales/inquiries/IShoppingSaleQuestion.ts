import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSaleInquiry } from "./IShoppingSaleInquiry";

export interface IShoppingSaleQuestion
    extends IShoppingSaleInquiry<"question", IShoppingSaleQuestion.ISnapshot> {
    secret: boolean;
}
export namespace IShoppingSaleQuestion {
    export type ISnapshot = IBbsArticle.ISnapshot;

    export interface IRequest
        extends IShoppingSaleInquiry.IRequest<
            IRequest.ISearch,
            IRequest.SortableColumns
        > {}
    export namespace IRequest {
        export type ISearch = IShoppingSaleInquiry.IRequest.ISearch;
        export type SortableColumns =
            IShoppingSaleInquiry.IRequest.SortableColumns;
    }
    export interface ISummary extends IShoppingSaleInquiry.ISummary {
        secret: boolean;
    }
    export interface IStore extends IBbsArticle.IStore {
        secret: boolean;
    }
    export type IUpdate = Partial<IStore>;
}
