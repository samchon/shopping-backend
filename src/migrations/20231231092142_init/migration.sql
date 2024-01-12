/*
  Warnings:

  - You are about to drop the column `shopping_cart_commodity_stock_id` on the `shopping_delivery_pieces` table. All the data in the column will be lost.
  - Added the required column `shopping_order_publish_id` to the `shopping_delivery_pieces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_sale_snapshot_unit_stock_id` to the `shopping_delivery_pieces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_address_id` to the `shopping_order_publishes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shopping_delivery_pieces" DROP CONSTRAINT "shopping_delivery_pieces_shopping_cart_commodity_stock_id_fkey";

-- DropIndex
DROP INDEX "shopping_delivery_pieces_shopping_cart_commodity_stock_id_idx";

-- AlterTable
ALTER TABLE "shopping_delivery_journeys" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ALTER COLUMN "started_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shopping_delivery_pieces" DROP COLUMN "shopping_cart_commodity_stock_id",
ADD COLUMN     "shopping_order_publish_id" UUID NOT NULL,
ADD COLUMN     "shopping_sale_snapshot_unit_stock_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "shopping_order_publishes" ADD COLUMN     "shopping_address_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "shopping_delivery_shippers" (
    "id" UUID NOT NULL,
    "shopping_delivery_id" UUID NOT NULL,
    "mobile" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "company" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_delivery_shippers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_shopping_order_publish_states" (
    "shopping_order_publish_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "mv_shopping_order_publish_states_pkey" PRIMARY KEY ("shopping_order_publish_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_order_good_states" (
    "shopping_order_good_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "mv_shopping_order_good_states_pkey" PRIMARY KEY ("shopping_order_good_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_order_good_publish_seller_states" (
    "id" UUID NOT NULL,
    "shopping_order_publish_id" UUID NOT NULL,
    "shopping_seller_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "mv_shopping_order_good_publish_seller_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_shopping_delivery_states" (
    "shopping_delivery_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "mv_shopping_delivery_states_pkey" PRIMARY KEY ("shopping_delivery_id")
);

-- CreateIndex
CREATE INDEX "shopping_delivery_shippers_shopping_delivery_id_idx" ON "shopping_delivery_shippers"("shopping_delivery_id");

-- CreateIndex
CREATE INDEX "mv_shopping_order_good_publish_seller_states_shopping_order_idx" ON "mv_shopping_order_good_publish_seller_states"("shopping_order_publish_id");

-- CreateIndex
CREATE UNIQUE INDEX "mv_shopping_order_good_publish_seller_states_shopping_order_key" ON "mv_shopping_order_good_publish_seller_states"("shopping_order_publish_id", "shopping_seller_id");

-- AddForeignKey
ALTER TABLE "shopping_order_publishes" ADD CONSTRAINT "shopping_order_publishes_shopping_address_id_fkey" FOREIGN KEY ("shopping_address_id") REFERENCES "shopping_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_order_publish_id_fkey" FOREIGN KEY ("shopping_order_publish_id") REFERENCES "shopping_order_publishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_sale_snapshot_unit_stock_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_shippers" ADD CONSTRAINT "shopping_delivery_shippers_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_publish_states" ADD CONSTRAINT "mv_shopping_order_publish_states_shopping_order_publish_id_fkey" FOREIGN KEY ("shopping_order_publish_id") REFERENCES "shopping_order_publishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_good_states" ADD CONSTRAINT "mv_shopping_order_good_states_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_good_publish_seller_states" ADD CONSTRAINT "mv_shopping_order_good_publish_seller_states_shopping_orde_fkey" FOREIGN KEY ("shopping_order_publish_id") REFERENCES "shopping_order_publishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_good_publish_seller_states" ADD CONSTRAINT "mv_shopping_order_good_publish_seller_states_shopping_sell_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_delivery_states" ADD CONSTRAINT "mv_shopping_delivery_states_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
