import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ShoppingCustomerProvider } from "./ShoppingCustomerProvider";

export namespace ShoppingActorProvider {
  export const equals = <T extends IShoppingActorEntity>(
    x: T,
    y: T
  ): boolean => {
    if (x.type !== y.type) return false;
    return x.type === "customer"
      ? ShoppingCustomerProvider.equals(x, y as IShoppingCustomer)
      : x.id === y.id;
  };
}
