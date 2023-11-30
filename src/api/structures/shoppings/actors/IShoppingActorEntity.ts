import { IShoppingAdministrator } from "./IShoppingAdministrator";
import { IShoppingCustomer } from "./IShoppingCustomer";
import { IShoppingSeller } from "./IShoppingSeller";

/**
 * @internal
 */
export type IShoppingActorEntity =
  | IShoppingCustomer
  | IShoppingSeller.IInvert
  | IShoppingAdministrator.IInvert;
