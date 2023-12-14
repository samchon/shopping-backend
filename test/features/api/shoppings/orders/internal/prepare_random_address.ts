import { IShoppingAddress } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAddress";
import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";

export const prepare_random_address = (
  citizen: IShoppingCitizen.ICreate,
  input?: Partial<IShoppingAddress.ICreate>,
): IShoppingAddress.ICreate => ({
  mobile: citizen!.mobile,
  name: citizen!.name,
  country: "Korea",
  province: "Seoul",
  city: "Seoul",
  department: "Seocho-gu Seocho-dong X-Apartment",
  possession: "1-101",
  zip_code: "12345",
  special_note: null,
  ...input,
});
