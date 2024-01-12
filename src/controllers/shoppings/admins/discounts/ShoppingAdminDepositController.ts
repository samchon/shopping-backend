import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IPage } from "@samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingDeposit } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDeposit";

import { ShoppingDepositProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";

@Controller(`shoppings/admins/deposits`)
export class ShoppingAdminDepositController {
  /**
   * Get deposit metadata list.
   *
   * List up every {@link IShoppingDeposit deposit} metadata informations
   * with {@link IPage pagination}.
   *
   * If you want, you can limit the result by configuring
   * {@link IShoppingDeposit.IRequest.search search condition} in the request body.
   * Also, it is possible to customize sequence order of records by configuring
   * {@link IShoppingDeposit.IRequest.sort sort condition}.
   *
   * @param input Request info of pagination, searching and sorting
   * @returns Paginated deposit metadata list
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public async index(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingDeposit.IRequest,
  ): Promise<IPage<IShoppingDeposit>> {
    return ShoppingDepositProvider.index(input);
  }

  /**
   * Get a deposit metadata.
   *
   * Get a {@link IShoppingDeposit deposit} metadata information with its ID.
   *
   * @param id Target deposit's {@link IShoppingDeposit.id}
   * @returns Deposit metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IShoppingDeposit> {
    return ShoppingDepositProvider.at(id);
  }

  /**
   * Get a deposit metadata by its code.
   *
   * Get a {@link IShoppingDeposit deposit} metadata information with its code.
   *
   * @param id Target deposit's {@link IShoppingDeposit.code}
   * @returns Deposit metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get(":code/get")
  public async get(
    @ShoppingAdminAuth() _admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("code") code: string,
  ): Promise<IShoppingDeposit> {
    return ShoppingDepositProvider.get(code);
  }

  /**
   * Create a new deposit metadata.
   *
   * Create a new {@link IShoppingDeposit deposit} metadata.
   *
   * This action means that adding a new origin reason of deposit's income/outcome.
   * Of course, creating a new deposit record does not mean that automatically
   * increase or decrease the {@link IShoppingCustomer customer}'s balance
   * following the record's reason why. The logic must be developed manually
   * in the backend side.
   *
   * @param input Creation information of deposit metadata
   * @returns Newly created deposit metadata
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedBody() input: IShoppingDeposit.ICreate,
  ): Promise<IShoppingDeposit> {
    return ShoppingDepositProvider.create(admin)(input);
  }

  /**
   * Erase a deposit metadata.
   *
   * Erase a {@link IShoppingDeposit deposit} metadata, so that no more
   * {@link IShoppingCustomer customer}'s balance does not be increased or
   * decreased by the deposit's reason why.
   *
   * @param id Target deposit's {@link IShoppingDeposit.id}
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<void> {
    return ShoppingDepositProvider.erase(admin)(id);
  }
}
