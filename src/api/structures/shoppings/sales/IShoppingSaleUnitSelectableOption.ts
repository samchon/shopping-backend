import { tags } from "typia";

import { IShoppingSaleUnitOptionCandidate } from "./IShoppingSaleUnitOptionCandidate";

export interface IShoppingSaleUnitSelectableOption {
    id: string & tags.Format<"uuid">;
    type: "select";
    name: string;
    variable: boolean;
    candidates: IShoppingSaleUnitOptionCandidate[] & tags.MinItems<1>;
}
export namespace IShoppingSaleUnitSelectableOption {
    export interface IInvert {
        id: string & tags.Format<"uuid">;
        type: "select";
        name: string;
        variable: boolean;
    }
    export interface IStore {
        type: "select";
        name: string;
        variable: boolean;
        candidates: IShoppingSaleUnitOptionCandidate.IStore[] &
            tags.MinItems<1>;
    }
}
