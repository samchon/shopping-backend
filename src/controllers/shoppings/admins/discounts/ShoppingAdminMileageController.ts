import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingMileage } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileage";

import { ShoppingMileageProvider } from "../../../../providers/shoppings/mileages/ShoppingMileageProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/mileages`)
export class ShoppingAdminMileageController {
  /**
   * Get mileage metadata list.
   *
   * List up every {@link IShoppingMileage mileage} metadata informations
   * with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingMileage.IRequest.search search condition} in the request body.
   * Also, it is possible to customize sequence order of records by configuring
   * {@link IShoppingMileage.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated mileage metadata list
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileage.IRequest
  ): Promise<IPage<IShoppingMileage>> {
    return ShoppingMileageProvider.index(input);
  }

  /**
   * Get a mileage metadata.
   *
   * Get a {@link IShoppingMileage mileage} metadata information with its ID.
   *
   * @param id Target mileage's {@link IShoppingMileage.id}
   * @returns Mileage metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.at(id);
  }

  /**
   * Get a mileage metadata by its code.
   *
   * Get a {@link IShoppingMileage mileage} metadata information with its code.
   *
   * @param id Target mileage's {@link IShoppingMileage.code}
   * @returns Mileage metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":code/get")
  public async get(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("code") code: string
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.get(code);
  }

  /**
   * Create a new mileage metadata.
   *
   * Create a new {@link IShoppingMileage mileage} metadata.
   *
   * This action means that adding a new origin reason of mileage's income/outcome.
   * Of course, creating a new mileage record does not mean that automatically
   * increase or decrease the {@link IShoppingCustomer customer}'s balance
   * following the record's reason why. The logic must be developed manually
   * in the backend side.
   *
   * @param input Creation information of mileage metadata
   * @returns Newly created mileage metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingMileage.ICreate
  ): Promise<IShoppingMileage> {
    return ShoppingMileageProvider.create({
      admin,
      input,
    });
  }

  /**
   * Erase a mileage metadata.
   *
   * Erase a {@link IShoppingMileage mileage} metadata, so that no more
   * {@link IShoppingCustomer customer}'s balance does not be increased or
   * decreased by the mileage's reason why.
   *
   * @param id Target mileage's {@link IShoppingMileage.id}
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">
  ): Promise<void> {
    return ShoppingMileageProvider.erase({
      admin,
      id,
    });
  }
}
