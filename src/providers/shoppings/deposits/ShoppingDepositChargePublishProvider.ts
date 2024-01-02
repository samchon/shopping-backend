import { RandomGenerator } from "@nestia/e2e";
import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaymentService } from "../../../services/PaymentService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingMileageHistoryProvider } from "../mileages/ShoppingMileageHistoryProvider";

export namespace ShoppingDepositChargePublishProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deposit_charge_publishesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDepositChargePublish => ({
      id: input.id,
      created_at: input.created_at.toISOString(),
      paid_at: input.paid_at?.toISOString() ?? null,
      cancelled_at: input.cancelled_at?.toISOString() ?? null,
    });
    export const select = () =>
      ({} satisfies Prisma.shopping_deposit_charge_publishesFindManyArgs);
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const able =
    (customer: IShoppingCustomer) => async (charge: IEntity) => {
      const knock =
        await ShoppingGlobal.prisma.shopping_deposit_charges.findFirstOrThrow({
          where: {
            id: charge.id,
            customer: ShoppingCustomerProvider.where(customer),
          },
          include: {
            publish: true,
          },
        });
      return knock;
    };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (customer: IShoppingCustomer) =>
    (charge: IEntity) =>
    async (
      input: IShoppingDepositChargePublish.ICreate,
    ): Promise<IShoppingDepositChargePublish> => {
      // PRELIMINARIES
      if (customer.citizen === null)
        throw ErrorProvider.forbidden({
          accessor: "headers.Authorzation",
          message: "You are not a citizen yet.",
        });
      const reference = await able(customer)(charge);
      const props = await PaymentService.enroll({
        vendor: input.vendor,
        uid: input.uid,
        orderId: charge.id,
        amount: reference.value,
      });

      // DO ARCHIVE
      const publish =
        await ShoppingGlobal.prisma.shopping_deposit_charge_publishes.create({
          data: {
            id: v4(),
            charge: {
              connect: { id: charge.id },
            },
            password: encrypt(RandomGenerator.alphaNumeric(16)),
            created_at: props.created_at,
            paid_at: props.paid_at,
            cancelled_at: props.cancelled_at,
          },
          ...json.select(),
        });

      // POST-PROCESSING
      await ShoppingMileageHistoryProvider.create(customer.citizen)(
        "shopping_deposit_charge",
      )(charge, reference.value);

      return json.transform(publish);
    };

  // const decrypt = (str: string): string => AesPkcs5.decrypt(str, KEY, IV);
  const encrypt = (str: string): string => AesPkcs5.encrypt(str, KEY, IV);
}

const KEY = "jehh59g54bx95wy9p9bnov8t17bdsi6g";
const IV = "1om3tzrjgcgzemm0";
