# SDK for Client Developers
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/shopping-backend/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@samchon/shopping-api.svg)](https://www.npmjs.com/package/@samchon/shopping-api)
[![Build Status](https://github.com/samchon/shopping-backend/workflows/build/badge.svg)](https://github.com/samchon/shopping-backend/actions?query=workflow%3Abuild)
[![Guide Documents](https://img.shields.io/badge/guide-documents-forestgreen)](https://nestia.io/docs/)

[`samchon/shopping-backend`](https://github.com/samchon/shopping-backend) provides SDK (Software Development Kit) for convenience.

For the client developers who are connecting to this backend server, [`samchon/shopping-backend`](https://github.com/samchon/shopping-backend) provides not API documents like the Swagger, but provides the API interaction library, one of the typical SDK (Software Development Kit) for the convenience.

With the SDK, client developers never need to re-define the duplicated API interfaces. Just utilize the provided interfaces and asynchronous functions defined in the SDK. It would be much convenient than any other Rest API solutions.

![nestia-sdk-demo](https://user-images.githubusercontent.com/13158709/215004990-368c589d-7101-404e-b81b-fbc936382f05.gif)



## Setup
```bash
npm install --save samchon/shopping-api
```




## Usage
Import the `samchon/shopping-api` and enjoy the auto-completion.

```typescript
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import ShoppingApi from "@samchon/shopping-api/lib/index";
import { IShoppingOrderDiscountable } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderDiscountable";
import { IShoppingOrderPrice } from "@samchon/shopping-api/lib/structures/shoppings/orders/IShoppingOrderPrice";

import { validate_api_shopping_order_discountable } from "./internal/validate_api_shopping_order_discountable";

export const test_api_shopping_order_discountable_after_discount =
  validate_api_shopping_order_discountable(async (pool, props) => {
    const price: IShoppingOrderPrice =
      await ShoppingApi.functional.shoppings.customers.orders.discount(
        pool.customer,
        props.order.id,
        {
          deposit: 0,
          mileage: 0,
          coupon_ids: props.discountable.combinations[0].coupons.map(
            (coupon) => coupon.id,
          ),
        },
      );
    typia.assertEquals(price);

    const discountable: IShoppingOrderDiscountable =
      await ShoppingApi.functional.shoppings.customers.orders.discountable(
        pool.customer,
        props.order.id,
        {
          good_ids: props.order.goods.map((good) => good.id),
        },
      );
    typia.assertEquals(discountable);

    TestValidator.equals("discountable.combinations[].amount")(
      props.discountable.combinations[0].amount,
    )(discountable.combinations[0].amount);
    TestValidator.equals("discountable.combinations[0].coupons")(
      props.discountable.combinations[0].tickets
        .map((t) => t.coupon)
        .sort((a, b) => a.id.localeCompare(b.id)),
    )(
      discountable.combinations[0].coupons.sort((a, b) =>
        a.id.localeCompare(b.id),
      ),
    );
  });
```