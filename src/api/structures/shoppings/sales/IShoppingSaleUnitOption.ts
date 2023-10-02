import { IShoppingSaleUnitDescriptiveOption } from "./IShoppingSaleUnitDescriptiveOption";
import { IShoppingSaleUnitSelectableOption } from "./IShoppingSaleUnitSelectableOption";

export type IShoppingSaleUnitOption =
    | IShoppingSaleUnitSelectableOption
    | IShoppingSaleUnitDescriptiveOption;
export namespace IShoppingSaleUnitOption {
    export type IInvert =
        | IShoppingSaleUnitSelectableOption.IInvert
        | IShoppingSaleUnitDescriptiveOption;
    export type IStore =
        | IShoppingSaleUnitSelectableOption.IStore
        | IShoppingSaleUnitDescriptiveOption.IStore;
}
