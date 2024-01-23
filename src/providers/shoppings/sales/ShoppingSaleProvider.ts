import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { ShoppingSaleDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/sales/ShoppingSaleDiagnoser";
import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingSectionProvider } from "../systematic/ShoppingSectionProvider";
import { ShoppingSaleSnapshotProvider } from "./ShoppingSaleSnapshotProvider";

export namespace ShoppingSaleProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace summary {
    export const transform = async (
      input: Prisma.shopping_salesGetPayload<ReturnType<typeof select>>,
    ): Promise<IShoppingSale.ISummary> => {
      const snapshot = input.mv_last?.snapshot;
      if (!snapshot) throw ErrorProvider.internal("No snapshot found.");
      return {
        section: ShoppingSectionProvider.json.transform(input.section),
        seller: ShoppingSellerProvider.invert.transform(() =>
          ErrorProvider.internal(`The sale has not been registered by seller.`),
        )(input.sellerCustomer),
        created_at: input.created_at.toISOString(),
        updated_at: snapshot.created_at.toISOString(),
        paused_at: input.paused_at?.toISOString() ?? null,
        suspended_at: input.suspended_at?.toISOString() ?? null,
        opened_at: input.opened_at?.toISOString() ?? null,
        closed_at: input.closed_at?.toISOString() ?? null,
        latest: true,
        ...(await ShoppingSaleSnapshotProvider.summary.transform(snapshot)),
      };
    };
    export const select = () =>
      ({
        include: {
          section: ShoppingSectionProvider.json.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          mv_last: {
            include: {
              snapshot: ShoppingSaleSnapshotProvider.summary.select(),
            },
          },
        },
      }) satisfies Prisma.shopping_salesFindManyArgs;
  }

  export namespace json {
    export const transform = async (
      input: Prisma.shopping_salesGetPayload<
        ReturnType<typeof ShoppingSaleProvider.json.select>
      >,
    ): Promise<IShoppingSale> => {
      const snapshot = input.mv_last?.snapshot;
      if (!snapshot) throw ErrorProvider.internal("No snapshot found.");
      return {
        section: ShoppingSectionProvider.json.transform(input.section),
        seller: ShoppingSellerProvider.invert.transform(() =>
          ErrorProvider.internal(`The sale has not been registered by seller.`),
        )(input.sellerCustomer),
        created_at: input.created_at.toISOString(),
        updated_at: snapshot.created_at.toISOString(),
        paused_at: input.paused_at?.toISOString() ?? null,
        suspended_at: input.suspended_at?.toISOString() ?? null,
        opened_at: input.opened_at?.toISOString() ?? null,
        closed_at: input.closed_at?.toISOString() ?? null,
        latest: true,
        ...(await ShoppingSaleSnapshotProvider.json.transform(snapshot)),
      };
    };
    export const select = () =>
      ({
        include: {
          section: ShoppingSectionProvider.json.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
          mv_last: {
            include: {
              snapshot: ShoppingSaleSnapshotProvider.json.select(),
            },
          },
        },
      }) satisfies Prisma.shopping_salesFindManyArgs;
  }

  export namespace history {
    export const transform = (
      input: Prisma.shopping_salesGetPayload<ReturnType<typeof select>>,
    ): Omit<IShoppingSale, keyof IShoppingSaleSnapshot | "updated_at"> => ({
      section: ShoppingSectionProvider.json.transform(input.section),
      seller: ShoppingSellerProvider.invert.transform(() =>
        ErrorProvider.internal("The sale has not been registered by seller."),
      )(input.sellerCustomer),
      created_at: input.created_at.toISOString(),
      paused_at: input.paused_at?.toISOString() ?? null,
      suspended_at: input.suspended_at?.toISOString() ?? null,
      opened_at: input.opened_at?.toISOString() ?? null,
      closed_at: input.closed_at?.toISOString() ?? null,
    });
    export const select = () =>
      ({
        include: {
          section: ShoppingSectionProvider.json.select(),
          sellerCustomer: ShoppingSellerProvider.invert.select(),
        },
      }) satisfies Prisma.shopping_salesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (actor: IShoppingActorEntity) => async (input: IShoppingSale.IRequest) =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_sales,
        payload: summary.select(),
        transform: summary.transform,
      })({
        where: {
          AND: [...where(actor, true), ...(await search(actor)(input.search))],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "desc" }],
      } satisfies Prisma.shopping_salesFindManyArgs)(input);

  export const at =
    (
      actor: IShoppingActorEntity,
      strict: boolean = actor.type === "customer" ? true : false,
    ) =>
    async (id: string): Promise<IShoppingSale> => {
      const record =
        await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
          where: {
            id,
            AND: where(actor, false),
          },
          ...json.select(),
        });
      const sale: IShoppingSale = await json.transform(record);
      if (actor.type === "customer" && strict === true) {
        const diagnoses: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
          accessor: "id",
          checkPause: false,
        })(sale);
        if (diagnoses.length) throw ErrorProvider.unprocessable(diagnoses);
      }
      return sale;
    };

  export const replica =
    (seller: IShoppingSeller.IInvert) => async (id: string) => {
      const sale: IShoppingSale = await at(seller)(id);
      return ShoppingSaleDiagnoser.replica(sale);
    };

  const where = (actor: IShoppingActorEntity, strict: boolean) =>
    (actor.type === "seller"
      ? [
          {
            sellerCustomer: {
              member: {
                of_seller: { id: actor.id },
              },
            },
          },
        ]
      : actor.type === "customer" && strict === true
        ? [
            {
              opened_at: { lte: new Date() },
              suspended_at: null,
              OR: [
                { closed_at: null },
                {
                  closed_at: { gt: new Date() },
                },
              ],
            },
          ]
        : []) satisfies Prisma.shopping_salesWhereInput["AND"];

  const search =
    (actor: IShoppingActorEntity) =>
    async (input: IShoppingSale.IRequest.ISearch | undefined) =>
      [
        // SALE
        ...(input?.seller !== undefined
          ? ShoppingSellerProvider.searchFromCustomer(input.seller).map(
              (sellerCustomer) => ({ sellerCustomer }),
            )
          : []),
        ...(input?.section_codes?.length
          ? [{ section: { code: { in: input.section_codes } } }]
          : []),
        // STATUS
        ...(input?.show_paused === false ? [{ paused_at: { not: null } }] : []),
        ...(input?.show_suspended !== undefined
          ? input.show_suspended === false
            ? [{ suspended_at: null }]
            : []
          : actor.type === "customer"
            ? [{ suspended_at: null }]
            : []),
        // TO THE SNAPSHOT
        ...(
          await ShoppingSaleSnapshotProvider.search("input.search")(input)
        ).map((snapshot) => ({
          mv_last: { snapshot },
        })),
        // @todo - AGGREGATES
      ] satisfies Prisma.shopping_salesWhereInput["AND"];

  const orderBy = (
    key: IShoppingSale.IRequest.SortableColumns,
    direction: "asc" | "desc",
  ) =>
    (key === "sale.created_at"
      ? { created_at: direction }
      : key === "sale.updated_at"
        ? {
            mv_last: {
              snapshot: {
                created_at: direction,
              },
            },
          }
        : key === "sale.opened_at"
          ? { opened_at: direction }
          : key === "sale.closed_at"
            ? { closed_at: direction }
            : key === "sale.content.title"
              ? {
                  mv_last: {
                    snapshot: {
                      content: { title: direction },
                    },
                  },
                }
              : key === "sale.price_range.lowest.real"
                ? {
                    mv_last: {
                      snapshot: {
                        mv_price_range: {
                          real_lowest: direction,
                        },
                      },
                    },
                  }
                : key === "sale.price_range.highest.real"
                  ? {
                      mv_last: {
                        snapshot: {
                          mv_price_range: {
                            real_highest: direction,
                          },
                        },
                      },
                    }
                  : key === "goods.publish_count" ||
                      key === "goods.payments.real" ||
                      key === "reviews.average" ||
                      key === "reviews.count" ||
                      key === "seller.reviews.average"
                    ? { created_at: direction } // @todo
                    : {
                        sellerCustomer: {
                          member: {
                            of_seller: ShoppingSellerProvider.orderBy(
                              key,
                              direction,
                            ),
                          },
                        },
                      }) satisfies Prisma.shopping_salesOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (seller: IShoppingSeller.IInvert) =>
    async (input: IShoppingSale.ICreate): Promise<IShoppingSale> => {
      const section: IShoppingSection = await ShoppingSectionProvider.get(
        input.section_code,
      );
      const snapshot = await ShoppingSaleSnapshotProvider.collect(input);
      const record = await ShoppingGlobal.prisma.shopping_sales.create({
        data: {
          id: v4(),
          section: {
            connect: { id: section.id },
          },
          sellerCustomer: {
            connect: { id: seller.customer.id },
          },
          snapshots: {
            create: [snapshot],
          },
          mv_last: {
            create: {
              snapshot: {
                connect: { id: snapshot.id },
              },
            },
          },
          created_at: new Date(),
          opened_at: input.opened_at,
          closed_at: input.closed_at,
        },
        ...json.select(),
      });
      return json.transform(record);
    };

  export const update =
    (seller: IShoppingSeller.IInvert) =>
    (id: string) =>
    async (input: IShoppingSale.IUpdate): Promise<IShoppingSale> => {
      await ownership(seller)(id);

      const snapshot =
        await ShoppingGlobal.prisma.shopping_sale_snapshots.create({
          data: {
            sale: { connect: { id } },
            ...(await ShoppingSaleSnapshotProvider.collect(input)),
          },
          ...ShoppingSaleSnapshotProvider.json.select(),
        });
      await ShoppingGlobal.prisma.mv_shopping_sale_last_snapshots.update({
        where: {
          shopping_sale_id: id,
        },
        data: {
          snapshot: { connect: { id: snapshot.id } },
        },
      });
      return at(seller)(id);
    };

  export const updateOpeningTime =
    (seller: IShoppingSeller.IInvert) =>
    (id: string) =>
    async (input: IShoppingSale.IUpdateOpeningTime): Promise<void> => {
      await ownership(seller)(id);
      await ShoppingGlobal.prisma.shopping_sales.update({
        where: { id },
        data: {
          opened_at: input.opened_at,
          closed_at: input.closed_at,
        },
      });
    };

  export const suspend =
    (seller: IShoppingSeller.IInvert) => async (id: string) => {
      await ownership(seller)(id);
      await ShoppingGlobal.prisma.shopping_sales.update({
        where: { id },
        data: {
          suspended_at: new Date(),
        },
      });
    };

  export const pause =
    (seller: IShoppingSeller.IInvert) => async (id: string) => {
      await ownership(seller)(id);
      await ShoppingGlobal.prisma.shopping_sales.update({
        where: { id },
        data: {
          paused_at: new Date(),
        },
      });
    };

  export const restore =
    (seller: IShoppingSeller.IInvert) => async (id: string) => {
      await ownership(seller)(id);
      await ShoppingGlobal.prisma.shopping_sales.update({
        where: { id },
        data: {
          paused_at: null,
          suspended_at: null,
        },
      });
    };

  const ownership = (seller: IShoppingSeller.IInvert) => async (id: string) => {
    await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
      where: {
        id,
        sellerCustomer: {
          member: {
            of_seller: {
              id: seller.id,
            },
          },
        },
      },
    });
  };
}
