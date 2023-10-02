import { tags } from "typia";

import { IShoppingSaleUnitOption } from "./IShoppingSaleUnitOption";
import { IShoppingSaleUnitOptionCandidate } from "./IShoppingSaleUnitOptionCandidate";

export interface IShoppingSaleUnitStockChoice {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;

    /**
     * Target option's id.
     */
    option_id: string & tags.Format<"uuid">;

    /**
     * Target candidate's id.
     */
    candidate_id: string & tags.Format<"uuid">;
}

export namespace IShoppingSaleUnitStockChoice {
    export interface IInvert {
        id: string & tags.Format<"uuid">;
        option: IShoppingSaleUnitOption.IInvert;
        candidate: IShoppingSaleUnitOptionCandidate | null;
        value: string | null;
    }
    export interface IStore {
        option_index: number & tags.Type<"uint32">;
        candidate_index: number & tags.Type<"uint32">;
    }
}
