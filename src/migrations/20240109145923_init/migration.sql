/*
  Warnings:

  - You are about to drop the column `invoice_code` on the `shopping_deliveries` table. All the data in the column will be lost.
  - You are about to drop the `mv_shopping_order_good_publish_seller_states` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mv_shopping_order_good_publish_seller_states" DROP CONSTRAINT "mv_shopping_order_good_publish_seller_states_shopping_orde_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_order_good_publish_seller_states" DROP CONSTRAINT "mv_shopping_order_good_publish_seller_states_shopping_sell_fkey";

-- DropIndex
DROP INDEX "shopping_deliveries_invoice_code_idx";

-- AlterTable
ALTER TABLE "shopping_deliveries" DROP COLUMN "invoice_code",
ADD COLUMN     "deleted_at" TIMESTAMPTZ;

-- DropTable
DROP TABLE "mv_shopping_order_good_publish_seller_states";

-- CreateTable
CREATE TABLE "mv_shopping_order_publish_seller_states" (
    "id" UUID NOT NULL,
    "shopping_order_publish_id" UUID NOT NULL,
    "shopping_seller_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "mv_shopping_order_publish_seller_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mv_shopping_order_publish_seller_states_shopping_order_publ_idx" ON "mv_shopping_order_publish_seller_states"("shopping_order_publish_id");

-- CreateIndex
CREATE UNIQUE INDEX "mv_shopping_order_publish_seller_states_shopping_order_publ_key" ON "mv_shopping_order_publish_seller_states"("shopping_order_publish_id", "shopping_seller_id");

-- AddForeignKey
ALTER TABLE "mv_shopping_order_publish_seller_states" ADD CONSTRAINT "mv_shopping_order_publish_seller_states_shopping_order_pub_fkey" FOREIGN KEY ("shopping_order_publish_id") REFERENCES "shopping_order_publishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_publish_seller_states" ADD CONSTRAINT "mv_shopping_order_publish_seller_states_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
