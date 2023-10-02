import { tags } from "typia";

export interface IShoppingDeliveryJourney
    extends IShoppingDeliveryJourney.IStore {
    id: string & tags.Format<"uuid">;
    created_at: string & tags.Format<"date-time">;
}
export namespace IShoppingDeliveryJourney {
    export type State = "preparing" | "shipping" | "delivering" | "arrived";

    export interface IStore {
        state: State;
        title: null | string;
        description: null | string;
        started_at: null | (string & tags.Format<"date-time">);
        completed_at: null | (string & tags.Format<"date-time">);
    }
}
