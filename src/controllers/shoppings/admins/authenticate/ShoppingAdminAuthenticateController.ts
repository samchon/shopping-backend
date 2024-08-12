import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingAdministratorProvider } from "../../../../providers/shoppings/actors/ShoppingAdministratorProvider";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("shoppings/admins/authenticate")
export class ShoppingAdminAuthenticateController {
  /**
   * Get administrator information.
   *
   * Get {@link IShoppingAdministrator.IInvert administrator} information of
   * current {@link IShoppingCustomer customer}.
   *
   * If current {@link IShoppingMember member} is not an administrator,
   * it throws 403 forbidden exception.
   *
   * @returns Admin info
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Get()
  public async get(
    @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert
  ): Promise<IShoppingAdministrator.IInvert> {
    return admin;
  }

  /**
   * Join as an administrator.
   *
   * Join as an administrator with {@link IShoppingAdministrator.IJoin joining info}.
   *
   * This method is allowed only when the {@link IShoppingCustomer customer} already
   * has joined the {@link IShoppingMember membership}. IF not, he (she) must
   * accomplish it before. If not, 403 forbidden exception would be thrown.
   *
   * @param input Joining request info
   * @returns Administrator info
   * @tag Authenticate
   *
   * @todo Need to add approval process
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async join(
    @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingAdministrator.IJoin
  ): Promise<IShoppingAdministrator.IInvert> {
    return ShoppingAdministratorProvider.join(customer)(input);
  }

  /**
   * Login as an administrator.
   *
   * Login as an administrator with {@link IShoppingAdministrator.ILogin login info}.
   *
   * This method has exactly same effect with
   * {@link ShoppingApi.functional.customers.authenticate.login} function, but
   * returned type is a llttle different. The similar function returns
   * {@link IShoppingCustomer} type that starting from the customer information, so
   * that you have to access to the administrator info through
   * `customer.member.administrator`. In contrast with that, this method returns
   * {@link IShoppingAdministrator.IInvert} type that starting from the administrator
   * info, so that can access to the customer info through `administrator.customer`.
   *
   * Of course, to use this function, you had to {@link join} as an administrator
   * before. If not, 403 forbidden exception would be thrown,
   *
   * @param input Login request info
   * @returns Administrator info
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Put("login")
  public async login(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.ILogin
  ): Promise<IShoppingAdministrator.IInvert> {
    return ShoppingAdministratorProvider.login(customer)(input);
  }
}
