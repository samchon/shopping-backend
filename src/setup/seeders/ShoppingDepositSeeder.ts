import { IShoppingDeposit } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDeposit";

import { ShoppingDepositProvider } from "../../providers/shoppings/deposits/ShoppingDepositProvider";

export namespace ShoppingDepositSeeder {
  export const seed = async (): Promise<void> => {
    for (const input of DATA) await ShoppingDepositProvider.create(null)(input);
  };
}

const DATA: IShoppingDeposit.ICreate[] = [
  {
    code: "shopping_deposit_charge",
    source: "shopping_deposit_charges",
    direction: 1,
  },
  {
    code: "shopping_order_payment",
    source: "shopping_orders",
    direction: -1,
  },
];
