import { Module } from "@nestjs/common";

import { ShoppingAdminSaleController } from "./ShoppingAdminSaleController";
import { ShoppingAdminSaleQuestionCommentController } from "./ShoppingAdminSaleQuestionCommentController";
import { ShoppingAdminSaleQuestionController } from "./ShoppingAdminSaleQuestionController";
import { ShoppingAdminSaleReviewCommentController } from "./ShoppingAdminSaleReviewCommentController";
import { ShoppingAdminSaleReviewController } from "./ShoppingAdminSaleReviewController";
import { ShoppingAdminSaleSnapshotController } from "./ShoppingAdminSaleSnapshotController";

@Module({
  controllers: [
    ShoppingAdminSaleController,
    ShoppingAdminSaleQuestionCommentController,
    ShoppingAdminSaleQuestionController,
    ShoppingAdminSaleReviewCommentController,
    ShoppingAdminSaleReviewController,
    ShoppingAdminSaleSnapshotController,
  ],
})
export class ShoppingAdminSaleModule {}
