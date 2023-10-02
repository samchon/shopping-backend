import { tags } from "typia";

export interface IShoppingAddress extends IShoppingAddress.IStore {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingAddress {
    export interface IStore {
        mobile: string & tags.Pattern<"^[0-9]*$">;
        name: string;
        country: string;
        province: string;
        city: string;
        department: string;
        possession: string;
        zip_code: string;
        special_note: null | string;
    }
}
