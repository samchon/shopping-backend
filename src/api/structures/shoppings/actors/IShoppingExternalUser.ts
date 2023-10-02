import { tags } from "typia";

export interface IShoppingExternalUser {
    id: string & tags.Format<"uuid">;
    application: string;
    uid: string;
    nickname: string;
    data: any;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingExternalUser {
    export interface IStore {
        application: string;
        uid: string;
        nickname: string;
        password: string;
        data?: any;
    }
}
