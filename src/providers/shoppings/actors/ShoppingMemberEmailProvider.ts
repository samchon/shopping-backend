import { Prisma } from "@prisma/client";

import { IShoppingMemberEmail } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMemberEmail";

export namespace ShoppingMemberEmailProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_member_emailsGetPayload<ReturnType<typeof select>>,
    ): IShoppingMemberEmail => ({
      id: input.id,
      value: input.value,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_member_emailsFindManyArgs;
  }
}
