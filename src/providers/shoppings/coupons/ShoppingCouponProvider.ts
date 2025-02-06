import { HttpException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingCoupon } from "@samchon/shopping-api/lib/structures/shoppings/coupons/IShoppingCoupon";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingAdministratorProvider } from "../actors/ShoppingAdministratorProvider";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingCouponCriterialProvider } from "./ShoppingCouponCriteriaProvider";

export namespace ShoppingCouponProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_couponsGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingCoupon> => ({
      id: input.id,
      designer:
        input.actor_type === "administrator"
          ? ShoppingAdministratorProvider.invert.transform(input.customer)
          : ShoppingSellerProvider.invert.transform()(input.customer),
      discount:
        input.unit === "amount"
          ? {
              unit: "amount",
              value: input.value,
              threshold: input.threshold,
              limit: input.limit,
              multiplicative: input.multiplicative,
            }
          : {
              unit: "percent",
              value: input.value,
              threshold: input.threshold,
              limit: input.limit,
            },
      restriction: {
        access: input.access as "public",
        exclusive: input.exclusive,
        volume: input.volume,
        volume_per_citizen: input.volume_per_citizen,
        expired_in: input.expired_in,
        expired_at: input.expired_at?.toISOString() ?? null,
      },
      inventory: {
        volume: input.mv_inventory?.value ?? null,
        volume_per_citizen: input.mv_citizen_inventories?.length
          ? input.mv_citizen_inventories[0].value
          : input.volume_per_citizen,
      },
      criterias: await ShoppingCouponCriterialProvider.json.transform(
        input.criterias.sort((a, b) => a.sequence - b.sequence),
      ),
      name: input.name,
      created_at: input.created_at.toISOString(),
      opened_at: input.opened_at?.toISOString() ?? null,
      closed_at: input.closed_at?.toISOString() ?? null,
    });
    export const select = (actor: IShoppingActorEntity) =>
      ({
        include: {
          customer: ShoppingCustomerProvider.json.select(),
          criterias: ShoppingCouponCriterialProvider.json.select(),
          mv_inventory: true,
          mv_citizen_inventories:
            actor.type === "customer" && actor.citizen !== null
              ? {
                  select: {
                    value: true,
                  },
                  where: {
                    shopping_citizen_id: actor.citizen.id,
                  },
                }
              : undefined,
        },
      }) satisfies Prisma.shopping_couponsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (props: {
    actor: IShoppingActorEntity;
    input: IShoppingCoupon.IRequest;
  }): Promise<IPage<IShoppingCoupon>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_coupons,
      payload: json.select(props.actor),
      transform: json.transform,
    })({
      where: {
        AND: [
          // SOFT REMOVE
          { deleted_at: null },
          // OWNERSHIP
          ...(props.actor.type === "customer" ? [whereActor(props.actor)] : []),
          // POSSIBLE
          ...(props.actor.type === "customer" ? [wherePossible()] : []),
          // SEARCH
          ...search(props.input.search),
        ],
      } satisfies Prisma.shopping_couponsWhereInput,
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  export const at = async (props: {
    actor: IShoppingActorEntity;
    id: string;
  }): Promise<IShoppingCoupon> => {
    const record = await find({
      payload: json.select(props.actor),
      exception: (status, message) =>
        ErrorProvider.http(status)({
          accessor: "id",
          message,
        }),
      actor: props.actor,
      id: props.id,
    });
    return json.transform(record);
  };

  export const find = async <
    Payload extends Prisma.shopping_couponsFindFirstArgs,
  >(props: {
    payload: Payload;
    exception: (status: number, message: string) => HttpException;
    actor: IShoppingActorEntity;
    id: string;
  }) => {
    const record =
      await ShoppingGlobal.prisma.shopping_coupons.findFirstOrThrow({
        where: {
          id: props.id,
          deleted_at: null,
          ...whereActor(props.actor),
        },
        ...props.payload,
      });
    if (props.actor.type === "customer")
      if (record.opened_at === null || record.opened_at > new Date())
        throw props.exception(422, "The coupon has not been opened yet.");
      else if (record.closed_at && record.closed_at <= new Date())
        throw props.exception(410, "The coupon has been closed.");
      else if (record.expired_at && record.expired_at <= new Date())
        throw props.exception(410, "The coupon has been expired.");
    return record as Prisma.shopping_couponsGetPayload<typeof props.payload>;
  };

  const whereActor = (actor: IShoppingActorEntity) =>
    (actor.type === "administrator"
      ? {
          customer: {
            member: {
              of_admin: {
                id: actor.id,
              },
            },
          },
          actor_type: "administrator",
        }
      : actor.type === "seller"
        ? {
            customer: {
              member: {
                of_seller: {
                  id: actor.id,
                },
              },
            },
            actor_type: "seller",
          }
        : {}) satisfies Prisma.shopping_couponsWhereInput;

  export const wherePossible = () =>
    ({
      AND: [
        {
          opened_at: { lte: new Date() },
        },
        {
          OR: [{ closed_at: null }, { closed_at: { gt: new Date() } }],
        },
        {
          OR: [{ expired_at: null }, { expired_at: { gt: new Date() } }],
        },
        {
          OR: [{ volume: null }, { mv_inventory: { value: { gt: 0 } } }],
        },
        {
          OR: [
            { volume_per_citizen: null },
            { mv_citizen_inventories: { every: { value: { gt: 0 } } } },
          ],
        },
      ],
    }) satisfies Prisma.shopping_couponsWhereInput;

  const search = (input: IShoppingCoupon.IRequest.ISearch | null | undefined) =>
    [
      ...(input?.name?.length
        ? [
            {
              name: {
                contains: input.name,
                mode: "insensitive" as const,
              },
            },
          ]
        : [{}]),
    ] satisfies Prisma.shopping_couponsWhereInput["AND"];

  const orderBy = (
    key: IShoppingCoupon.IRequest.SortableColumns,
    direction: "asc" | "desc",
  ): Prisma.shopping_couponsOrderByWithRelationInput =>
    key === "coupon.name"
      ? { name: direction }
      : key === "coupon.created_at"
        ? { created_at: direction }
        : key === "coupon.opened_at"
          ? { opened_at: direction }
          : { closed_at: direction };

  /* -----------------------------------------------------------
          WRITERS 
        ----------------------------------------------------------- */
  export const create = async (props: {
    actor: IShoppingAdministrator.IInvert | IShoppingSeller.IInvert;
    input: IShoppingCoupon.ICreate;
  }): Promise<IShoppingCoupon> => {
    const record = await ShoppingGlobal.prisma.shopping_coupons.create({
      data: await collect(props),
      ...json.select(props.actor),
    });
    return json.transform(record);
  };

  export const erase = async (props: {
    actor: IShoppingAdministrator.IInvert | IShoppingSeller.IInvert;
    id: string;
  }): Promise<void> => {
    // const record =
    await find({
      payload: {},
      exception: (status, message) =>
        ErrorProvider.http(status)({ accessor: "id", message }),
      actor: props.actor,
      id: props.id,
    });
    // if (record.opened_at !== null && record.opened_at.getTime() <= Date.now())
    //   throw ErrorProvider.gone({
    //     accessor: "id",
    //     message: "The coupon has been already opened.",
    //   });
    await ShoppingGlobal.prisma.shopping_coupons.update({
      where: {
        id: props.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  };

  export const destroy = async (props: {
    admin: IShoppingAdministrator.IInvert;
    id: string;
  }): Promise<void> => {
    await ShoppingGlobal.prisma.shopping_coupons.delete({
      where: {
        id: props.id,
      },
    });
  };

  const collect = async (props: {
    actor: IShoppingAdministrator.IInvert | IShoppingSeller.IInvert;
    input: IShoppingCoupon.ICreate;
  }) =>
    ({
      id: v4(),
      customer: {
        connect: {
          id: props.actor.customer.id,
        },
      },
      actor_type: props.actor.type,
      name: props.input.name,
      access: props.input.restriction.access,
      exclusive: props.input.restriction.exclusive,
      unit: props.input.discount.unit,
      value: props.input.discount.value,
      threshold:
        props.input.discount.unit === "percent"
          ? props.input.discount.threshold
          : null,
      limit:
        props.input.discount.unit === "percent"
          ? props.input.discount.limit
          : null,
      multiplicative:
        props.input.discount.unit === "amount"
          ? props.input.discount.multiplicative
          : false,
      volume: props.input.restriction.volume,
      volume_per_citizen: props.input.restriction.volume_per_citizen,
      expired_in: props.input.restriction.expired_in,
      expired_at: props.input.restriction.expired_at,
      created_at: new Date(),
      updated_at: new Date(),
      opened_at: props.input.opened_at,
      closed_at: props.input.closed_at,
      deleted_at: null,
      mv_inventory: props.input.restriction.volume
        ? {
            create: {
              value: props.input.restriction.volume,
            },
          }
        : undefined,
      criterias: {
        create: await ShoppingCouponCriterialProvider.collect({
          actor: props.actor,
          inputs: props.input.criterias,
        }),
      },
    }) satisfies Prisma.shopping_couponsCreateInput;
}
