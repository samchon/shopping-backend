/*
  Warnings:

  - Added the required column `sequence` to the `shopping_delivery_journeys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopping_delivery_journeys" ADD COLUMN     "sequence" INTEGER NOT NULL;
