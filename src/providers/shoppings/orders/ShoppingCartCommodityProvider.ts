import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { ShoppingCartCommodityDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/orders/ShoppingCartCommodityDiagnoser";
import { ShoppingCartDiscountableDiagnoser } from "@samchon/shopping-api/lib/diagnosers/shoppings/orders/ShoppingCartDiscountableDiagnoser";
import { IDiagnosis } from "@samchon/shopping-api/lib/structures/common/IDiagnosis";
import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingCartDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartDiscountable";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleSnapshot } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleSnapshot";
import { IShoppingSaleUnit } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSaleUnit";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { MapUtil } from "../../../api/utils/MapUtil";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { PaginationUtil } from "../../../utils/PaginationUtil";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";
import { ShoppingCouponProvider } from "../coupons/ShoppingCouponProvider";
import { ShoppingCouponTicketProvider } from "../coupons/ShoppingCouponTicketProvider";
import { ShoppingDepositHistoryProvider } from "../deposits/ShoppingDepositHistoryProvider";
import { ShoppingMileageHistoryProvider } from "../mileages/ShoppingMileageHistoryProvider";
import { ShoppingSaleProvider } from "../sales/ShoppingSaleProvider";
import { ShoppingSaleSnapshotProvider } from "../sales/ShoppingSaleSnapshotProvider";
import { ShoppingCartCommodityStockProvider } from "./ShoppingCartCommodityStockProvider";
import { ShoppingCartProvider } from "./ShoppingCartProvider";

export namespace ShoppingCartCommodityProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_cart_commoditiesGetPayload<
        ReturnType<typeof select>
      >,
    ): Promise<IShoppingCartCommodity> => {
      if (input.mv_price === null)
        throw ErrorProvider.internal("No mv_price found");
      const snapshot: IShoppingSaleSnapshot.IInvert = {
        ...(await ShoppingSaleSnapshotProvider.invert.transform(
          input.snapshot,
        )),
        units: [],
      };
      const units: IShoppingSaleUnit.IInvert[] = input.stocks
        .sort((a, b) => a.sequence - b.sequence)
        .map(ShoppingCartCommodityStockProvider.json.transform);
      const dict: Map<string, IShoppingSaleUnit.IInvert[]> = new Map();
      for (const u of units) MapUtil.take(dict, u.id, () => []).push(u);

      return {
        id: input.id,
        sale: {
          ...snapshot,
          units: Array.from(dict.values()).map((units) => ({
            ...units[0],
            stocks: units.map((u) => u.stocks[0]),
          })),
        },
        pseudo: false,
        price: {
          nominal: input.mv_price.nominal,
          real: input.mv_price.real,
        },
        volume: input.volume,
        orderable: input.published === false,
        created_at: input.created_at.toISOString(),
      };
    };
    export const select = () =>
      ({
        include: {
          snapshot: ShoppingSaleSnapshotProvider.invert.select(),
          stocks: ShoppingCartCommodityStockProvider.json.select(),
          mv_price: true,
        },
      }) satisfies Prisma.shopping_cart_commoditiesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    input: IShoppingCartCommodity.IRequest;
  }): Promise<IPage<IShoppingCartCommodity>> =>
    PaginationUtil.paginate({
      schema: ShoppingGlobal.prisma.shopping_cart_commodities,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: [
          {
            cart: {
              id: props.cart?.id ?? undefined,
              customer: ShoppingCustomerProvider.where(props.customer),
            },
            published: false,
            deleted_at: null,
          },
          ...(await search(props.input.search)),
        ],
      },
      orderBy: props.input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.input.sort)
        : [{ created_at: "desc" }],
    })(props.input);

  export const at = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    id: string;
  }): Promise<IShoppingCartCommodity> => {
    const record =
      await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
        where: {
          id: props.id,
          cart: {
            id: props.cart?.id ?? undefined,
            customer: ShoppingCustomerProvider.where(props.customer),
          },
          published: false,
          deleted_at: null,
        },
        ...json.select(),
      });
    return json.transform(record);
  };

  export const replica = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    id: string;
  }): Promise<IShoppingCartCommodity.ICreate> => {
    const commodity: IShoppingCartCommodity = await at(props);
    return ShoppingCartCommodityDiagnoser.replica(commodity);
  };

  export const discountable = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    input: IShoppingCartDiscountable.IRequest;
  }): Promise<IShoppingCartDiscountable> => {
    const commodities =
      props.input.commodity_ids !== null
        ? await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
            where: {
              id: {
                in: props.input.commodity_ids,
              },
              cart: {
                customer: ShoppingCustomerProvider.where(props.customer),
                actor_type: "customer",
                id: props.cart?.id ?? undefined,
              },
              published: false,
              deleted_at: null,
            },
            ...json.select(),
          })
        : await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
            where: {
              cart: {
                customer: ShoppingCustomerProvider.where(props.customer),
                actor_type: "customer",
              },
              published: false,
              deleted_at: null,
            },
            ...json.select(),
          });
    if (
      props.input.commodity_ids !== null &&
      commodities.length !== props.input.commodity_ids.length
    )
      throw ErrorProvider.notFound({
        accessor: "input.commodity_ids",
        message: "Some commodities are not found.",
      });
    const pseudos: IShoppingCartCommodity[] =
      props.input.pseudos.length === 0
        ? []
        : await ArrayUtil.asyncMap(props.input.pseudos, async (raw) =>
            ShoppingCartCommodityDiagnoser.preview({
              sale: await ShoppingSaleProvider.at({
                actor: props.customer,
                id: raw.sale_id,
                strict: true,
              }),
              input: raw,
            }),
          );

    return {
      deposit: props.customer.citizen
        ? await ShoppingDepositHistoryProvider.getBalance(
            props.customer.citizen,
          )
        : 0,
      mileage: props.customer.citizen
        ? await ShoppingMileageHistoryProvider.getBalance(
            props.customer.citizen,
          )
        : 0,
      combinations: ShoppingCartDiscountableDiagnoser.combine({
        customer: props.customer,
        coupons: await take((input) =>
          ShoppingCouponProvider.index({
            actor: props.customer,
            input,
          }),
        ),
        tickets: props.customer.citizen
          ? await take((input) =>
              ShoppingCouponTicketProvider.index({
                customer: props.customer,
                input,
              }),
            )
          : [],
        commodities: [
          ...(await ArrayUtil.asyncMap(commodities, json.transform)),
          ...pseudos,
        ],
      }),
    };
  };

  const search = async (
    input: IShoppingCartCommodity.IRequest.ISearch | null | undefined,
  ) =>
    [
      ...(input?.sale !== undefined
        ? [
            ...(
              await ShoppingSaleSnapshotProvider.searchInvert({
                accessor: "input.search.sale",
                input: input.sale,
              })
            ).map((snapshot) => ({
              snapshot,
            })),
          ]
        : []),
      ...(input?.min_price !== undefined
        ? [
            {
              mv_price: {
                real: {
                  gte: input.min_price,
                },
              },
            },
          ]
        : []),
      ...(input?.max_price !== undefined
        ? [
            {
              mv_price: {
                real: {
                  lte: input.max_price,
                },
              },
            },
          ]
        : []),
      ...(input?.min_volumed_price !== undefined
        ? [
            {
              mv_price: {
                volumed_price: {
                  gte: input.min_volumed_price,
                },
              },
            },
          ]
        : []),
      ...(input?.max_volumed_price !== undefined
        ? [
            {
              mv_price: {
                volumed_price: {
                  lte: input.max_volumed_price,
                },
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_cart_commoditiesWhereInput["AND"];

  const orderBy = (
    key: IShoppingCartCommodity.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    key === "commodity.created_at"
      ? { created_at: value }
      : key === "commodity.price"
        ? { mv_price: { real: value } }
        : key === "commodity.volume"
          ? { volume: value }
          : key === "commodity.volumed_price"
            ? { mv_price: { volumed_price: value } }
            : { snapshot: ShoppingSaleSnapshotProvider.orderBy(key, value) };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    input: IShoppingCartCommodity.ICreate;
  }): Promise<IShoppingCartCommodity> => {
    // EMPLACE CART AND GET SALE INFO
    props.cart ??= await ShoppingCartProvider.emplace(props.customer);
    const sale: IShoppingSale = await ShoppingSaleProvider.at({
      actor: props.customer,
      id: props.input.sale_id,
      strict: false,
    });

    // VALIDATE INPUT VALUE
    const diagnoses: IDiagnosis[] = ShoppingCartCommodityDiagnoser.validate({
      sale,
      input: props.input,
    });
    if (diagnoses.length > 0) throw ErrorProvider.unprocessable(diagnoses);

    // CHECK ACCUMULATE
    const neighbor: IShoppingCartCommodity | null = await accumulate({
      sale,
      cart: props.cart,
      input: props.input,
    });
    if (neighbor !== null) return neighbor;

    // DO CREATE
    const price = {
      nominal: 0,
      real: 0,
    };
    for (const si of props.input.stocks) {
      const unit = sale.units.find((u) => u.id === si.unit_id)!;
      const stock = unit.stocks.find((s) => s.id === si.stock_id)!;
      price.nominal += stock.price.nominal * si.quantity;
      price.real += stock.price.real * si.quantity;
    }
    const record = await ShoppingGlobal.prisma.shopping_cart_commodities.create(
      {
        data: {
          id: v4(),
          cart: {
            connect: { id: props.cart.id },
          },
          snapshot: {
            connect: { id: sale.snapshot_id },
          },
          stocks: {
            create: props.input.stocks.map((si, i) =>
              ShoppingCartCommodityStockProvider.collect(
                sale.units
                  .find((u) => u.id === si.unit_id)!
                  .stocks.find((s) => s.id === si.stock_id)!,
                si,
                i,
              ),
            ),
          },
          mv_price: {
            create: {
              nominal: price.nominal,
              real: price.real,
              volumed_price: price.real * props.input.volume,
            },
          },
          created_at: new Date(),
          volume: props.input.volume,
          deleted_at: null,
          published: false,
        },
        ...json.select(),
      },
    );
    return json.transform(record);
  };

  export const update = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    id: string;
    input: IShoppingCartCommodity.IUpdate;
  }): Promise<void> => {
    const record =
      await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
        where: {
          id: props.id,
          cart: {
            id: props.cart?.id ?? undefined,
            customer: ShoppingCustomerProvider.where(props.customer),
          },
          published: false,
          deleted_at: null,
        },
        include: {
          mv_price: true,
        },
      });
    if (record.mv_price === null)
      throw ErrorProvider.internal("No mv_price found");
    await ShoppingGlobal.prisma.mv_shopping_cart_commodity_prices.update({
      where: {
        shopping_cart_commodity_id: props.id,
      },
      data: {
        volumed_price: record.mv_price.real * props.input.volume,
      },
    });
  };

  export const erase = async (props: {
    customer: IShoppingCustomer;
    cart: IEntity | null;
    id: string;
  }): Promise<void> => {
    await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
      where: {
        id: props.id,
        cart: {
          id: props.cart?.id ?? undefined,
          customer: ShoppingCustomerProvider.where(props.customer),
        },
        published: false,
        deleted_at: null,
      },
    });
    await ShoppingGlobal.prisma.shopping_cart_commodities.update({
      where: { id: props.id },
      data: {
        deleted_at: new Date(),
      },
    });
  };

  const accumulate = async (props: {
    cart: IEntity;
    sale: IShoppingSale;
    input: IShoppingCartCommodity.ICreate;
  }): Promise<IShoppingCartCommodity | null> => {
    if (props.input.accumulate === false) return null;

    const neighbor =
      await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
        where: {
          cart: {
            id: props.cart.id,
          },
          snapshot: {
            id: props.sale.snapshot_id,
          },
          published: false,
          deleted_at: null,
        },
        include: {
          stocks: true,
          mv_price: true,
        },
      });
    if (neighbor === null) return null;

    for (const elem of neighbor) {
      const similar: boolean = props.input.stocks.every((stock) => {
        const opposite = elem.stocks.find(
          (s) => s.shopping_sale_snapshot_unit_stock_id === stock.stock_id,
        );
        return opposite !== undefined;
      });
      if (similar === false) break;
      else if (elem.mv_price === null)
        throw ErrorProvider.internal("No mv_price found");

      await ShoppingGlobal.prisma.mv_shopping_cart_commodity_prices.update({
        where: {
          shopping_cart_commodity_id: elem.id,
        },
        data: {
          volumed_price:
            elem.mv_price!.real * (elem.volume + props.input.volume),
        },
      });

      const record =
        await ShoppingGlobal.prisma.shopping_cart_commodities.update({
          where: { id: elem.id },
          data: {
            volume: elem.volume + props.input.volume,
          },
          ...json.select(),
        });
      return json.transform(record);
    }
    return null;
  };
}

const take = async <T extends object>(
  closure: (input: IPage.IRequest) => Promise<IPage<T>>,
): Promise<T[]> => {
  const page: IPage<T> = await closure({ limit: 0 });
  return page.data;
};
