/*
  Warnings:

  - You are about to drop the column `shopping_sale_id` on the `shopping_sale_snapshot_inquiries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiries" DROP CONSTRAINT "shopping_sale_snapshot_inquiries_shopping_sale_id_fkey";

-- AlterTable
ALTER TABLE "shopping_sale_snapshot_inquiries" DROP COLUMN "shopping_sale_id";
