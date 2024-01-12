/*
  Warnings:

  - Added the required column `volumed_price` to the `mv_shopping_cart_commodity_prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mv_shopping_cart_commodity_prices" ADD COLUMN     "volumed_price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "shopping_cart_commodities" ADD COLUMN     "deleted_at" TIMESTAMPTZ;
