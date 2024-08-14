import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";

import { ShoppingMileageDonationProvider } from "../../../../providers/shoppings/mileages/ShoppingMileageDonationProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/mileages/donations`)
export class ShoppingAdminMileageDonationController {
  /**
   * List up every mileage donation histories.
   *
   * List up every {@link IShoppingMileageDonation mileage donation histories}
   * with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingMileageDonation.IRequest.search search condition} in
   * the request body. Also, it is possible to customize sequence order of
   * records by configuring {@link IShoppingMileageDonation.IRequest.sort sort}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated mileage donation history list
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileageDonation.IRequest,
  ): Promise<IPage<IShoppingMileageDonation>> {
    return ShoppingMileageDonationProvider.index(admin)(input);
  }

  /**
   * Get a mileage donation history.
   *
   * Get a {@link IShoppingMileageDonation mileage donation history} with its ID.
   *
   * @param id Target history's {@link IShoppingMileageDonation.id}
   * @returns Mileage donation history
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingMileageDonation> {
    return ShoppingMileageDonationProvider.at(admin)(id);
  }

  /**
   * Donate a mileage to a citizen.
   *
   * Donate a mileage to a specific {@link IShoppingCitizen citizen} from
   * current {@link IShoppingAdministrator administrator}, with detailed
   * reason why.
   *
   * Note that, as donating mileage affects to the citizen's balance and
   * current shopping mall's operating profit, administrator must archive
   * the detailed reason why the mileage is donated.
   *
   * @param input Request info of mileage donation
   * @returns Mileage donation history
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileageDonation.ICreate,
  ): Promise<IShoppingMileageDonation> {
    return ShoppingMileageDonationProvider.create(admin)(input);
  }
}
