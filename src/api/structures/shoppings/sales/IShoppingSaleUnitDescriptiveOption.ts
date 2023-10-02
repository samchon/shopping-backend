import { tags } from "typia";

export interface IShoppingSaleUnitDescriptiveOption {
    /**
     * Primary Key.
     */
    id: string & tags.Format<"uuid">;
    type: "boolean" | "number" | "string";
    name: string;
}
export namespace IShoppingSaleUnitDescriptiveOption {
    export interface IStore {
        type: "boolean" | "number" | "string";
        name: string;
    }
}
