import { tags } from "typia";

export interface IShoppingOrderPublish extends IShoppingOrderPublish.ISummary {}
export namespace IShoppingOrderPublish {
    export interface ISummary {
        id: string & tags.Format<"uuid">;
        created_at: string & tags.Format<"date-time">;
        paid_at: null | (string & tags.Format<"date-time">);
        cancelled_at: null | (string & tags.Format<"date-time">);
    }
}
