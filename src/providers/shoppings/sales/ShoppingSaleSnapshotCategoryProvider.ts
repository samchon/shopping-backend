import { Prisma } from "@prisma/client";

import { IShoppingChannelCategory } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingChannelCategory";

import { ShoppingChannelCategoryProvider } from "../systematic/ShoppingChannelCategoryProvider";

export namespace ShoppingSaleSnapshotCategoryProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_categoriesGetPayload<
        ReturnType<typeof ShoppingSaleSnapshotCategoryProvider.json.select>
      >,
    ): Promise<IShoppingChannelCategory.IInvert> =>
      ShoppingChannelCategoryProvider.invert({
        channel: { id: input.category.shopping_channel_id },
        id: input.category.id,
      });
    export const select = () =>
      ({
        select: {
          category: {
            select: {
              id: true,
              shopping_channel_id: true,
            },
          },
          sequence: true,
        },
      }) satisfies Prisma.shopping_sale_snapshot_categoriesFindManyArgs;
  }
}
