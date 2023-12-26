import { Prisma } from "@prisma/client";

import { IShoppingAddress } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAddress";

export namespace ShoppingAddressProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_addressesGetPayload<ReturnType<typeof select>>,
    ): IShoppingAddress => ({
      id: input.id,
      name: input.name,
      mobile: input.mobile,
      country: input.country,
      city: input.city,
      province: input.province,
      department: input.department,
      possession: input.possession,
      zip_code: input.zip_code,
      special_note: input.special_note,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_addressesFindManyArgs);
  }
}
