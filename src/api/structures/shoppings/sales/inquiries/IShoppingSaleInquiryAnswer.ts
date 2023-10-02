import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSeller } from "../../actors/IShoppingSeller";

export interface IShoppingSaleInquiryAnswer extends IBbsArticle {
    seller: IShoppingSeller;
}
export namespace IShoppingSaleInquiryAnswer {
    export interface ISnapshot extends IBbsArticle.ISnapshot {}

    export interface ISummary extends IBbsArticle.ISummary {
        seller: IShoppingSeller;
    }
    export interface IStore extends IBbsArticle.IStore {}
    export type IUpdate = Partial<IStore>;
}
