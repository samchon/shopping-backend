import { tags } from "typia";

import { IShoppingSaleUnitOption } from "./IShoppingSaleUnitOption";
import { IShoppingSaleUnitStock } from "./IShoppingSaleUnitStock";

export interface IShoppingSaleUnit {
    id: string & tags.Format<"uuid">;
    name: string;
    options: IShoppingSaleUnitOption[];
    stocks: IShoppingSaleUnitStock[] & tags.MinItems<1>;
    primary: boolean;
    required: boolean;
}
export namespace IShoppingSaleUnit {
    export interface IInvert {
        id: string & tags.Format<"uuid">;
        name: string;
        primary: boolean;
        required: boolean;
        stocks: IShoppingSaleUnitStock.IInvert[] & tags.MinItems<1>;
    }
    export interface ISummary {
        id: string & tags.Format<"uuid">;
        name: string;
        primary: boolean;
        required: boolean;
    }
    export interface IStore {
        name: string;
        options: IShoppingSaleUnitOption.IStore[];
        stocks: IShoppingSaleUnitStock.IStore[] & tags.MinItems<1>;
        primary: boolean;
        required: boolean;
    }
}
