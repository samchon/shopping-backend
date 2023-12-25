import { v4 } from "uuid";

import { IEntity } from "@samchon/shopping-api/lib/structures/common/IEntity";
import { IShoppingActorEntity } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingActorEntity";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { ShoppingCustomerProvider } from "../actors/ShoppingCustomerProvider";

export namespace ShoppingCartProvider {
  export const emplace = async (
    actor: IShoppingActorEntity,
  ): Promise<IEntity> => {
    const oldbie = await ShoppingGlobal.prisma.shopping_carts.findFirst({
      where: {
        customer:
          actor.type === "customer"
            ? ShoppingCustomerProvider.where(actor)
            : actor.type === "seller"
            ? {
                member: {
                  of_seller: {
                    id: actor.id,
                  },
                },
              }
            : {
                member: {
                  of_admin: {
                    id: actor.id,
                  },
                },
              },
        actor_type: actor.type,
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (oldbie) return { id: oldbie.id };

    const newbie = await ShoppingGlobal.prisma.shopping_carts.create({
      data: {
        id: v4(),
        shopping_customer_id:
          actor.type === "customer" ? actor.id : actor.customer.id,
        actor_type: actor.type,
        created_at: new Date(),
        deleted_at: null,
      },
    });
    return { id: newbie.id };
  };
}
