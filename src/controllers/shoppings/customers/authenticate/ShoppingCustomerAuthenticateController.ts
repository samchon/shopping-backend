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
   * Refresh the authentication token.
   *
   * Create a new {@link IShoppingCustomer.IToken.access access token} of a
   * {@link IShoppingCustomer customer} with the pre-issued
   * {@link IShoppingCustomer.IToken.refresh refresh} token.
   *
   * Note that, this function is available until the
   * {@link IShoppingCustomer.IToken.refreshable_until} value.
   *
   * @param input Refresh token.
   * @returns Customer information with new token
   * @tag Authenticate
   *
   * @assignHeaders setHeaders
   * @author Samchon
   */
  @core.TypedRoute.Patch("refresh")
  public async refresh(
    @core.TypedBody() input: IShoppingCustomer.IRefresh,
  ): Promise<IShoppingCustomer.IAuthorized> {
    return ShoppingCustomerProvider.refresh(input.value);
  }

  /**
   * Get current customer info.
   *
   * Get current {@link IShoppingCustomer customer} information from the
   * {@link IShoppingCustomer.IToken.access access token}.
   *
   * @returns Current customer information
   * @tag Authenticate
   * @author Samchon
   */
  @core.TypedRoute.Get()
  public async get(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
  ): Promise<IShoppingCustomer> {
    return customer;
  }

  /**
   * Create a new customer record.
   *
   * This shopping mall system defines everyone participating in this market as
   * a "customer". And the customer records are not archived based on individual
   * {@link IShoppingCitizen people}, but based on the unit of connection.
   * Therefore, even if it is the same person, a new {@link IShoppingCustomer}
   * record is created every time a connection is made.
   *
   * Therefore, all Client Applications that access this service must first call
   * this function, report the customer's inflow path to the server, and create
   * an {@link IShoppingCustomer.IToken.access access token}. If you skip this
   * function call, all the other API functions would be prohibited. There is no
   * exception, even if you want to {@link activate} your citizenship or
   * {@link login} with your {@link IShoppingMember member account}. Before
   * authenticating yourself or logging in, be sure to call this function first.
   * This also applies when an {@link IShoppingAdministrator administrator} or
   * {@link IShoppingSeller seller} logs in.
   *
   * Also, the authentication token has an
   * {@link IShoppingCustomer.IToken.expired_at expiration time}
   * and cannot be used permanently. For reference, the authentication token is
   * valid for 3 hours, and if you want to maintain customer authentication even
   * after 3 hours, you must call the {@link refresh} function.
   *
   * @param input Creation information of the customer.
   * @returns Created customer information with token.
   * @tag Authenticate
   *
   * @assignHeaders setHeaders
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public async create(
    @Request() request: FastifyRequest,
    @core.TypedBody() input: IShoppingCustomer.ICreate,
  ): Promise<IShoppingCustomer.IAuthorized> {
    return ShoppingCustomerProvider.create(request)(input);
  }

  /**
   * Join membership.
   *
   * {@link IShoppingCustomer Customer} signs up for
   * {@link IShoppingMember membership} of current shopping mall system.
   *
   * If you've performed the {@link IShoppingCitizen citizenship}
   * {@link activate activation} too, then you can skip the {@link activate}
   * function calling everytime you log in from now on. Also, if the person had
   * {@link IShoppingOrder purchased} with {@link activate} and {@link external}
   * function calling, you can also access to the order history too. In other
   * words, activity details prior to membership registration can also be
   * accessed with continuity.
   *
   * For reference, as described in the {@link create} function, before calling
   * this `join` function, you must first create a customer record and token by
   * calling the {@link create} function.
   *
   * @param input Join information of the member
   * @returns Joined customer information
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Post("join")
  public async join(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.IJoin,
  ): Promise<IShoppingCustomer> {
    return ShoppingMemberProvider.join(customer)(input);
  }

  /**
   * Membership login.
   *
   * {@link IShoppingCustomer Customer} logs in with his/her
   * {@link IShoppingMember membership} account with the email and password.
   *
   * If the {@link IShoppingMember member} has previously performed
   * {@link activate citizenship activation}, the {@link IShoppingCustomer.citizen}
   * value would be filled in accordingly. And if the member has also signed up
   * as an {@link IShoppingAdministrator administrator} or
   * {@link IShoppingSeller seller}, the relevant information is also entered
   * accordingly.
   *
   * For reference, as described in the {@link create} function, before calling
   * this `login` function, you must first create a customer record and token by
   * calling the {@link create} function.
   *
   * @param customer
   * @param input
   * @returns
   */
  @core.TypedRoute.Put("login")
  public async login(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingMember.ILogin,
  ): Promise<IShoppingCustomer> {
    return ShoppingMemberProvider.login(customer)(input);
  }

  /**
   * Activate citizenship.
   *
   * {@link IShoppingCustomer Customer} activates his/her
   * {@link IShoppingCitizen citizenship} with mobile number and real name.
   *
   * If the custommer already {@link join joined} to the
   * {@link IShoppingMember membership}, then you can skip the citizenship
   * {@link activation} function calling everytime you log in from now on.
   * Of course, such story would be same to the {@link external} function, too.
   *
   * For reference, as described in the {@link create} function, before calling
   * this `activate` function, you must first create a customer record and token
   * by calling the {@link create} function.
   *
   * @param input Activation information of the citizenship
   * @returns Activated customer information
   * @tag Authenticate
   *
   * @author Samchon
   */
  @core.TypedRoute.Post("activate")
  public async activate(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @core.TypedBody() input: IShoppingCitizen.ICreate,
  ): Promise<IShoppingCustomer> {
    return ShoppingCustomerProvider.activate(customer)(input);
  }

  /**
   * Enroll external user info.
   *
   * {@link IShoppingCustomer Customer} enrolls his/her
   * {@link IShoppingExternalUser external user} information from other service.
   *
   * It has similar effect with the {@link join membership joining} function,
   * so that if you've performed the {@link IShoppingCitizen citizenship}
   * {@link activate activation} too, then you can skip the {@link activate}
   * function calling everytime you call this `external` function with same
   * info from now on. Also, if the person had
   * {@link IShoppingOrder purchased} with {@link activate} and {@link join}
   * function calling, you can also access to the order history too. In other
   * words, activity details prior to external server registration can also be
   * accessed with continuity.
   *
   * For reference, as described in the {@link create} function, before calling
   * this `external` function, you must first create a customer record and token
   * by calling the {@link create} function.
   *
   * @param input Enroll information of the external user
   * @returns External user enrolled customer information
   * @tag Authenticate
   *
   * @todo Must be shifted to the ShoppingCustomerProvider
   * @author Samchon
   */
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
