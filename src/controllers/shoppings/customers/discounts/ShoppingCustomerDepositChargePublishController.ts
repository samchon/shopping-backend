import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";

import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingDepositChargePublish } from "@samchon/shopping-api/lib/structures/shoppings/deposits/IShoppingDepositChargePublish";

import { ShoppingDepositChargePublishProvider } from "../../../../providers/shoppings/deposits/ShoppingDepositChargePublishProvider";

import { ShoppingCustomerAuth } from "../../../../decorators/ShoppingCustomerAuth";

@Controller(`shoppings/customers/deposits/charges/:chargeId/publish`)
export class ShoppingCustomerDepositChargePublishController {
  /**
   * Check publishable.
   *
   * Test whether the {@link IShoppingDepositCharge charge} is publishable or not.
   *
   * If the charge has not been {@link IShoppingDepositChargePublish published} and
   * not deleted yet, then it is possible to publish the charge
   *
   * @param chargeId Target charge's {@link IShoppingDepositCharge.id}
   * @returns Whether the charge is publishable or not
   * @tag Discount
   *
   * @author Samchon
   */
  @core.TypedRoute.Get("able")
  public async able(
    @ShoppingCustomerAuth("citizen") customer: IShoppingCustomer,
    @core.TypedParam("chargeId") chargeId: string & tags.Format<"uuid">,
  ): Promise<boolean> {
    return ShoppingDepositChargePublishProvider.able(customer)({
      id: chargeId,
    });
  }

  /**
   * Publish a charge.
   *
   * {@link IShoppingDepositChargePublish Publish} a
   * {@link IShoppingDepositCharge charge} that has been applied by the
   * {@link IShoppingCustomer} with payment information gotten from the
   * payment vendor system.
   *
   * Also, the payment time can be different with the publish time. For example,
   * if the payment method is manual bank account transfer, then the payment
   * would be delayed until the customer actually transfer the money. In that
   * case, {@link IShoppingDepositChargePublish.paid_at} would be `null` value,
   * so that you have to check it after calling this publish function.
   *
   * @param chargeId Target charge's {@link IShoppingDepositCharge.id}
   * @param input Creation info of the publish
   * @returns Newly created publish
   * @tag Discount
   *
   * @author Samchon
   */
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
