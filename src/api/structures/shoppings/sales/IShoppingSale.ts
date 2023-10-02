import { tags } from "typia";

import { IPage } from "../../common/IPage";
import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingSection } from "../systematic/IShoppingSection";
import { IShoppingSaleSnapshot } from "./IShoppingSaleSnapshot";
import { IShoppingSaleReview } from "./inquiries/IShoppingSaleReview";

export interface IShoppingSale extends IShoppingSaleSnapshot {
    id: string & tags.Format<"uuid">;
    snapshot_id: string & tags.Format<"uuid">;
    latest: boolean;

    section: IShoppingSection;
    seller: IShoppingSeller;

    created_at: string & tags.Format<"date-time">;
    paused_at: null | (string & tags.Format<"date-time">);
    suspended_at: null | (string & tags.Format<"date-time">);
    opened_at: null | (string & tags.Format<"date-time">);
    closed_at: null | (string & tags.Format<"date-time">);
}
export namespace IShoppingSale {
    export interface IRequest extends IPage.IRequest {
        search?: IRequest.ISearch;
        sort?: IPage.Sort<IRequest.SortableColumns>;
    }
    export namespace IRequest {
        export interface ISearch {
            show_paused?: boolean;
            show_suspended?: boolean | "only";
            title?: string;
            content?: string;
            title_or_content?: string;
            review?: IShoppingSaleReview.IInvertSearch;
            section_codes?: string[];
            channel_codes?: string[];
            channel_category_ids?: string[];
            tags?: string[];
            seller?: IShoppingSeller.IRequest.ISearch;
        }

        export type SortableColumns =
            | IShoppingSeller.IRequest.SortableColumns
            | "goods.publish_count"
            | "goods.payments"
            | "reviews.average"
            | "reviews.count"
            | "sale.created_at"
            | "sale.updated_at"
            | "sale.opened_at"
            | "sale.closed_at"
            | "sale.content.title";
    }

    export interface ISummary extends IShoppingSaleSnapshot.ISummary {
        seller: IShoppingSeller;
        section: IShoppingSection;
    }

    export interface IStore extends IShoppingSaleSnapshot.IStore {
        parent_snapshot_id?: null | (string & tags.Format<"uuid">);
        section_code: string;
        status?: null | "paused" | "suspended";
        opened_at: null | (string & tags.Format<"date-time">);
        closed_at: null | (string & tags.Format<"date-time">);
    }
}
