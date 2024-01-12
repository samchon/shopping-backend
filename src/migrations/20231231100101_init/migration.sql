/*
  Warnings:

  - Added the required column `quantity` to the `mv_shopping_order_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mv_shopping_order_prices" ADD COLUMN     "quantity" INTEGER NOT NULL;
