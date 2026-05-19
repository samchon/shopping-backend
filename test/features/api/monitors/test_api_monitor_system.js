"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test_api_monitor_system = void 0;
const shopping_api_1 = __importDefault(require("@samchon/shopping-api"));
const test_api_monitor_system = async (pool) => {
    await shopping_api_1.default.functional.monitors.system.get(pool.generate());
};
exports.test_api_monitor_system = test_api_monitor_system;
//# sourceMappingURL=test_api_monitor_system.js.map