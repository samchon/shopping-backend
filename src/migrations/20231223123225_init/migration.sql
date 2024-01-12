/*
  Warnings:

  - You are about to drop the column `nominal_representative` on the `mv_shopping_sale_snapshot_prices` table. All the data in the column will be lost.
  - You are about to drop the column `real_representative` on the `mv_shopping_sale_snapshot_prices` table. All the data in the column will be lost.
  - Added the required column `sequence` to the `shopping_sale_snapshot_channel_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sequence` to the `shopping_sale_snapshot_channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopping_sale_snapshot_unit_option_id` to the `shopping_sale_snapshot_unit_stock_choices` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "mv_shopping_sale_snapshot_prices_real_representative_idx";

-- AlterTable
ALTER TABLE "mv_shopping_sale_snapshot_prices" DROP COLUMN "nominal_representative",
DROP COLUMN "real_representative";

-- AlterTable
ALTER TABLE "shopping_sale_snapshot_channel_categories" ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "shopping_sale_snapshot_channels" ADD COLUMN     "sequence" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "shopping_sale_snapshot_unit_stock_choices" ADD COLUMN     "shopping_sale_snapshot_unit_option_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_content_thumbnails" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_content_id" UUID NOT NULL,
    "attachment_file_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_content_thumbnails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_shopping_sale_snapshot_unit_prices" (
    "shopping_sale_snapshot_unit_id" UUID NOT NULL,
    "nominal_lowest" DOUBLE PRECISION NOT NULL,
    "nominal_highest" DOUBLE PRECISION NOT NULL,
    "real_lowest" DOUBLE PRECISION NOT NULL,
    "real_highest" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_sale_snapshot_unit_prices_pkey" PRIMARY KEY ("shopping_sale_snapshot_unit_id")
);

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_content_thumbnails_shopping_sale_sna_idx" ON "shopping_sale_snapshot_content_thumbnails"("shopping_sale_snapshot_content_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_content_thumbnails_attachment_file_i_idx" ON "shopping_sale_snapshot_content_thumbnails"("attachment_file_id");

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_content_thumbnails" ADD CONSTRAINT "shopping_sale_snapshot_content_thumbnails_shopping_sale_sn_fkey" FOREIGN KEY ("shopping_sale_snapshot_content_id") REFERENCES "shopping_sale_snapshot_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_content_thumbnails" ADD CONSTRAINT "shopping_sale_snapshot_content_thumbnails_attachment_file__fkey" FOREIGN KEY ("attachment_file_id") REFERENCES "attachment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_stock_choices" ADD CONSTRAINT "fk_shopping_sale_snapshot_unit_stock_choices_option" FOREIGN KEY ("shopping_sale_snapshot_unit_option_id") REFERENCES "shopping_sale_snapshot_unit_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_prices" ADD CONSTRAINT "mv_shopping_sale_snapshot_unit_prices_shopping_sale_snapsh_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_id") REFERENCES "shopping_sale_snapshot_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
