import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingMileageProvider } from "../../providers/shoppings/mileages/ShoppingMileageProvider";

export namespace ShoppingMileageSeeder {
  export const seed = async (): Promise<void> => {
    for (const input of DATA) await ShoppingMileageProvider.create(null)(input);
  };
}

const DATA: IShoppingMileage.ICreate[] = [
  //----
  // INCOMES
  //----
  {
    code: "shopping_mileage_donation",
    source: "shopping_mileage_donations",
    direction: 1,
    value: null,
  },
  {
    code: "shopping_sale_snapshot_review_photo_reward",
    source: "shopping_sale_snapshot_reviews",
    direction: 1,
    value: 500,
  },
  {
    code: "shopping_sale_snapshot_review_text_reward",
    source: "shopping_sale_snapshot_reviews",
    direction: 1,
    value: 200,
  },
  {
    code: "shopping_order_good_confirm_reward",
    source: "shopping_order_goods",
    direction: 1,
    value: 0.015,
  },
  {
    code: "shopping_deposit_charge_reward",
    source: "shopping_deposit_charges",
    direction: 1,
    value: 0.015,
  },

  //----
  // OUTCOMES
  //----
  {
    code: "shopping_order_payment",
    source: "shopping_orders",
    direction: -1,
    value: null,
  },
];
