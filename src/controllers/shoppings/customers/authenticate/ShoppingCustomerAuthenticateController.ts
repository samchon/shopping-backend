import core from "@nestia/core";
import { Controller, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingExternalUser } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingExternalUser";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingCustomerProvider } from "../../../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingExternalUserProvider } from "../../../../providers/shoppings/actors/ShoppingExternalUserProvider";
import { ShoppingMemberProvider } from "../../../../providers/shoppings/actors/ShoppingMemberProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("shoppings/customers/authenticate")
export class ShoppingCustomerAuthenticateController {
  /**
   *
   * @param input
   * @returns
   * @assignHeaders setHeaders
   */
  @core.TypedRoute.Patch("refresh")
  public async refresh(
    @core.TypedBody() input: IShoppingCustomer.IRefresh,
  ): Promise<IShoppingCustomer.IAuthorized> {
    return ShoppingCustomerProvider.refresh(input.value);
  }

  @core.TypedRoute.Get()
  public async get(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
  ): Promise<IShoppingCustomer> {
    return customer;
  }

  /**
   *
   * @param request
   * @param input
   * @returns
   * @assignHeaders setHeaders
   */
  @core.TypedRoute.Post()
  public async create(
    @Request() request: FastifyRequest,
    @core.TypedBody() input: IShoppingCustomer.ICreate,
  ): Promise<IShoppingCustomer.IAuthorized> {
    return ShoppingCustomerProvider.create(request)(input);
  }

  @core.TypedRoute.Post("join")
  public async join(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.IJoin,
  ): Promise<IShoppingCustomer> {
    return ShoppingMemberProvider.join(customer)(input);
  }

  @core.TypedRoute.Put("login")
  public async login(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.ILogin,
  ): Promise<IShoppingCustomer> {
    return ShoppingMemberProvider.login(customer)(input);
  }

  @core.TypedRoute.Post("activate")
  public async activate(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCitizen.ICreate,
  ): Promise<IShoppingCustomer> {
    return ShoppingCustomerProvider.activate(customer)(input);
  }

  /// @todo -> Must be shifted to the ShoppingCustomerProvider
  @core.TypedRoute.Post("external")
  public async external(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingExternalUser.ICreate,
  ): Promise<IShoppingCustomer> {
    const external_user = await ShoppingExternalUserProvider.create({
      customer,
      channel: customer.channel,
    })(input);
    return {
      ...customer,
      citizen: customer.citizen ?? external_user.citizen,
      external_user,
    };
  }
}
