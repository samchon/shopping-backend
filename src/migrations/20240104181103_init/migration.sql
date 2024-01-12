/*
  Warnings:

  - You are about to drop the column `default` on the `shopping_mileages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shopping_mileages" DROP COLUMN "default",
ADD COLUMN     "value" DOUBLE PRECISION;
