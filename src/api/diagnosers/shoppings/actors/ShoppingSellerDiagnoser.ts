import typia from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";

export namespace ShoppingSellerDiagnoser {
  export const invert = (
    customer: IShoppingCustomer,
  ): IShoppingSeller.IInvert | null => {
    const citizen = customer.citizen;
    const member = customer.member;
    const seller = customer.member?.seller;

    if (!citizen || !member || !seller) return null;
    return {
      id: seller.id,
      type: "seller",
      citizen,
      customer: typia.misc.assertClone<IShoppingCustomer.IInvert>(customer),
      member: typia.misc.assertClone<IShoppingMember.IInvert>(member),
      created_at: seller.created_at,
    };
  };
}
