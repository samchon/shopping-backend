import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingCustomer } from "../../actors/IShoppingCustomer";
import { IShoppingSaleInquiryAnswer } from "./IShoppingSaleInquiryAnswer";

export interface IShoppingSaleInquiry<
    Type extends "question" | "review",
    Snapshot extends IBbsArticle.ISnapshot,
> extends IBbsArticle<Snapshot> {
    type: Type;
    customer: IShoppingCustomer;
    answer: null | IShoppingSaleInquiryAnswer;
    read_by_seller: boolean;
}
export namespace IShoppingSaleInquiry {
    export interface IRequest<
        Search extends IRequest.ISearch,
        Sortable extends IRequest.SortableColumns | string,
    > extends IBbsArticle.IRequest<Search, Sortable> {}
    export namespace IRequest {
        export interface ISearch extends IBbsArticle.IRequest.ISearch {
            name?: string;
            nickname?: string;
            answered?: boolean | null;
        }
        export type SortableColumns =
            | IBbsArticle.IRequest.SortableColumns
            | "nickname";
    }
    export interface ISummary extends IBbsArticle.ISummary {
        customer: IShoppingCustomer;
        answer: IShoppingSaleInquiryAnswer.ISummary | null;
        read_by_seller: boolean;
    }
}
