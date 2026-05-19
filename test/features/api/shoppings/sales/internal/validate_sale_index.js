"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate_sale_index = void 0;
const e2e_1 = require("@nestia/e2e");
const tstl_1 = require("tstl");
const index_1 = __importDefault(require("@samchon/shopping-api/lib/index"));
const TestGlobal_1 = require("../../../../../TestGlobal");
const validate_sale_index = async (props) => {
    const fetcher = (connection) => (actor) => (input) => index_1.default.functional.shoppings[actor].sales.index(connection, input);
    await validate_in_viewer_level(fetcher(props.pool.admin))(props.sales)("admins")(true);
    await validate_in_viewer_level(fetcher(props.pool.customer))(props.sales)("customers")(props.visibleInCustomer);
    await validate_in_seller_level(props.pool.seller)(fetcher(props.pool.seller))(props.sales);
};
exports.validate_sale_index = validate_sale_index;
const validate_in_viewer_level = (fetcher) => (saleList) => (actor) => async (visible) => {
    const page = await fetcher(actor)({
        limit: saleList.length,
        sort: ["-sale.created_at"],
    });
    const filtered = page.data.filter((summary) => saleList.find((s) => s.id === summary.id) !== undefined);
    e2e_1.TestValidator.predicate(`page API of ${actor} (${visible})`, () => visible === true ? !!filtered.length : !filtered.length);
};
const validate_in_seller_level = (connection) => (fetcher) => async (saleList) => {
    const dict = create_entity_map();
    for (const sale of saleList) {
        const array = dict.take(sale.seller, () => []);
        array.push(sale);
    }
    for (const it of dict) {
        const seller = it.first;
        const mySales = it.second;
        await index_1.default.functional.shoppings.customers.authenticate.login(connection, {
            email: seller.member.emails[0].value,
            password: TestGlobal_1.TestGlobal.PASSWORD,
        });
        const index = await fetcher("sellers")({
            limit: saleList.length,
        });
        e2e_1.TestValidator.index("seller ownership", mySales, index.data);
    }
};
const create_entity_map = () => new tstl_1.HashMap((entity) => (0, tstl_1.hash)(entity.id), (x, y) => x.id === y.id);
//# sourceMappingURL=validate_sale_index.js.map