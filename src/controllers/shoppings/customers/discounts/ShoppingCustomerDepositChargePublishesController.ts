import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ShoppingDepositChargePublishProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositChargePublishProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges/:chargeId/publish`)
export class ShoppingCustomerDepositChargePublishesController {
  public async able(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
  ): Promise<boolean> {
    return ShoppingDepositChargePublishProvider.able(customer)({
      id: chargeId,
    });
  }

  @core.TypedRoute.Post()
  public async create(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IShoppingDepositChargePublish.ICreate,
  ): Promise<IShoppingDepositChargePublish> {
    return ShoppingDepositChargePublishProvider.create(customer)({
      id: chargeId,
    })(input);
  }
}
