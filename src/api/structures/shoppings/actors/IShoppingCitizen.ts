import { tags } from "typia";

export interface IShoppingCitizen {
    id: string & tags.Format<"uuid">;
    mobile: string & tags.Pattern<"^[0-9]*$">;
    name: string;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingCitizen {
    export interface IStore {
        mobile: string & tags.Pattern<"^[0-9]*$">;
        name: string;
    }
}
