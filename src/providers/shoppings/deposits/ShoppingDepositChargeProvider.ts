import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositCharge } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositCharge";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";

export namespace ShoppingDepositChargeProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_deposit_chargesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingDepositCharge => ({
      id: input.id,
      customer: ShoppingCustomerProvider.json.transform(input.customer),
      value: input.value,
      created_at: input.created_at.toISOString(),
      publish: null,
      // input.publish === null
      //   ? null
      //   : ShoppingDepositChargePublishProvider.json.transform(input.publish),
    });
    export const select = () =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          // publish: ShoppingDepositChargePublishProvider.json.select(),
        },
      }) satisfies Prisma.shopping_deposit_chargesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingDepositCharge.IRequest;
  }): Promise<IPage<IShoppingDepositCharge>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_deposit_charges,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: [
          ShoppingCustomerProvider.where(props.customer),
          ...search(props.input.search),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  const search = (
    input: IShoppingDepositCharge.IRequest.ISearch | null | undefined,
  ) =>
    [
      ...(input?.minimum !== undefined && input?.minimum !== null
        ? [{ value: { gte: input.minimum } }]
        : []),
      ...(input?.maximum !== undefined && input?.maximum !== null
        ? [{ value: { lte: input.maximum } }]
        : []),
      ...(input?.from !== undefined && input?.from !== null
        ? [{ created_at: { gte: new Date(input.from) } }]
        : []),
      ...(input?.to !== undefined && input?.to !== null
        ? [{ created_at: { lte: new Date(input.to) } }]
        : []),
      ...(input?.state === "pending" ? [{ publish: { is: null } }] : []),
      ...(input?.state === "published" ? [{ publish: { isNot: null } }] : []),
      ...(input?.state === "paid"
        ? [{ publish: { paid_at: { not: null } } }]
        : []),
      ...(input?.state === "cancelled"
        ? [{ publish: { cancelled_at: { not: null } } }]
        : []),
      ...(input?.publish?.from?.length
        ? [{ publish: { created_at: { gte: input.publish.from } } }]
        : []),
      ...(input?.publish?.to?.length
        ? [{ publish: { created_at: { lte: input.publish.to } } }]
        : []),
      ...(input?.publish?.payment?.from?.length
        ? [
            {
              publish: {
                paid_at: {
                  gte: input.publish.payment.from,
                },
              },
            },
          ]
        : []),
      ...(input?.publish?.payment?.to?.length
        ? [
            {
              publish: {
                paid_at: {
                  lte: input.publish.payment.to,
                },
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_deposit_chargesWhereInput["AND"];

  const orderBy = (
    key: IShoppingDepositCharge.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "created_at"
      ? { created_at: value }
      : key === "value"
        ? { value: value }
        : key === "publish.created_at"
          ? { publish: { created_at: value } }
          : key === "publish.paid_at"
            ? { publish: { paid_at: value } }
            : {
                publish: { cancelled_at: value },
              }) satisfies Prisma.shopping_deposit_chargesOrderByWithRelationInput;

  export const at = async (props: {
    customer: IShoppingCustomer;
    id: string;
  }): Promise<IShoppingDepositCharge> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposit_charges.findFirstOrThrow({
        where: {
          id: props.id,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        ...json.select(),
      });
    return json.transform(record);
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    input: IShoppingDepositCharge.ICreate;
  }): Promise<IShoppingDepositCharge> => {
    const record = await ShoppingGlobal.prisma.shopping_deposit_charges.create({
      data: collect(props),
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update = async (props: {
    customer: IShoppingCustomer;
    id: string;
    input: IShoppingDepositCharge.IUpdate;
  }): Promise<void> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposit_charges.findFirstOrThrow({
        where: {
          id: props.id,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        include: {
          publish: true,
        },
      });
    if (record.publish !== null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Already published.",
      });
    await ShoppingGlobal.prisma.shopping_deposit_charges.update({
      where: { id: record.id },
      data: { value: props.input.value },
    });
  };

  export const erase = async (props: {
    customer: IShoppingCustomer;
    id: string;
  }): Promise<void> => {
    const record =
      await ShoppingGlobal.prisma.shopping_deposit_charges.findFirstOrThrow({
        where: {
          id: props.id,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        include: {
          publish: true,
        },
      });
    if (record.publish !== null)
      throw ErrorProvider.gone({
        accessor: "id",
        message: "Charge has already been published.",
      });
    await ShoppingGlobal.prisma.shopping_deposit_charges.update({
      where: { id: record.id },
      data: {
        deleted_at: new Date(),
      },
    });
  };

  const collect = (props: {
    customer: IShoppingCustomer;
    input: IShoppingDepositCharge.ICreate;
  }) =>
    ({
      id: v4(),
      customer: { connect: { id: props.customer.id } },
      value: props.input.value,
      created_at: new Date(),
      deleted_at: null,
    }) satisfies Prisma.shopping_deposit_chargesCreateInput;
}
