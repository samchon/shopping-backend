import typia from "typia";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

export namespace ShoppingAdministratorDiagnoser {
  export const invert = (
    customer: IShoppingCustomer,
  ): IShoppingAdministrator.IInvert | null => {
    const citizen = customer.citizen;
    const member = customer.member;
    const admin = customer.member?.administrator;

    if (!citizen || !member || !admin) return null;
    return {
      id: admin.id,
      type: "administrator",
      citizen,
      customer: typia.misc.assertClone<IShoppingCustomer.IInvert>(customer),
      member: typia.misc.assertClone<IShoppingMember.IInvert>(member),
      created_at: admin.created_at,
    };
  };
}
