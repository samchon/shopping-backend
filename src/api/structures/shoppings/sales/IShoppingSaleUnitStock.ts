import { tags } from "typia";

import { IShoppingPrice } from "../base/IShoppingPrice";
import { IShoppingSaleUnitStockChoice } from "./IShoppingSaleUnitStockChoice";

export interface IShoppingSaleUnitStock {
    id: string & tags.Format<"uuid">;
    name: string;
    price: IShoppingPrice;
    choices: IShoppingSaleUnitStockChoice[];
}
export namespace IShoppingSaleUnitStock {
    export interface IInvert {
        id: string & tags.Format<"uuid">;
        name: string;
        price: IShoppingPrice;
        quantity: number & tags.Type<"uint32">;
        choices: IShoppingSaleUnitStockChoice.IInvert[];
    }
    export interface IStore {
        name: string;
        price: IShoppingPrice;
        choices: IShoppingSaleUnitStockChoice.IStore[];
    }
}
