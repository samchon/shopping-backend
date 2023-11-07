import nest from "@modules/nestjs";
import core from "@nestia/core";
import { tags } from "typia";

import { IPage } from "samchon/shopping-api/lib/structures/common/IPage";
import { IShoppingCustomer } from "samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositHistory } from "samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositHistory";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@nest.Controller(`shoppings/customers/deposits/histories`)
export class ShoppingCustomerDepositHistoriesController {
    @core.TypedRoute.Patch()
    public async index(
        @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
        @core.TypedBody() input: IShoppingDepositHistory.IRequest,
    ): Promise<IPage<IShoppingDepositHistory>> {
        customer;
        input;
        return null!;
    }

    @core.TypedRoute.Get(":id")
    public async at(
        @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
        @core.TypedParam("id") id: string & tags.Format<"uuid">,
    ): Promise<IShoppingDepositHistory> {
        customer;
        id;
        return null!;
    }
}
