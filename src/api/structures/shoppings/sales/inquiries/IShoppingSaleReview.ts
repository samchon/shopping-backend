import { tags } from "typia";

import { IBbsArticle } from "../../../common/IBbsArticle";
import { IShoppingSaleInquiry } from "./IShoppingSaleInquiry";

export interface IShoppingSaleReview
    extends IShoppingSaleInquiry<"review", IShoppingSaleReview.ISnapshot> {}
export namespace IShoppingSaleReview {
    export interface ISnapshot extends IBbsArticle.ISnapshot {
        score: number & tags.Minimum<0> & tags.Maximum<100>;
    }

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
    export interface ISummary extends IShoppingSaleInquiry.ISummary {
        score: number;
    }

    export interface IInvertSearch {
        score?: IInvertSearch.IScoreRange;
        count?: IInvertSearch.ICountRange;
    }

    export namespace IInvertSearch {
        export interface IScoreRange {
            minimum?: number & tags.Minimum<0> & tags.Maximum<100>;
            maximum?: number & tags.Minimum<0> & tags.Maximum<100>;
        }
        export interface ICountRange {
            minimum?: number & tags.Type<"uint32">;
            maximum?: number & tags.Type<"uint32">;
        }
    }

    export interface IStore extends IBbsArticle.IStore {
        score: number & tags.Minimum<0> & tags.Maximum<100>;
    }
    export type IUpdate = Partial<IStore>;
}
