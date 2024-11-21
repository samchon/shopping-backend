import fs from "fs";
import { ShoppingConfiguration } from "../../ShoppingConfiguration";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import typia from "typia";
import { IShoppingSeller } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingSeller";
import { ShoppingSaleProvider } from "../../providers/shoppings/sales/ShoppingSaleProvider";
import { ShoppingSellerProvider } from "../../providers/shoppings/actors/ShoppingSellerProvider";
import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingGlobal } from "../../ShoppingGlobal";

export namespace ShoppingSaleSeeder {
  export const seed = async (): Promise<void> => {
    const customer = await ShoppingCustomerProvider.create({
      request: { ip: "127.0.0.1" },
      input: {
        href: "http://127.0.0.1/TestAutomation",
        referrer: "http://127.0.0.1/NodeJS",
        channel_code: "samchon",
        external_user: null,
      },
    });
    const seller: IShoppingSeller.IInvert = await ShoppingSellerProvider.login({
      customer,
      input: {
        email: "robot@nestia.io",
        password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
      },
    });
    const categoryCodes: Set<string> = new Set(
      (
        await ShoppingGlobal.prisma.shopping_channel_categories.findMany({
          where: {
            channel: {
              code: "samchon",
            },
          },
        })
      ).map((c) => c.code)
    );

    const directory: string[] = await fs.promises.readdir(
      `${ShoppingConfiguration.ROOT}/assets/raw/sales`
    );
    for (const file of directory) {
      if (file.endsWith(".json") === false) continue;
      const input = JSON.parse(
        await fs.promises.readFile(
          `${ShoppingConfiguration.ROOT}/assets/raw/sales/${file}`,
          "utf8"
        )
      );

      typia.assertGuard<IShoppingSale.ICreate>(input);
      input.channels.forEach((channel) => {
        channel.category_codes = channel.category_codes.filter((code) =>
          categoryCodes.has(code)
        );
      });
      input.opened_at = new Date().toISOString();
      input.closed_at = null;
      input.status = null;

      await ShoppingSaleProvider.create({
        seller,
        input,
      });
    }
  };
}
