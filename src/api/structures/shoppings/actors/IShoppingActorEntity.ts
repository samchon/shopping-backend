import { IShoppingAdministrator } from "./IShoppingAdministrator";
import { IShoppingCustomer } from "./IShoppingCustomer";
import { IShoppingSeller } from "./IShoppingSeller";

export type IShoppingActorEntity =
  | IShoppingCustomer
  | IShoppingSeller.IInvert
  | IShoppingAdministrator.IInvert;
