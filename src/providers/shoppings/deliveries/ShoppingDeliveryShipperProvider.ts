import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingDeliveryShipper } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingDeliveryShipper";

import { ShoppingGlobal } from "../../../ShoppingGlobal";

export namespace ShoppingDeliveryShipperProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_delivery_shippersGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDeliveryShipper => ({
      id: input.id,
      company: input.company,
      name: decrypt(input.name),
      mobile: decrypt(input.mobile),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_delivery_shippersFindManyArgs;
  }

  export const create = async (props: {
    seller: IShoppingSeller.IInvert;
    delivery: IEntity;
    input: IShoppingDeliveryShipper.ICreate;
  }): Promise<IShoppingDeliveryShipper> => {
    await ShoppingGlobal.prisma.shopping_deliveries.findFirstOrThrow({
      where: {
        id: props.delivery.id,
        sellerCustomer: {
          member: {
            of_seller: {
              id: props.seller.id,
            },
          },
        },
      },
    });
    const record =
      await ShoppingGlobal.prisma.shopping_delivery_shippers.create({
        data: {
          ...collect(props.input),
          shopping_delivery_id: props.delivery.id,
        },
        ...json.select(),
      });
    return json.transform(record);
  };

  export const collect = (input: IShoppingDeliveryShipper.ICreate) =>
    ({
      id: v4(),
      company: input.company,
      name: encrypt(input.name),
      mobile: encrypt(input.mobile),
      created_at: new Date(),
    }) satisfies Prisma.shopping_delivery_shippersCreateWithoutDeliveryInput;

  const decrypt = (str: string): string =>
    AesPkcs5.decrypt(
      str,
      ShoppingGlobal.env.SHOPPING_DELIVERY_SHIPPER_SECRET_KEY,
      ShoppingGlobal.env.SHOPPING_DELIVERY_SHIPPER_SECRET_IV,
    );
  const encrypt = (str: string): string =>
    AesPkcs5.encrypt(
      str,
      ShoppingGlobal.env.SHOPPING_DELIVERY_SHIPPER_SECRET_KEY,
      ShoppingGlobal.env.SHOPPING_DELIVERY_SHIPPER_SECRET_IV,
    );
}
