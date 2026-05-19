"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_shopping_actor_admin_login = void 0;
const e2e_1 = require("@nestia/e2e");
const uuid_1 = require("uuid");
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const ShoppingGlobal_1 = require("../../../../../src/ShoppingGlobal");
const ShoppingMemberProvider_1 = require("../../../../../src/providers/shoppings/actors/ShoppingMemberProvider");
const TestGlobal_1 = require("../../../../TestGlobal");
const test_api_shopping_actor_customer_create_1 = require("./test_api_shopping_actor_customer_create");
const test_api_shopping_actor_admin_login = async (pool) => {
    const input = {
        email: "robot@nestia.io",
        password: TestGlobal_1.TestGlobal.PASSWORD,
        nickname: "Robot",
        citizen: {
            mobile: "01012345678",
            name: "Robot",
        },
    };
    const customer = await (0, test_api_shopping_actor_customer_create_1.test_api_shopping_actor_customer_create)(pool, pool.admin);
    const admin = await (async () => {
        const login = () => shopping_api_1.default.functional.shoppings.admins.authenticate.login(pool.admin, {
            email: input.email,
            password: TestGlobal_1.TestGlobal.PASSWORD,
        });
        try {
            return await login();
        }
        catch {
            const joined = await ShoppingMemberProvider_1.ShoppingMemberProvider.join({
                customer,
                input,
            });
            await ShoppingGlobal_1.ShoppingGlobal.prisma.shopping_administrators.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    member: {
                        connect: { id: joined.member.id },
                    },
                    created_at: new Date(),
                },
            });
            await ShoppingGlobal_1.ShoppingGlobal.prisma.shopping_sellers.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    member: {
                        connect: { id: joined.member.id },
                    },
                    created_at: new Date(),
                },
            });
            return await login();
        }
    })();
    e2e_1.TestValidator.equals("passed", input, {
        email: admin.member.emails[0].value,
        password: TestGlobal_1.TestGlobal.PASSWORD,
        nickname: admin.member.nickname,
        citizen: admin.citizen,
    });
    return admin;
};
exports.test_api_shopping_actor_admin_login = test_api_shopping_actor_admin_login;
//# sourceMappingURL=test_api_shopping_actor_admin_login.js.map