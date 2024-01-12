import { Module } from "@nestjs/common";

import { ShoppingCustomerSaleController } from "./ShoppingCustomerSaleController";
import { ShoppingCustomerSaleQuestionCommentController } from "./ShoppingCustomerSaleQuestionCommentController";
import { ShoppingCustomerSaleQuestionController } from "./ShoppingCustomerSaleQuestionController";
import { ShoppingCustomerSaleReviewCommentController } from "./ShoppingCustomerSaleReviewCommentController";
import { ShoppingCustomerSaleReviewController } from "./ShoppingCustomerSaleReviewController";
import { ShoppingCustomerSaleSnapshotController } from "./ShoppingCustomerSaleSnapshotController";

@Module({
  controllers: [
    ShoppingCustomerSaleController,
    ShoppingCustomerSaleQuestionCommentController,
    ShoppingCustomerSaleQuestionController,
    ShoppingCustomerSaleReviewCommentController,
    ShoppingCustomerSaleReviewController,
    ShoppingCustomerSaleSnapshotController,
  ],
})
export class ShoppingCustomerSaleModule {}
