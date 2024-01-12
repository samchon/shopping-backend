import { Module } from "@nestjs/common";

import { ShoppingSellerDeliveryController } from "./ShoppingSellerDeliveryController";
import { ShoppingSellerDeliveryJourneyController } from "./ShoppingSellerDeliveryJourneyController";
import { ShoppingSellerDeliveryShipperController } from "./ShoppingSellerDeliveryShipperController";

@Module({
  controllers: [
    ShoppingSellerDeliveryController,
    ShoppingSellerDeliveryJourneyController,
    ShoppingSellerDeliveryShipperController,
  ],
})
export class ShoppingSellerDeliveryModule {}
