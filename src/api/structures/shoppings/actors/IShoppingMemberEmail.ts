import { tags } from "typia";

export interface IShoppingMemberEmail {
    id: string & tags.Format<"uuid">;
    value: string & tags.Format<"email">;
    created_at: string & tags.Format<"date-time">;
}
