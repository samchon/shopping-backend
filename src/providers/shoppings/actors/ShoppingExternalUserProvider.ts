import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingExternalUser } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingExternalUser";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { BcryptUtil } from "../../../utils/BcryptUtil";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCitizenProvider } from "./ShoppingCitizenProvider";

export namespace ShoppingExternalUserProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_external_usersGetPayload<ReturnType<typeof select>>
    ): IShoppingExternalUser => ({
      id: input.id,
      citizen:
        input.citizen !== null
          ? ShoppingCitizenProvider.json.transform(input.citizen)
          : null,
      application: input.application,
      uid: input.uid,
      nickname: input.nickname,
      data:
        input.data !== null
          ? JSON.parse(
              AesPkcs5.decrypt(
                input.data,
                ShoppingGlobal.env.SHOPPING_EXTERNAL_USER_SECRET_KEY,
                ShoppingGlobal.env.SHOPPING_EXTERNAL_USER_SECRET_IV
              )
            )
          : null,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          citizen: ShoppingCitizenProvider.json.select(),
        },
      }) satisfies Prisma.shopping_external_usersFindManyArgs;
  }

  export const create =
    (related: { channel: IEntity; customer: IEntity | null }) =>
    async (
      input: IShoppingExternalUser.ICreate
    ): Promise<IShoppingExternalUser> => {
      const oldbie =
        await ShoppingGlobal.prisma.shopping_external_users.findFirst({
          where: {
            shopping_channel_id: related.channel.id,
            application: input.application,
            uid: input.uid,
          },
          ...json.select(),
        });
      if (oldbie !== null) {
        if (
          (await BcryptUtil.equals({
            input: input.password,
            hashed: oldbie.password,
          })) === false
        )
          throw ErrorProvider.forbidden({
            accessor: "input.password",
            message: "Password of external user is incorrect.",
          });
        return json.transform(oldbie);
      }

      const citizen =
        input.citizen !== null
          ? await ShoppingCitizenProvider.create({
              channel: related.channel,
              input: input.citizen,
            })
          : null;
      const record = await ShoppingGlobal.prisma.shopping_external_users.create(
        {
          data: {
            id: v4(),
            channel: {
              connect: { id: related.channel.id },
            },
            citizen:
              citizen !== null
                ? {
                    connect: { id: citizen.id },
                  }
                : undefined,
            application: input.application,
            uid: input.uid,
            nickname: input.nickname,
            password: await BcryptUtil.hash(input.password),
            data: input.data
              ? AesPkcs5.encrypt(
                  JSON.stringify(input.data),
                  ShoppingGlobal.env.SHOPPING_EXTERNAL_USER_SECRET_KEY,
                  ShoppingGlobal.env.SHOPPING_EXTERNAL_USER_SECRET_IV
                )
              : null,
            created_at: new Date(),
          },
          ...json.select(),
        }
      );
      if (related.customer !== null)
        await ShoppingGlobal.prisma.shopping_customers.update({
          where: { id: related.customer.id },
          data: {
            shopping_external_user_id: record.id,
            shopping_citizen_id: citizen?.id ?? undefined,
          },
        });
      return json.transform(record);
    };
}
