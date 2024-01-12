import { Module } from "@nestjs/common";

import { ShoppingSellerSaleController } from "./ShoppingSellerSaleController";
import { ShoppingSellerSaleQuestionAnswerController } from "./ShoppingSellerSaleQuestionAnswerController";
import { ShoppingSellerSaleQuestionCommentController } from "./ShoppingSellerSaleQuestionCommentController";
import { ShoppingSellerSaleQuestionController } from "./ShoppingSellerSaleQuestionController";
import { ShoppingSellerSaleReviewAnswerController } from "./ShoppingSellerSaleReviewAnswerController";
import { ShoppingSellerSaleReviewCommentController } from "./ShoppingSellerSaleReviewCommentController";
import { ShoppingSellerSaleReviewController } from "./ShoppingSellerSaleReviewController";
import { ShoppingSellerSaleSnapshotController } from "./ShoppingSellerSaleSnapshotController";
import { ShoppingSellerSaleUnitStockSupplementController } from "./ShoppingSellerSaleUnitStockSupplementController";

@Module({
  controllers: [
    ShoppingSellerSaleController,
    ShoppingSellerSaleQuestionAnswerController,
    ShoppingSellerSaleQuestionCommentController,
    ShoppingSellerSaleQuestionController,
    ShoppingSellerSaleReviewAnswerController,
    ShoppingSellerSaleReviewCommentController,
    ShoppingSellerSaleReviewController,
    ShoppingSellerSaleSnapshotController,
    ShoppingSellerSaleUnitStockSupplementController,
  ],
})
export class ShoppingSellerSaleModule {}
