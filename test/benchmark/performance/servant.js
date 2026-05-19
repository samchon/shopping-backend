"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const benchmark_1 = require("@nestia/benchmark");
const ShoppingConfiguration_1 = require("../../../src/ShoppingConfiguration");
const ConnectionPool_1 = require("../../ConnectionPool");
benchmark_1.DynamicBenchmarker.servant({
    connection: {
        host: `http://127.0.0.1:${ShoppingConfiguration_1.ShoppingConfiguration.API_PORT()}`,
    },
    location: `${__dirname}/../../features`,
    parameters: (connection) => [new ConnectionPool_1.ConnectionPool(connection)],
    prefix: "test_api_",
}).catch((exp) => {
    console.error(exp);
    process.exit(-1);
});
//# sourceMappingURL=servant.js.map