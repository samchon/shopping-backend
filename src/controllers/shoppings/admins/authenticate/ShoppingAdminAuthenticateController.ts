import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IShoppingAdministrator } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingAdministrator";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMember } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingMember";

import { ShoppingAdminAuth } from "../../../../decorators/ShoppingAdminAuth";
import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller("shoppings/admins/authenticate")
export class ShoppingAdminAuthenticateController {
    @core.TypedRoute.Get()
    public async get(
        @ShoppingAdminAuth() admin: IShoppingAdministrator.IInvert,
    ): Promise<IShoppingAdministrator.IInvert> {
        return admin;
    }

    @core.TypedRoute.Post()
    public async join(
        @ShoppingCustomerAuth("member") customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingAdministrator.IJoin,
    ): Promise<IShoppingAdministrator.IInvert> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Put("login")
    public async login(
        @ShoppingCustomerAuth() customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingMember.ILogin,
    ): Promise<IShoppingAdministrator.IInvert> {
        customer;
        input;
        return null!;
    }
}
