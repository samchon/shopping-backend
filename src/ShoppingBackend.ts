import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { ShoppingConfiguration } from "./ShoppingConfiguration";
import { ShoppingModule } from "./ShoppingModule";

export class ShoppingBackend {
  private application_?: NestFastifyApplication;

  public async open(): Promise<void> {
    // MOUNT CONTROLLERS
    this.application_ = await NestFactory.create(
      ShoppingModule,
      new FastifyAdapter(),
      { logger: false },
    );

    // DO OPEN
    this.application_.enableCors();
    await this.application_.listen(ShoppingConfiguration.API_PORT(), "0.0.0.0");
  }

  public async close(): Promise<void> {
    if (this.application_ === undefined) return;

    // DO CLOSE
    await this.application_.close();
    delete this.application_;
  }
}
