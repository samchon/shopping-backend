import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";

import { ShoppingGlobal } from "../../../ShoppingGlobal";

export namespace ShoppingCitizenProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_citizensGetPayload<ReturnType<typeof select>>,
    ): IShoppingCitizen => ({
      id: input.id,
      mobile: decrypt(input.mobile),
      name: decrypt(input.name),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_citizensFindManyArgs;
  }

  export const create =
    (channel: IEntity) =>
    async (input: IShoppingCitizen.ICreate): Promise<IShoppingCitizen> => {
      const oldbie = await ShoppingGlobal.prisma.shopping_citizens.findFirst({
        where: {
          shopping_channel_id: channel.id,
          mobile: encrypt(input.mobile),
        },
      });
      if (oldbie !== null) return json.transform(oldbie);

      const record = await ShoppingGlobal.prisma.shopping_citizens.upsert({
        where: {
          shopping_channel_id_mobile: {
            shopping_channel_id: channel.id,
            mobile: encrypt(input.mobile),
          },
        },
        create: {
          id: v4(),
          channel: {
            connect: { id: channel.id },
          },
          mobile: encrypt(input.mobile),
          name: encrypt(input.name),
          created_at: new Date(),
        },
        update: {},
      });
      return json.transform(record);
    };

  export const search = (
    input: IShoppingCitizen.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.mobile?.length ? [{ mobile: encrypt(input.mobile) }] : []),
      ...(input?.name?.length ? [{ name: encrypt(input.name) }] : []),
    ] satisfies Prisma.shopping_citizensWhereInput["AND"];

  const decrypt = (str: string): string => AesPkcs5.decrypt(str, KEY, IV);
  const encrypt = (str: string): string => AesPkcs5.encrypt(str, KEY, IV);
}

const KEY = "6zukxuief9fpt64vwg6uh5u6nx8eo715";
const IV = "ox4mjamqd1bkmjm8";
