"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_mileage_histories = void 0;
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const prepare_random_attachment_file_1 = require("../../../common/internal/prepare_random_attachment_file");
const generate_random_cart_commodity_1 = require("../../carts/internal/generate_random_cart_commodity");
const generate_random_order_1 = require("../../orders/internal/generate_random_order");
const generate_random_order_publish_1 = require("../../orders/internal/generate_random_order_publish");
const generate_random_sale_1 = require("../../sales/internal/generate_random_sale");
const generate_random_sale_review_1 = require("../../sales/internal/generate_random_sale_review");
const generate_random_mileage_donation_1 = require("./generate_random_mileage_donation");
const generate_random_mileage_histories = async (pool, customer) => {
    const sale = await (0, generate_random_sale_1.generate_random_sale)(pool);
    const commodity = await (0, generate_random_cart_commodity_1.generate_random_cart_commodity)(pool, sale);
    const order = await (0, generate_random_order_1.generate_random_order)(pool, [commodity]);
    const donation = await (0, generate_random_mileage_donation_1.generate_random_mileage_donation)(pool, customer.citizen, {
        value: 1_000,
    });
    order.price =
        await index_1.default.functional.shoppings.customers.orders.discount(pool.customer, order.id, {
            mileage: donation.value,
            deposit: 0,
            coupon_ids: [],
        });
    order.publish = await (0, generate_random_order_publish_1.generate_random_order_publish)(pool, customer, order, true);
    await index_1.default.functional.shoppings.sellers.deliveries.create(pool.seller, {
        pieces: await index_1.default.functional.shoppings.sellers.deliveries.incompletes(pool.seller, {
            publish_ids: [order.publish.id],
        }),
        shippers: [],
        journeys: ["preparing", "manufacturing", "shipping", "delivering"].map((type) => ({
            type,
            title: null,
            description: null,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
        })),
    });
    const good = order.goods[0];
    await index_1.default.functional.shoppings.customers.orders.goods.confirm(pool.customer, order.id, good.id);
    const review = await (0, generate_random_sale_review_1.generate_random_sale_review)(pool, sale, good, {
        files: [(0, prepare_random_attachment_file_1.prepare_random_attachment_file)({ extension: "jpg" })],
    });
    return {
        donation,
        order,
        good,
        review,
    };
};
exports.generate_random_mileage_histories = generate_random_mileage_histories;
//# sourceMappingURL=generate_random_mileage_histories.js.map