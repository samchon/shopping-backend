"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_monitor_health_check = void 0;
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const test_api_monitor_health_check = async (pool) => {
    await shopping_api_1.default.functional.monitors.health.get(pool.generate());
};
exports.test_api_monitor_health_check = test_api_monitor_health_check;
//# sourceMappingURL=test_api_monitor_health_check.js.map