-- DropForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" DROP CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" DROP CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_snapshot_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_cart_commodity_prices" DROP CONSTRAINT "mv_shopping_cart_commodity_prices_shopping_cart_commodity__fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" DROP CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_citizen_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" DROP CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_coupon_inventories" DROP CONSTRAINT "mv_shopping_coupon_inventories_shopping_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_deposit_balances" DROP CONSTRAINT "mv_shopping_deposit_balances_shopping_citizen_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_mileage_balances" DROP CONSTRAINT "mv_shopping_mileage_balances_shopping_citizen_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_order_good_prices" DROP CONSTRAINT "mv_shopping_order_good_prices_shopping_order_good_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_order_prices" DROP CONSTRAINT "mv_shopping_order_prices_shopping_order_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" DROP CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" DROP CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_snapshot_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_prices" DROP CONSTRAINT "mv_shopping_sale_snapshot_prices_shopping_sale_snapshot_id_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_prices" DROP CONSTRAINT "mv_shopping_sale_snapshot_unit_prices_shopping_sale_snapsh_fkey";

-- DropForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_stock_inventories" DROP CONSTRAINT "mv_shopping_sale_snapshot_unit_stock_inventories_shopping__fkey";

-- DropForeignKey
ALTER TABLE "shopping_address_favorites" DROP CONSTRAINT "shopping_address_favorites_shopping_address_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_address_favorites" DROP CONSTRAINT "shopping_address_favorites_shopping_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_deposit_charge_publishes" DROP CONSTRAINT "shopping_deposit_charge_publishes_shopping_deposit_charge__fkey";

-- DropForeignKey
ALTER TABLE "shopping_deposit_charges" DROP CONSTRAINT "shopping_deposit_charges_shopping_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_deposit_histories" DROP CONSTRAINT "shopping_deposit_histories_shopping_citizen_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_deposit_histories" DROP CONSTRAINT "shopping_deposit_histories_shopping_deposit_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_mileage_histories" DROP CONSTRAINT "shopping_mileage_histories_shopping_citizen_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_mileage_histories" DROP CONSTRAINT "shopping_mileage_histories_shopping_mileage_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_favorites" DROP CONSTRAINT "shopping_sale_favorites_shopping_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_favorites" DROP CONSTRAINT "shopping_sale_favorites_shopping_sale_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_favorites" DROP CONSTRAINT "shopping_sale_favorites_shopping_sale_snapshot_id_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" DROP CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_bbs_article_snaps_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" DROP CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_customer_fkey";

-- DropForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" DROP CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_sale_sna_fkey";

-- AddForeignKey
ALTER TABLE "shopping_deposit_histories" ADD CONSTRAINT "shopping_deposit_histories_shopping_deposit_id_fkey" FOREIGN KEY ("shopping_deposit_id") REFERENCES "shopping_deposits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_histories" ADD CONSTRAINT "shopping_deposit_histories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_charges" ADD CONSTRAINT "shopping_deposit_charges_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_charge_publishes" ADD CONSTRAINT "shopping_deposit_charge_publishes_shopping_deposit_charge__fkey" FOREIGN KEY ("shopping_deposit_charge_id") REFERENCES "shopping_deposit_charges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_mileage_histories" ADD CONSTRAINT "shopping_mileage_histories_shopping_mileage_id_fkey" FOREIGN KEY ("shopping_mileage_id") REFERENCES "shopping_mileages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_mileage_histories" ADD CONSTRAINT "shopping_mileage_histories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_customer_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_sale_sna_fkey" FOREIGN KEY ("shopping_sale_snapshot_inquiry_id") REFERENCES "shopping_sale_snapshot_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_bbs_article_snaps_fkey" FOREIGN KEY ("bbs_article_snapshot_id") REFERENCES "bbs_article_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_address_favorites" ADD CONSTRAINT "shopping_address_favorites_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_address_favorites" ADD CONSTRAINT "shopping_address_favorites_shopping_address_id_fkey" FOREIGN KEY ("shopping_address_id") REFERENCES "shopping_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" ADD CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_id_fkey" FOREIGN KEY ("bbs_article_id") REFERENCES "bbs_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" ADD CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_snapshot_id_fkey" FOREIGN KEY ("bbs_article_snapshot_id") REFERENCES "bbs_article_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" ADD CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" ADD CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_prices" ADD CONSTRAINT "mv_shopping_sale_snapshot_prices_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_prices" ADD CONSTRAINT "mv_shopping_sale_snapshot_unit_prices_shopping_sale_snapsh_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_id") REFERENCES "shopping_sale_snapshot_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_stock_inventories" ADD CONSTRAINT "mv_shopping_sale_snapshot_unit_stock_inventories_shopping__fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_cart_commodity_prices" ADD CONSTRAINT "mv_shopping_cart_commodity_prices_shopping_cart_commodity__fkey" FOREIGN KEY ("shopping_cart_commodity_id") REFERENCES "shopping_cart_commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_good_prices" ADD CONSTRAINT "mv_shopping_order_good_prices_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_prices" ADD CONSTRAINT "mv_shopping_order_prices_shopping_order_id_fkey" FOREIGN KEY ("shopping_order_id") REFERENCES "shopping_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_inventories" ADD CONSTRAINT "mv_shopping_coupon_inventories_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" ADD CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" ADD CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_deposit_balances" ADD CONSTRAINT "mv_shopping_deposit_balances_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_mileage_balances" ADD CONSTRAINT "mv_shopping_mileage_balances_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
