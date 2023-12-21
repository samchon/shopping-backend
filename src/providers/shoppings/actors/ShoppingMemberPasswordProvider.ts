import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { BcryptUtil } from "../../../utils/BcryptUtil";
import { ErrorProvider } from "../../../utils/ErrorProvider";

export namespace ShoppingMemberPasswordProvider {
  export const change =
    (customer: IShoppingCustomer) =>
    async (input: IShoppingMember.IPasswordChange): Promise<void> => {
      if (customer.member === null)
        throw ErrorProvider.forbidden({
          accessor: "headers.Authorization",
          message: "You're not a member.",
        });
      const member =
        await ShoppingGlobal.prisma.shopping_members.findFirstOrThrow({
          where: {
            id: customer.member.id,
          },
        });
      if (
        false ===
        (await BcryptUtil.equals({
          input: input.oldbie,
          hashed: member.password,
        }))
      )
        throw ErrorProvider.forbidden({
          accessor: "input.oldbie",
          message: "Incorrect password.",
        });

      await ShoppingGlobal.prisma.shopping_members.update({
        where: {
          id: member.id,
        },
        data: {
          password: await BcryptUtil.hash(input.newbie),
        },
      });
    };
}
