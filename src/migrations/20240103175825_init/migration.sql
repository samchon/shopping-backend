/*
  Warnings:

  - You are about to drop the column `amount` on the `shopping_deposit_charges` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopping_coupon_id,shopping_citizen_id]` on the table `mv_shopping_coupon_citizen_inventories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `multiplicative` to the `shopping_coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `shopping_deposit_charges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `shopping_deposit_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance` to the `shopping_mileage_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mv_shopping_coupon_citizen_inventories_shopping_citizen_id__key";

-- AlterTable
ALTER TABLE "shopping_coupons" ADD COLUMN     "multiplicative" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "shopping_deposit_charges" DROP COLUMN "amount",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "shopping_deposit_histories" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "shopping_mileage_histories" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "shopping_mileage_donations" (
    "id" UUID NOT NULL,
    "shopping_admin_customer_id" UUID NOT NULL,
    "shopping_citizen_id" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_mileage_donations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shopping_mileage_donations_shopping_admin_customer_id_idx" ON "shopping_mileage_donations"("shopping_admin_customer_id");

-- CreateIndex
CREATE INDEX "shopping_mileage_donations_shopping_citizen_id_created_at_idx" ON "shopping_mileage_donations"("shopping_citizen_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "mv_shopping_coupon_citizen_inventories_shopping_coupon_id_s_key" ON "mv_shopping_coupon_citizen_inventories"("shopping_coupon_id", "shopping_citizen_id");

-- AddForeignKey
ALTER TABLE "shopping_mileage_donations" ADD CONSTRAINT "shopping_mileage_donations_shopping_admin_customer_id_fkey" FOREIGN KEY ("shopping_admin_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_mileage_donations" ADD CONSTRAINT "shopping_mileage_donations_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
