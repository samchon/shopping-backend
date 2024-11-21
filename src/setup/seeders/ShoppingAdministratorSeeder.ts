import { v4 } from "uuid";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";

import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingMemberProvider } from "../../providers/shoppings/actors/ShoppingMemberProvider";

import { ShoppingGlobal } from "../../ShoppingGlobal";

export namespace ShoppingAdministratorSeeder {
  export const seed = async (): Promise<void> => {
    const customer: IShoppingCustomer = await ShoppingCustomerProvider.create({
      request: {
        ip: "127.0.0.1",
      },
      input: {
        external_user: null,
        channel_code: "samchon",
        href: "http://localhost/TestAutomation",
        referrer: "http://localhost/NodeJS",
      },
    });
    const joined: IShoppingCustomer = await ShoppingMemberProvider.join({
      customer,
      input: {
        email: "robot@nestia.io",
        password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
        nickname: "Robot",
        citizen: {
          mobile: "01012345678",
          name: "Robot",
        },
      },
    });
    await ShoppingGlobal.prisma.shopping_administrators.create({
      data: {
        id: v4(),
        member: {
          connect: { id: joined.member!.id },
        },
        created_at: new Date(),
      },
    });
    await ShoppingGlobal.prisma.shopping_sellers.create({
      data: {
        id: v4(),
        member: {
          connect: { id: joined.member!.id },
        },
        created_at: new Date(),
      },
    });
  };
}
