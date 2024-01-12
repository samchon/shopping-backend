/*
  Warnings:

  - You are about to drop the column `cash` on the `mv_shopping_order_prices` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `mv_shopping_order_prices` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `mv_shopping_order_prices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mv_shopping_order_prices" DROP COLUMN "cash",
DROP COLUMN "deposit",
DROP COLUMN "mileage";
