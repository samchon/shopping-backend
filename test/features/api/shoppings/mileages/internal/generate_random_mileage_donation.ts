import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";

import { ConnectionPool } from "../../../../../ConnectionPool";

export const generate_random_mileage_donation = async (
  pool: ConnectionPool,
  citizen: IShoppingCitizen,
  input?: Partial<Omit<IShoppingMileageDonation.ICreate, "citizen_id">>
): Promise<IShoppingMileageDonation> => {
  const donation: IShoppingMileageDonation =
    await ShoppingApi.functional.shoppings.admins.mileages.donations.create(
      pool.admin,
      {
        value: 10_000,
        reason: "test",
        citizen_id: citizen.id,
        ...input,
      }
    );
  return donation;
};
