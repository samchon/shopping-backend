import { tags } from "typia";

import { IShoppingSeller } from "../actors/IShoppingSeller";
import { IShoppingDeliveryJourney } from "./IShoppingDeliveryJourney";

export interface IShoppingDelivery {
    id: string & tags.Format<"uuid">;
    seller: IShoppingSeller;
    code: string;
    journeys: IShoppingDeliveryJourney[];
    created_at: string & tags.Format<"date-time">;
}
