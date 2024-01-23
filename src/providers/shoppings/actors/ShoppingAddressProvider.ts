import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IShoppingAddress } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAddress";

export namespace ShoppingAddressProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_addressesGetPayload<ReturnType<typeof select>>,
    ): IShoppingAddress => ({
      id: input.id,
      name: decrypt(input.name),
      mobile: decrypt(input.mobile),
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
      ({}) satisfies Prisma.shopping_addressesFindManyArgs;
  }

  export const collect = (input: IShoppingAddress.ICreate) =>
    ({
      id: v4(),
      mobile: encrypt(input.mobile),
      name: encrypt(input.name),
      country: input.country,
      province: input.province,
      city: input.city,
      department: input.department,
      possession: input.possession,
      zip_code: input.zip_code,
      special_note: input.special_note,
      created_at: new Date(),
    }) satisfies Prisma.shopping_addressesCreateInput;

  const decrypt = (str: string): string => AesPkcs5.decrypt(str, KEY, IV);
  const encrypt = (str: string): string => AesPkcs5.encrypt(str, KEY, IV);
}

const KEY = "4e8ftgkdhht90488a28qlkoxaw9ufspc";
const IV = "ha1utbzec2mto79l";
