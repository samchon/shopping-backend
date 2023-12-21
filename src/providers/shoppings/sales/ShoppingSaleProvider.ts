import { Prisma } from "@prisma/client";
import { ShoppingSellerProvider } from "../actors/ShoppingSellerProvider";
import { ShoppingSectionProvider } from "../systematic/ShoppingSectionProvider";
import { ShoppingSaleSnapshotProvider } from "./ShoppingSaleSnapshotProvider";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";
import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { v4 } from "uuid";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";

export namespace ShoppingSaleProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = async (
      input: Prisma.shopping_salesGetPayload<
        ReturnType<typeof ShoppingSaleProvider.json.select>
      >
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
        ...await ShoppingSaleSnapshotProvider.json.transform(snapshot),
      };
    };
    export const select = () => ({
      include: {
        sellerCustomer: ShoppingSellerProvider.invert.select(),
        section: ShoppingSectionProvider.json.select(),
        mv_last: {
          include: {
            snapshot: ShoppingSaleSnapshotProvider.json.select(),
          }
        }
      },
    } satisfies Prisma.shopping_salesFindManyArgs)
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const at = 
    (actor: IShoppingActorEntity) => 
    async (id: string): Promise<IShoppingSale> => {
      const record = await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          id,
          AND: where(actor),
        },
        ...json.select(),
      });
      return json.transform(record);
    };

  const where = (actor: IShoppingActorEntity) => (
    actor.type === 'seller'
      ? [{
        sellerCustomer: {
          member: {
            of_seller: { id: actor.id },
          },
        },
      }] : 
      actor.type === 'customer'
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
      :
      []
  ) satisfies Prisma.shopping_salesWhereInput["AND"];
    
  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = 
    (seller: IShoppingSeller.IInvert) =>
    async (input: IShoppingSale.ICreate): Promise<IShoppingSale> => {
      const section: IShoppingSection = await ShoppingSectionProvider.get(input.section_code);
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
                connect: { id: snapshot.id }
              }
            }
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

      const snapshot = await ShoppingGlobal.prisma.shopping_sale_snapshots.create({
        data: {
          sale: { connect: { id } },
          ...await ShoppingSaleSnapshotProvider.collect(input),
        },
        ...ShoppingSaleSnapshotProvider.json.select(),
      });
      await ShoppingGlobal.prisma.mv_shopping_sale_last_snapshots.update({
        where: { 
          shopping_sale_id: id 
        },
        data: {
          snapshot: { connect: { id: snapshot.id } },
        },
      });
      return at(seller)(id);
    };

  const ownership = (seller: IShoppingSeller.IInvert) => async (id: string) => {
    await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
      where: {
        id,
        sellerCustomer: {
          member: {
            of_seller: {
              id: seller.id,
            }
          },
        },
      }
    });
  };
}