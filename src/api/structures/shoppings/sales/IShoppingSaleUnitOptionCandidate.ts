import { tags } from "typia";

export interface IShoppingSaleUnitOptionCandidate {
    id: string & tags.Format<"uuid">;
    name: string;
}

export namespace IShoppingSaleUnitOptionCandidate {
    export interface IStore {
        name: string;
    }
}
