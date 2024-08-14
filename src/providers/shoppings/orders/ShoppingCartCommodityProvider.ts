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
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { MapUtil } from "../../../api/utils/MapUtil";
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
      for (const u of units) MapUtil.take(dict)(u.id)(() => []).push(u);

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
  export const index =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (
      input: IShoppingCartCommodity.IRequest,
    ): Promise<IPage<IShoppingCartCommodity>> =>
      PaginationUtil.paginate({
        schema: ShoppingGlobal.prisma.shopping_cart_commodities,
        payload: json.select(),
        transform: json.transform,
      })({
        where: {
          AND: [
            {
              cart: {
                id: cart !== null ? cart.id : undefined,
                customer: ShoppingCustomerProvider.where(customer),
              },
              published: false,
              deleted_at: null,
            },
            ...(await search(input.search)),
          ],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "desc" }],
      })(input);

  export const at =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (id: string): Promise<IShoppingCartCommodity> => {
      const record =
        await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
          where: {
            id,
            cart: {
              id: cart !== null ? cart.id : undefined,
              customer: ShoppingCustomerProvider.where(customer),
            },
            published: false,
            deleted_at: null,
          },
          ...json.select(),
        });
      return json.transform(record);
    };

  export const replica =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (id: string): Promise<IShoppingCartCommodity.ICreate> => {
      const commodity: IShoppingCartCommodity = await at(customer)(cart)(id);
      return ShoppingCartCommodityDiagnoser.replica(commodity);
    };

  export const discountable =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (
      input: IShoppingCartDiscountable.IRequest,
    ): Promise<IShoppingCartDiscountable> => {
      const commodities =
        input.commodity_ids !== null
          ? await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
              where: {
                id: {
                  in: input.commodity_ids,
                },
                cart: {
                  customer: ShoppingCustomerProvider.where(customer),
                  actor_type: "customer",
                  id: cart ? cart.id : undefined,
                },
                published: false,
                deleted_at: null,
              },
              ...json.select(),
            })
          : await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
              where: {
                cart: {
                  customer: ShoppingCustomerProvider.where(customer),
                  actor_type: "customer",
                },
                published: false,
                deleted_at: null,
              },
              ...json.select(),
            });
      if (
        input.commodity_ids !== null &&
        commodities.length !== input.commodity_ids.length
      )
        throw ErrorProvider.notFound({
          accessor: "input.commodity_ids",
          message: "Some commodities are not found.",
        });
      const pseudos: IShoppingCartCommodity[] =
        input.pseudos.length === 0
          ? []
          : await ArrayUtil.asyncMap(input.pseudos)(async (raw) =>
              ShoppingCartCommodityDiagnoser.preview(
                await ShoppingSaleProvider.at(customer, true)(raw.sale_id),
              )(raw),
            );

      return {
        deposit: customer.citizen
          ? await ShoppingDepositHistoryProvider.getBalance(customer.citizen)
          : 0,
        mileage: customer.citizen
          ? await ShoppingMileageHistoryProvider.getBalance(customer.citizen)
          : 0,
        combinations: ShoppingCartDiscountableDiagnoser.combinate(customer)(
          await take(ShoppingCouponProvider.index(customer)),
          customer.citizen
            ? await take(ShoppingCouponTicketProvider.index(customer))
            : [],
        )([
          ...(await ArrayUtil.asyncMap(commodities)(json.transform)),
          ...pseudos,
        ]),
      };
    };

  const search = async (
    input: IShoppingCartCommodity.IRequest.ISearch | undefined,
  ) =>
    [
      ...(input?.sale !== undefined
        ? [
            ...(
              await ShoppingSaleSnapshotProvider.searchInvert(
                "input.search.sale",
              )(input.sale)
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
  export const create =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (
      input: IShoppingCartCommodity.ICreate,
    ): Promise<IShoppingCartCommodity> => {
      // EMPLACE CART AND GET SALE INFO
      cart ??= await ShoppingCartProvider.emplace(customer);
      const sale: IShoppingSale = await ShoppingSaleProvider.at(
        customer,
        false,
      )(input.sale_id);

      // VALIDATE INPUT VALUE
      const diagnoses: IDiagnosis[] =
        ShoppingCartCommodityDiagnoser.validate(sale)(input);
      if (diagnoses.length > 0) throw ErrorProvider.unprocessable(diagnoses);

      // CHECK ACCUMULATE
      const neighbor: IShoppingCartCommodity | null = await accumulate({
        sale,
        cart,
      })(input);
      if (neighbor !== null) return neighbor;

      // DO CREATE
      const price = {
        nominal: 0,
        real: 0,
      };
      for (const si of input.stocks) {
        const unit = sale.units.find((u) => u.id === si.unit_id)!;
        const stock = unit.stocks.find((s) => s.id === si.stock_id)!;
        price.nominal += stock.price.nominal * si.quantity;
        price.real += stock.price.real * si.quantity;
      }
      const record =
        await ShoppingGlobal.prisma.shopping_cart_commodities.create({
          data: {
            id: v4(),
            cart: {
              connect: { id: cart.id },
            },
            snapshot: {
              connect: { id: sale.snapshot_id },
            },
            stocks: {
              create: input.stocks.map(
                ShoppingCartCommodityStockProvider.collect,
              ),
            },
            mv_price: {
              create: {
                nominal: price.nominal,
                real: price.real,
                volumed_price: price.real * input.volume,
              },
            },
            created_at: new Date(),
            volume: input.volume,
            deleted_at: null,
            published: false,
          },
          ...json.select(),
        });
      return json.transform(record);
    };

  export const update =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    (id: string) =>
    async (input: IShoppingCartCommodity.IUpdate): Promise<void> => {
      const record =
        await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
          where: {
            id,
            cart: {
              id: cart !== null ? cart.id : undefined,
              customer: ShoppingCustomerProvider.where(customer),
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
          shopping_cart_commodity_id: id,
        },
        data: {
          volumed_price: record.mv_price.real * input.volume,
        },
      });
    };

  export const erase =
    (customer: IShoppingCustomer) =>
    (cart: IEntity | null) =>
    async (id: string): Promise<void> => {
      await ShoppingGlobal.prisma.shopping_cart_commodities.findFirstOrThrow({
        where: {
          id,
          cart: {
            id: cart !== null ? cart.id : undefined,
            customer: ShoppingCustomerProvider.where(customer),
          },
          published: false,
          deleted_at: null,
        },
      });
      await ShoppingGlobal.prisma.shopping_cart_commodities.update({
        where: { id },
        data: {
          deleted_at: new Date(),
        },
      });
    };

  const accumulate =
    (related: { cart: IEntity; sale: IShoppingSale }) =>
    async (
      input: IShoppingCartCommodity.ICreate,
    ): Promise<IShoppingCartCommodity | null> => {
      if (input.accumulate === false) return null;

      const neighbor =
        await ShoppingGlobal.prisma.shopping_cart_commodities.findMany({
          where: {
            cart: {
              id: related.cart.id,
            },
            snapshot: {
              id: related.sale.snapshot_id,
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
        const similar: boolean = input.stocks.every((stock) => {
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
            volumed_price: elem.mv_price!.real * (elem.volume + input.volume),
          },
        });

        const record =
          await ShoppingGlobal.prisma.shopping_cart_commodities.update({
            where: { id: elem.id },
            data: {
              volume: elem.volume + input.volume,
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
