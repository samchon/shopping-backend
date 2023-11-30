import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IPerformance } from "@samchon/shopping-api/lib/structures/monitors/IPerformance";

@Controller("monitors/performance")
export class PerformanceController {
    @core.EncryptedRoute.Get()
    public async get(): Promise<IPerformance> {
        return {
            cpu: process.cpuUsage(),
            memory: process.memoryUsage(),
            resource: process.resourceUsage(),
        };
    }
}
