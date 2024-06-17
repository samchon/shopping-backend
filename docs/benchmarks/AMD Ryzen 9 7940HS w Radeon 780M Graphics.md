## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 8,192
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 147,939 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 9,195 | 9,126 | 482.75 | 1,631.13 | 6 | 33,650

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PATCH /shoppings/customers/carts/:cartId/commodities/discountable | 25 | 25 | 22,239.24 | 3,579.58 | 17,787 | 33,650
PATCH /shoppings/customers/orders/:id/discountable | 30 | 27 | 17,911.7 | 7,324.55 | 2,715 | 30,154
PATCH /shoppings/customers/orders | 42 | 42 | 1,848.64 | 1,646.61 | 20 | 6,173
PATCH /shoppings/customers/sales | 8 | 8 | 1,706.25 | 685.08 | 598 | 2,808
PATCH /shoppings/customers/carts/:cartId/commodities | 139 | 139 | 1,412.84 | 1,649.02 | 29 | 6,105
PATCH /shoppings/admins/coupons | 25 | 25 | 1,304.76 | 1,202.58 | 52 | 3,781
DELETE /shoppings/admins/systematic/channels/:channelCode/categories/merge | 3 | 3 | 998.33 | 358.11 | 525 | 1,391
DELETE /shoppings/admins/systematic/channels/merge | 3 | 3 | 831.33 | 407.21 | 349 | 1,345
PUT /shoppings/customers/orders/:id/discount | 144 | 142 | 750.4 | 457.87 | 46 | 2,674
PATCH /shoppings/sellers/orders | 16 | 16 | 651.62 | 230.04 | 336 | 1,322
POST /shoppings/customers/orders | 410 | 404 | 570.73 | 373.64 | 43 | 2,355
POST /shoppings/customers/authenticate/join | 733 | 733 | 553.75 | 272.11 | 157 | 1,797
POST /shoppings/sellers/deliveries/:deliveryId/journeys | 57 | 57 | 544 | 190.82 | 174 | 1,110
POST /shoppings/customers/carts/:cartId/commodities | 665 | 645 | 539.31 | 264.5 | 43 | 1,418
DELETE /shoppings/sellers/deliveries/:deliveryId/journeys/:id | 3 | 3 | 539 | 84.92 | 436 | 644
PUT /shoppings/sellers/sales/:id | 12 | 12 | 527.33 | 196.58 | 308 | 1,045
POST /shoppings/customers/authenticate/external | 6 | 6 | 517.83 | 344.25 | 225 | 1,263
POST /shoppings/customers/deposits/charges/:chargeId/publish | 54 | 54 | 506.2 | 305.34 | 56 | 1,294
GET /shoppings/sellers/deliveries/:id | 3 | 3 | 481.33 | 76.84 | 410 | 588
POST /shoppings/sellers/sales | 761 | 761 | 472.77 | 221.54 | 40 | 1,279
POST /shoppings/customers/orders/:orderId/publish | 315 | 315 | 471.74 | 255.5 | 26 | 1,378
GET /shoppings/customers/orders/:id | 89 | 89 | 456.55 | 196.33 | 92 | 926
GET /shoppings/sellers/sales/:saleId/snapshots/:id/flip | 8 | 8 | 451.37 | 225.06 | 129 | 823
PUT /shoppings/customers/authenticate/password/change | 16 | 16 | 449.12 | 121.12 | 260 | 710
PUT /shoppings/sellers/deliveries/:deliveryId/journeys/:id/complete | 18 | 18 | 443.5 | 237.78 | 143 | 1,110
POST /shoppings/sellers/coupons | 48 | 48 | 434.56 | 291.71 | 49 | 1,452
POST /shoppings/admins/systematic/channels/:channelCode/categories | 88 | 88 | 401.82 | 218.75 | 93 | 1,230
GET /shoppings/customers/carts/:cartId/commodities/:id/replica | 1 | 1 | 379 | 0 | 379 | 379
POST /shoppings/sellers/deliveries | 143 | 143 | 370.22 | 208.22 | 27 | 1,179
POST /shoppings/customers/sales/:saleId/reviews | 148 | 140 | 354.12 | 211.58 | 31 | 979
PUT /shoppings/admins/authenticate/login | 194 | 192 | 328.34 | 197.25 | 123 | 1,141
POST /shoppings/admins/mileages/donations | 89 | 89 | 316.15 | 209.03 | 17 | 1,014
GET /shoppings/customers/carts/:cartId/commodities/:id | 2 | 2 | 305.5 | 101.5 | 204 | 407
PATCH /shoppings/admins/sales | 15 | 15 | 294.53 | 100.23 | 99 | 561
PUT /shoppings/sellers/authenticate/login | 36 | 29 | 291.75 | 102.11 | 137 | 606
PUT /shoppings/customers/authenticate/login | 6 | 5 | 282.16 | 106.16 | 138 | 449
PATCH /shoppings/sellers/systematic/channels/hierarchical | 773 | 773 | 276.61 | 161.95 | 10 | 1,183
PATCH /shoppings/customers/coupons | 5 | 5 | 274 | 151.81 | 69 | 506
GET /shoppings/admins/sales/:id | 18 | 18 | 269.77 | 145.68 | 97 | 758
POST /shoppings/customers/authenticate | 1,046 | 1,046 | 268.72 | 172.65 | 31 | 1,260
PUT /shoppings/admins/systematic/channels/:channelCode/categories/:id | 2 | 2 | 264 | 58 | 206 | 322
POST /shoppings/admins/coupons | 625 | 625 | 263.67 | 188.18 | 20 | 1,341
GET /shoppings/customers/sales/:id | 21 | 16 | 260.04 | 112.9 | 45 | 506
PUT /shoppings/customers/orders/:orderId/goods/:id/confirm | 85 | 85 | 256.58 | 178.75 | 15 | 708
GET /shoppings/sellers/sales/:id | 24 | 24 | 253.7 | 122.46 | 47 | 529
GET /shoppings/sellers/orders/:id | 13 | 11 | 252.38 | 122.09 | 98 | 557
POST /shoppings/customers/coupons/tickets | 9 | 7 | 244 | 160.11 | 98 | 587
PUT /shoppings/admins/systematic/channels/:id | 3 | 3 | 234.66 | 132.84 | 47 | 336
POST /shoppings/customers/sales/:saleId/reviews/:id | 20 | 20 | 232.2 | 148.85 | 45 | 658
PUT /shoppings/admins/systematic/sections/:id | 3 | 3 | 220 | 109.44 | 88 | 356
GET /shoppings/admins/orders/:id | 3 | 1 | 217.66 | 208.33 | 59 | 512
PATCH /shoppings/sellers/systematic/channels | 3 | 3 | 215.33 | 97.79 | 135 | 353
GET /shoppings/sellers/sales/:saleId/questions/:id | 2 | 2 | 212 | 44 | 168 | 256
DELETE /shoppings/sellers/sales/:id/pause | 8 | 8 | 211.25 | 192.81 | 47 | 605
PUT /shoppings/customers/sales/:saleId/questions/:inquiryId/comments/:id | 8 | 8 | 209.5 | 104 | 62 | 428
PATCH /shoppings/sellers/sales/:saleId/questions | 2 | 2 | 209.5 | 54.5 | 155 | 264
PATCH /shoppings/customers/sales/:saleId/questions | 33 | 33 | 207.21 | 127.15 | 59 | 606
POST /shoppings/sellers/sales/:saleId/reviews/:inquiryId/comments | 12 | 12 | 206.33 | 77.76 | 147 | 341
POST /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments | 16 | 16 | 206.06 | 91.92 | 51 | 333
POST /shoppings/sellers/sales/:saleId/questions/:inquiryId/comments | 17 | 17 | 205.35 | 111.63 | 53 | 425
POST /shoppings/customers/authenticate/activate | 12 | 12 | 205.08 | 119.8 | 71 | 569
DELETE /shoppings/admins/systematic/sections/merge | 38 | 38 | 203.28 | 145.82 | 13 | 553
POST /shoppings/customers/sales/:saleId/questions | 40 | 40 | 201.07 | 120.79 | 54 | 563
PATCH /shoppings/admins/systematic/channels/:channelCode/categories | 5 | 5 | 196.8 | 149.36 | 82 | 483
POST /shoppings/admins/sales/:saleId/questions/:inquiryId/comments | 17 | 17 | 195.64 | 132.29 | 53 | 473
PATCH /shoppings/customers/sales/:saleId/questions/:inquiryId/comments | 14 | 14 | 195.28 | 127.13 | 60 | 526
PATCH /shoppings/customers/sales/:saleId/reviews | 42 | 42 | 191.28 | 88.55 | 55 | 375
GET /shoppings/customers/deposits/histories/balance | 9 | 9 | 189.33 | 127.73 | 42 | 490
POST /shoppings/customers/sales/:saleId/questions/:inquiryId/comments | 19 | 19 | 185.63 | 112.18 | 57 | 413
PATCH /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments | 10 | 10 | 184.4 | 99.89 | 56 | 347
PUT /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments/:id | 16 | 16 | 181.18 | 113.3 | 47 | 425
DELETE /shoppings/sellers/sales/:id/suspend | 7 | 7 | 180.42 | 97.06 | 67 | 390
POST /shoppings/sellers/sales/:saleId/reviews/:reviewId/answer | 4 | 4 | 177.5 | 86.15 | 66 | 308
POST /shoppings/admins/sales/:saleId/reviews/:inquiryId/comments | 12 | 12 | 163.75 | 91.19 | 58 | 339
DELETE /shoppings/admins/coupons/:id | 3 | 3 | 159 | 84.96 | 53 | 261
GET /shoppings/admins/systematic/channels/:id | 7 | 7 | 156.71 | 82.16 | 48 | 277
PUT /shoppings/sellers/sales/:saleId/questions/:questionId/answer | 8 | 8 | 156.37 | 76.38 | 69 | 325
PATCH /shoppings/customers/systematic/sections | 2 | 2 | 156 | 9 | 147 | 165
POST /shoppings/sellers/sales/:saleId/questions/:questionId/answer | 6 | 6 | 145.66 | 22.11 | 116 | 171
GET /shoppings/customers/sales/:saleId/reviews/:id | 13 | 13 | 144.46 | 113.47 | 39 | 441
GET /shoppings/admins/systematic/sections/:id | 4 | 4 | 143.5 | 58.1 | 74 | 235
PATCH /shoppings/admins/systematic/channels | 26 | 26 | 140.84 | 82.12 | 47 | 343
GET /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments/:id | 4 | 4 | 138.75 | 76.17 | 32 | 247
GET /shoppings/admins/coupons/:id | 4 | 4 | 137.75 | 68.43 | 59 | 240
GET /shoppings/customers/coupons/tickets/:id | 3 | 3 | 132.33 | 59.45 | 52 | 194
POST /shoppings/sellers/authenticate | 507 | 507 | 128.4 | 100.58 | 21 | 594
POST /shoppings/admins/systematic/channels | 181 | 181 | 122.95 | 103.36 | 21 | 624
PATCH /shoppings/admins/systematic/sections | 10 | 10 | 120.5 | 77.31 | 40 | 316
GET /shoppings/customers/orders/:id/price | 312 | 312 | 119.94 | 87.87 | 10 | 460
GET /shoppings/customers/sales/:saleId/questions/:id | 13 | 11 | 115.38 | 81.45 | 38 | 334
GET /shoppings/customers/mileages/histories/balance | 9 | 9 | 112.66 | 63.55 | 21 | 234
POST /shoppings/admins/systematic/sections | 107 | 107 | 108.14 | 89.75 | 20 | 494
GET /shoppings/customers/coupons/:id | 7 | 0 | 107.28 | 40.76 | 51 | 157
POST /shoppings/customers/deposits/charges | 57 | 57 | 105.68 | 84.89 | 15 | 347
POST /shoppings/sellers/deliveries/:deliveryId/shippers | 16 | 16 | 105 | 59.84 | 37 | 230
PATCH /shoppings/customers/mileages/histories | 87 | 87 | 104.98 | 108.5 | 9 | 466
PATCH /shoppings/customers/authenticate/refresh | 3 | 3 | 103.33 | 95.39 | 29 | 238
PATCH /shoppings/customers/deposits/histories | 56 | 56 | 100.32 | 97.93 | 11 | 421
DELETE /shoppings/admins/coupons/:id/destroy | 243 | 243 | 97.17 | 93.77 | 6 | 496
PATCH /shoppings/sellers/deliveries/incompletes | 131 | 131 | 95.44 | 83.79 | 8 | 509
GET /shoppings/admins/mileages/:code/get | 14 | 14 | 87.92 | 67.81 | 22 | 220
POST /shoppings/sellers/sales/:id/replica | 1 | 1 | 69 | 0 | 69 | 69
GET /shoppings/admins/sales/:saleId/questions/:id | 2 | 2 | 67.5 | 12.5 | 55 | 80
PATCH /shoppings/admins/sales/:saleId/questions | 2 | 2 | 54 | 3 | 51 | 57
GET /shoppings/customers/sales/:saleId/questions/:inquiryId/comments/:id | 2 | 2 | 49.5 | 10.5 | 39 | 60
GET /monitors/system | 1 | 1 | 19 | 0 | 19 | 19
GET /monitors/health | 3 | 3 | 16.66 | 5.55 | 9 | 22

### Failures
Method | Path | Count | Success
-------|------|-------|--------
POST | /shoppings/customers/carts/:cartId/commodities | 665 | 645
POST | /shoppings/customers/orders | 410 | 404
PUT | /shoppings/admins/authenticate/login | 194 | 192
POST | /shoppings/customers/sales/:saleId/reviews | 148 | 140
PUT | /shoppings/customers/orders/:id/discount | 144 | 142
PUT | /shoppings/sellers/authenticate/login | 36 | 29
PATCH | /shoppings/customers/orders/:id/discountable | 30 | 27
GET | /shoppings/customers/sales/:id | 21 | 16
GET | /shoppings/sellers/orders/:id | 13 | 11
GET | /shoppings/customers/sales/:saleId/questions/:id | 13 | 11
POST | /shoppings/customers/coupons/tickets | 9 | 7
GET | /shoppings/customers/coupons/:id | 7 | 0
PUT | /shoppings/customers/authenticate/login | 6 | 5
GET | /shoppings/admins/orders/:id | 3 | 1