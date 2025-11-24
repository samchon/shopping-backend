import { RandomGenerator } from "@nestia/e2e";
import { AesPkcs5 } from "@nestia/fetcher/lib/AesPkcs5";
import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { PaymentService } from "../../../services/PaymentService";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingDepositHistoryProvider } from "../deposits/ShoppingDepositHistoryProvider";
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
      ({}) satisfies Prisma.shopping_deposit_charge_publishesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const able = async (props: {
    customer: IShoppingCustomer;
    charge: IEntity;
  }): Promise<boolean> => {
    return (await knock(props)) !== null;
  };

  const knock = async (props: {
    customer: IShoppingCustomer;
    charge: IEntity;
  }) => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposit_charges.findFirstOrThrow({
        where: {
          id: props.charge.id,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        include: {
          publish: true,
        },
      });
    return record.publish === null ? record : null;
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    charge: IEntity;
    input: IShoppingDepositChargePublish.ICreate;
  }): Promise<IShoppingDepositChargePublish> => {
    // PRELIMINARIES
    if (props.customer.citizen === null)
      throw ErrorProvider.forbidden({
        accessor: "headers.Authorzation",
        message: "You are not a citizen yet.",
      });
    const reference = await knock(props);
    if (reference === null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "The order already has been published.",
      });
    const next = await PaymentService.enroll({
      vendor: props.input.vendor,
      uid: props.input.uid,
      orderId: props.charge.id,
      amount: reference.value,
    });

    // DO ARCHIVE
    const publish =
      await ShoppingGlobal.prisma.shopping_deposit_charge_publishes.create({
        data: {
          id: v4(),
          charge: {
            connect: { id: props.charge.id },
          },
          password: encrypt(RandomGenerator.alphaNumeric(16)),
          created_at: next.created_at,
          paid_at: next.paid_at,
          cancelled_at: next.cancelled_at,
        },
        ...json.select(),
      });

    // POST-PROCESSING
    if (publish.paid_at !== null && publish.cancelled_at === null)
      await handlePayment({
        citizen: props.customer.citizen,
        charge: props.charge,
        value: reference.value,
      });
    return json.transform(publish);
  };

  const handlePayment = async (props: {
    citizen: IShoppingCitizen;
    charge: IEntity;
    value: number;
  }): Promise<void> => {
    await ShoppingDepositHistoryProvider.emplace({
      citizen: props.citizen,
      deposit: {
        code: "shopping_deposit_charge",
      },
      source: props.charge,
      value: props.value,
    });
    await ShoppingMileageHistoryProvider.emplace({
      citizen: props.citizen,
      mileage: {
        code: "shopping_deposit_charge_reward",
      },
      source: props.charge,
      value: (ratio) => props.value * ratio!,
    });
  };

  const encrypt = (str: string): string =>
    AesPkcs5.encrypt(
      str,
      ShoppingGlobal.env.SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_KEY,
      ShoppingGlobal.env.SHOPPING_DEPOSIT_CHARGE_PUBLISH_SECRET_IV,
    );
}
