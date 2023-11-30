import core from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IShoppingCitizen } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCitizen";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("shoppings/customers/authenticate")
export class ShoppingCustomerAuthenticateController {
  @core.TypedRoute.Get()
  public async refresh(
    @core.TypedBody() input: IShoppingCustomer.IRefresh,
  ): Promise<IShoppingCustomer.IAuthorized> {
    input;
    return null!;
  }

  @core.TypedRoute.Post()
  public async create(
    @core.TypedBody() input: IShoppingCustomer.ICreate,
  ): Promise<IShoppingCustomer.IAuthorized> {
    input;
    return null!;
  }

  @core.TypedRoute.Post("join")
  public async join(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.IJoin,
  ): Promise<IShoppingCustomer> {
    customer;
    input;
    return null!;
  }

  @core.TypedRoute.Put("login")
  public async login(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.ILogin,
  ): Promise<IShoppingCustomer> {
    customer;
    input;
    return null!;
  }

  @core.TypedRoute.Post("activate")
  public async activate(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCitizen.ICreate,
  ): Promise<IShoppingCustomer> {
    customer;
    input;
    return null!;
  }
}
