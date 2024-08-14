import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingCustomer } from "@samchon/shopping-api/lib/structures/shoppings/actors/IShoppingCustomer";
import { IShoppingMileageDonation } from "@samchon/shopping-api/lib/structures/shoppings/mileages/IShoppingMileageDonation";
import { IShoppingCartCommodity } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingCartCommodity";
import { IShoppingOrder } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrder";
import { IShoppingOrderGood } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderGood";
import { IShoppingSale } from "@samchon/shopping-api/lib/structures/shoppings/sales/IShoppingSale";
import { IShoppingSaleReview } from "@samchon/shopping-api/lib/structures/shoppings/sales/inquiries/IShoppingSaleReview";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_attachment_file } from "../../../common/internal/prepare_random_attachment_file";
import { generate_random_cart_commodity } from "../../carts/internal/generate_random_cart_commodity";
import { generate_random_order } from "../../orders/internal/generate_random_order";
import { generate_random_order_publish } from "../../orders/internal/generate_random_order_publish";
import { generate_random_sale } from "../../sales/internal/generate_random_sale";
import { generate_random_sale_review } from "../../sales/internal/generate_random_sale_review";
import { generate_random_mileage_donation } from "./generate_random_mileage_donation";

export const generate_random_mileage_histories = async (
  pool: ConnectionPool,
  customer: IShoppingCustomer,
): Promise<generate_random_mileage_histories.IOutput> => {
  const sale: IShoppingSale = await generate_random_sale(pool);
  const commodity: IShoppingCartCommodity =
    await generate_random_cart_commodity(pool, sale);
  const order: IShoppingOrder = await generate_random_order(pool, [commodity]);

  const donation: IShoppingMileageDonation =
    await generate_random_mileage_donation(pool, customer.citizen!, {
      value: 1_000,
    });

  order.price =
    await ShoppingApi.functional.shoppings.customers.orders.discount(
      pool.customer,
      order.id,
      {
        mileage: donation.value,
        deposit: 0,
        coupon_ids: [],
      },
    );
  order.publish = await generate_random_order_publish(
    pool,
    customer,
    order,
    true,
  );

  await ShoppingApi.functional.shoppings.sellers.deliveries.create(
    pool.seller,
    {
      pieces:
        await ShoppingApi.functional.shoppings.sellers.deliveries.incompletes(
          pool.seller,
          {
            publish_ids: [order.publish.id],
          },
        ),
      shippers: [],
      journeys: (
        ["preparing", "manufacturing", "shipping", "delivering"] as const
      ).map((type) => ({
        type,
        title: null,
        description: null,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })),
    },
  );

  const good: IShoppingOrderGood = order.goods[0];
  await ShoppingApi.functional.shoppings.customers.orders.goods.confirm(
    pool.customer,
    order.id,
    good.id,
  );

  const review: IShoppingSaleReview = await generate_random_sale_review(
    pool,
    sale,
    good,
    {
      files: [prepare_random_attachment_file({ extension: "jpg" })],
    },
  );

  return {
    donation,
    order,
    good,
    review,
  };
};
export namespace generate_random_mileage_histories {
  export interface IOutput {
    donation: IShoppingMileageDonation;
    order: IShoppingOrder;
    good: IShoppingOrderGood;
    review: IShoppingSaleReview;
  }
}
