## Benchmark Report
> - CPU: AMD Ryzen 9 7940HS w/ Radeon 780M Graphics     
> - RAM: 31 GB
> - NodeJS Version: v20.10.0
> - Backend Server: 1 core / 1 thread
> - Arguments: 
>   - Count: 8,192
>   - Threads: 4
>   - Simultaneous: 32
> - Total Elapsed Time: 141,016 ms

### Total
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
Total | 8,630 | 8,615 | 465.11 | 3,637.36 | 2 | 66,548

### Endpoints
Type | Count | Success | Mean. | Stdev. | Minimum | Maximum
----|----|----|----|----|----|----
PATCH /shoppings/customers/carts/:cartId/commodities/discountable | 23 | 22 | 44,741.78 | 20,667.29 | 3,980 | 66,548
PATCH /shoppings/customers/orders/:id/discountable | 27 | 25 | 43,230.92 | 18,129.25 | 3,715 | 65,206
PATCH /shoppings/customers/orders | 24 | 24 | 1,441.33 | 319.77 | 1,086 | 2,066
PATCH /shoppings/customers/carts/:cartId/commodities | 64 | 64 | 1,135.85 | 713.1 | 66 | 2,426
PATCH /shoppings/admins/coupons | 31 | 31 | 771.16 | 675.74 | 42 | 2,411
DELETE /shoppings/admins/systematic/channels/merge | 3 | 3 | 746 | 198.07 | 474 | 940
DELETE /shoppings/admins/systematic/channels/:channelCode/categories/merge | 2 | 2 | 712.5 | 92.5 | 620 | 805
PUT /shoppings/customers/orders/:id/discount | 145 | 145 | 510.69 | 271.52 | 32 | 1,409
PUT /shoppings/sellers/sales/:id | 7 | 7 | 428.28 | 262.03 | 162 | 864
DELETE /shoppings/sellers/deliveries/:deliveryId/journeys/:id | 4 | 4 | 403 | 224.39 | 113 | 717
POST /shoppings/customers/deposits/charges/:chargeId/publish | 67 | 67 | 382.59 | 265.18 | 110 | 1,749
POST /shoppings/customers/authenticate/join | 654 | 654 | 350.77 | 308.79 | 107 | 1,796
POST /shoppings/admins/systematic/channels/:channelCode/categories | 54 | 54 | 318.92 | 149.09 | 108 | 669
PUT /shoppings/customers/authenticate/password/change | 14 | 14 | 311.71 | 93.66 | 184 | 476
POST /shoppings/customers/carts/:cartId/commodities | 617 | 617 | 310.87 | 174.3 | 27 | 1,170
POST /shoppings/customers/orders | 390 | 390 | 296.99 | 174.1 | 32 | 1,217
PATCH /shoppings/sellers/orders | 4 | 4 | 290 | 44.43 | 234 | 347
POST /shoppings/sellers/deliveries/:deliveryId/journeys | 6 | 6 | 280.5 | 164.14 | 102 | 496
PATCH /shoppings/customers/sales | 78 | 78 | 279.56 | 211.48 | 26 | 916
POST /shoppings/sellers/sales | 714 | 714 | 269.08 | 156.76 | 64 | 1,115
PUT /shoppings/admins/systematic/sections/:id | 5 | 5 | 268.8 | 259.04 | 72 | 782
POST /shoppings/customers/orders/:orderId/publish | 287 | 287 | 249.69 | 130.51 | 42 | 843
POST /shoppings/sellers/deliveries | 111 | 111 | 242.43 | 116.06 | 90 | 582
GET /shoppings/customers/carts/:cartId/commodities/:id/replica | 6 | 6 | 237.33 | 236.57 | 43 | 739
PATCH /shoppings/customers/coupons | 4 | 4 | 230.5 | 215.09 | 64 | 600
PATCH /shoppings/admins/sales | 16 | 16 | 229.81 | 107.9 | 67 | 445
GET /shoppings/sellers/sales/:saleId/snapshots/:id/flip | 8 | 8 | 226.62 | 186.25 | 57 | 569
PUT /shoppings/admins/authenticate/login | 190 | 189 | 218.33 | 174.97 | 82 | 920
POST /shoppings/customers/sales/:saleId/reviews | 181 | 181 | 215.73 | 138.43 | 33 | 965
PUT /shoppings/sellers/authenticate/login | 12 | 12 | 212.41 | 89.89 | 97 | 361
POST /shoppings/admins/mileages/donations | 79 | 79 | 205.4 | 130.36 | 52 | 826
POST /shoppings/sellers/coupons | 24 | 24 | 203.75 | 166.83 | 39 | 893
PUT /shoppings/customers/orders/:orderId/goods/:id/confirm | 73 | 73 | 203.73 | 165.16 | 69 | 956
PUT /shoppings/sellers/sales/:saleId/reviews/:reviewId/answer | 4 | 4 | 202 | 64.2 | 121 | 278
GET /shoppings/customers/orders/:id | 8 | 8 | 200.87 | 143.03 | 40 | 474
PATCH /shoppings/admins/systematic/channels/:channelCode/categories | 2 | 2 | 198 | 110 | 88 | 308
GET /shoppings/sellers/orders/:id | 17 | 17 | 191.7 | 122.21 | 22 | 381
GET /shoppings/customers/carts/:cartId/commodities/:id | 4 | 4 | 185.5 | 80.65 | 50 | 256
POST /shoppings/customers/authenticate/activate | 11 | 11 | 181.27 | 260.95 | 41 | 977
PUT /shoppings/customers/authenticate/login | 14 | 14 | 180.78 | 98.88 | 85 | 419
GET /shoppings/admins/systematic/channels/:id | 2 | 2 | 180.5 | 103.5 | 77 | 284
GET /shoppings/sellers/sales/:id | 28 | 28 | 174.6 | 84.35 | 37 | 347
POST /shoppings/sellers/sales/:saleId/questions/:inquiryId/comments | 25 | 25 | 167.96 | 97.06 | 42 | 444
PUT /shoppings/customers/sales/:saleId/questions/:inquiryId/comments/:id | 12 | 12 | 167.41 | 97.29 | 44 | 309
POST /shoppings/customers/authenticate | 953 | 953 | 167.04 | 179.32 | 23 | 1,243
GET /shoppings/admins/sales/:id | 18 | 18 | 166.94 | 87.91 | 51 | 373
GET /shoppings/admins/coupons/:id | 3 | 3 | 166 | 100.91 | 36 | 282
POST /shoppings/sellers/sales/:id/replica | 2 | 2 | 165.5 | 101.5 | 64 | 267
PATCH /shoppings/sellers/systematic/channels/hierarchical | 721 | 721 | 165.36 | 145.47 | 29 | 996
PUT /shoppings/sellers/sales/:saleId/questions/:questionId/answer | 8 | 8 | 163.5 | 70.19 | 53 | 269
POST /shoppings/sellers/sales/:saleId/units/:unitId/stocks/:stockId/supplements | 8 | 8 | 163.5 | 66.14 | 57 | 247
GET /shoppings/customers/sales/:id | 22 | 14 | 158.9 | 97.11 | 15 | 411
POST /shoppings/sellers/sales/:saleId/questions/:questionId/answer | 2 | 2 | 153.5 | 111.5 | 42 | 265
POST /shoppings/admins/coupons | 649 | 649 | 152.82 | 118.63 | 27 | 707
POST /shoppings/customers/authenticate/external | 6 | 6 | 147 | 76.47 | 83 | 304
GET /shoppings/sellers/deliveries/:id | 5 | 5 | 138.6 | 78.33 | 74 | 271
POST /shoppings/sellers/deliveries/:deliveryId/shippers | 20 | 20 | 136.4 | 87.38 | 26 | 383
POST /shoppings/customers/coupons/tickets | 17 | 16 | 136.29 | 74.86 | 50 | 343
POST /shoppings/admins/sales/:saleId/questions/:inquiryId/comments | 25 | 25 | 134.96 | 114.65 | 37 | 602
GET /shoppings/admins/orders/:id | 6 | 6 | 131.83 | 110.26 | 32 | 317
PATCH /shoppings/sellers/sales/:saleId/questions | 4 | 4 | 131.5 | 121.8 | 35 | 336
POST /shoppings/sellers/sales/:saleId/reviews/:reviewId/answer | 5 | 5 | 130.19 | 81.72 | 56 | 285
PATCH /shoppings/admins/systematic/sections | 20 | 20 | 127.05 | 84.41 | 42 | 354
PUT /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments/:id | 12 | 12 | 122.33 | 75.16 | 34 | 227
GET /shoppings/customers/deposits/histories/balance | 13 | 13 | 120.76 | 153.37 | 26 | 583
POST /shoppings/customers/sales/:saleId/questions/:inquiryId/comments | 28 | 28 | 115.53 | 88.8 | 39 | 482
POST /shoppings/customers/sales/:saleId/reviews/:id | 8 | 8 | 110.87 | 83.23 | 39 | 250
PUT /shoppings/sellers/deliveries/:deliveryId/journeys/:id/complete | 4 | 4 | 109.75 | 67.18 | 32 | 217
POST /shoppings/admins/sales/:saleId/reviews/:inquiryId/comments | 27 | 27 | 108.07 | 63.46 | 29 | 298
POST /shoppings/sellers/sales/:saleId/reviews/:inquiryId/comments | 27 | 27 | 105.96 | 70.93 | 38 | 289
PATCH /shoppings/customers/sales/:saleId/questions/:inquiryId/comments | 21 | 21 | 105.61 | 57.59 | 37 | 253
POST /shoppings/customers/sales/:saleId/questions | 42 | 42 | 100.5 | 50.51 | 35 | 209
PUT /shoppings/admins/systematic/channels/:id | 1 | 1 | 99 | 0 | 99 | 99
GET /shoppings/sellers/sales/:saleId/questions/:id | 4 | 4 | 98 | 106.84 | 32 | 283
PATCH /shoppings/sellers/sales/:saleId/units/:unitId/stocks/:stockId/supplements | 2 | 2 | 95.5 | 47.5 | 48 | 143
POST /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments | 30 | 30 | 95.36 | 64.89 | 29 | 276
PATCH /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments | 24 | 24 | 94.12 | 55.48 | 39 | 235
PATCH /shoppings/customers/sales/:saleId/reviews | 89 | 89 | 93.55 | 51.1 | 35 | 295
DELETE /shoppings/sellers/sales/:id/pause | 10 | 10 | 93.5 | 64.68 | 29 | 243
POST /shoppings/customers/deposits/charges | 72 | 72 | 92.94 | 97.93 | 25 | 593
PATCH /shoppings/sellers/systematic/channels | 3 | 3 | 91.66 | 42.75 | 58 | 152
PATCH /shoppings/admins/systematic/channels | 24 | 24 | 90.62 | 51.21 | 26 | 229
GET /shoppings/admins/systematic/sections/:id | 8 | 8 | 90.37 | 72.09 | 26 | 244
POST /shoppings/admins/systematic/sections | 181 | 181 | 83.08 | 79.94 | 15 | 489
GET /shoppings/customers/sales/:saleId/reviews/:id | 11 | 11 | 82.09 | 54.52 | 29 | 224
GET /shoppings/customers/sales/:saleId/questions/:inquiryId/comments/:id | 3 | 3 | 80.33 | 44.09 | 26 | 134
GET /shoppings/customers/coupons/:id | 3 | 1 | 79.66 | 39.22 | 28 | 123
PATCH /shoppings/customers/deposits/histories | 43 | 43 | 79.3 | 49.87 | 29 | 222
PATCH /shoppings/customers/sales/:saleId/questions | 29 | 29 | 74.75 | 46.27 | 33 | 253
POST /shoppings/sellers/authenticate | 424 | 424 | 73.51 | 71.99 | 16 | 535
PATCH /shoppings/sellers/deliveries/incompletes | 114 | 114 | 72.04 | 59.66 | 21 | 335
POST /shoppings/admins/systematic/channels | 147 | 147 | 66.92 | 68.86 | 16 | 611
GET /shoppings/customers/orders/:id/price | 285 | 285 | 65.3 | 45.59 | 15 | 278
GET /shoppings/customers/sales/:saleId/questions/:id | 12 | 12 | 63.25 | 41.75 | 25 | 163
GET /shoppings/admins/mileages/:code/get | 7 | 7 | 62.71 | 27.82 | 27 | 97
PATCH /shoppings/customers/mileages/histories | 65 | 65 | 62.3 | 55.88 | 19 | 339
GET /shoppings/customers/sales/:saleId/reviews/:inquiryId/comments/:id | 3 | 3 | 60 | 36.24 | 30 | 111
DELETE /shoppings/admins/systematic/sections/merge | 37 | 37 | 56.78 | 51.48 | 7 | 207
PATCH /shoppings/admins/sales/:saleId/questions | 4 | 4 | 54.5 | 13.21 | 45 | 77
GET /shoppings/admins/sales/:saleId/questions/:id | 4 | 4 | 53 | 25.41 | 27 | 91
DELETE /shoppings/sellers/sales/:id/suspend | 4 | 4 | 53 | 26.18 | 33 | 98
PATCH /shoppings/customers/systematic/sections | 1 | 1 | 46 | 0 | 46 | 46
GET /shoppings/customers/mileages/histories/balance | 10 | 10 | 33.29 | 21.17 | 18 | 95
DELETE /shoppings/admins/coupons/:id/destroy | 236 | 236 | 33.16 | 36.89 | 4 | 255
PATCH /shoppings/customers/authenticate/refresh | 3 | 3 | 19.66 | 3.85 | 16 | 25
GET /monitors/health | 7 | 7 | 11.85 | 4.79 | 2 | 17
GET /monitors/system | 3 | 3 | 8.33 | 1.69 | 6 | 10

### Failures
Method | Path | Count | Success
-------|------|-------|--------
PUT | /shoppings/admins/authenticate/login | 190 | 189
PATCH | /shoppings/customers/orders/:id/discountable | 27 | 25
PATCH | /shoppings/customers/carts/:cartId/commodities/discountable | 23 | 22
GET | /shoppings/customers/sales/:id | 22 | 14
POST | /shoppings/customers/coupons/tickets | 17 | 16
GET | /shoppings/customers/coupons/:id | 3 | 1