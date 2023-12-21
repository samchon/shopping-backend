import { IShoppingSection } from "@samchon/shopping-api/lib/structures/shoppings/systematic/IShoppingSection";

import { ShoppingSectionProvider } from "../../providers/shoppings/systematic/ShoppingSectionProvider";

export namespace ShoppingSectionSeeder {
  export const seed = async (): Promise<void> => {
    for (const input of DATA) await ShoppingSectionProvider.create(input);
  };
}

const DATA: IShoppingSection.ICreate[] = [
  {
    code: "general",
    name: "General",
  },
];
