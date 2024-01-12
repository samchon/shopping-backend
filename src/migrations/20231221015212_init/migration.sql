-- CreateTable
CREATE TABLE "attachment_files" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "extension" VARCHAR,
    "url" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "attachment_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_articles" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "bbs_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_article_snapshots" (
    "id" UUID NOT NULL,
    "bbs_article_id" UUID NOT NULL,
    "format" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bbs_article_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_article_snapshot_files" (
    "id" UUID NOT NULL,
    "bbs_article_snapshot_id" UUID NOT NULL,
    "attachment_file_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "bbs_article_snapshot_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_article_comments" (
    "id" UUID NOT NULL,
    "bbs_article_id" UUID NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "bbs_article_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_article_comment_snapshots" (
    "id" UUID NOT NULL,
    "bbs_article_comment_id" UUID NOT NULL,
    "format" VARCHAR NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bbs_article_comment_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bbs_article_comment_snapshot_files" (
    "id" UUID NOT NULL,
    "bbs_article_comment_snapshot_id" UUID NOT NULL,
    "attachment_file_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "bbs_article_comment_snapshot_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_channels" (
    "id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "exclusive" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_channel_categories" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_channel_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sections" (
    "id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_customers" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "shopping_member_id" UUID,
    "shopping_external_user_id" UUID,
    "shopping_citizen_id" UUID,
    "href" VARCHAR NOT NULL,
    "referrer" VARCHAR NOT NULL,
    "ip" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_external_users" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "shopping_citizen_id" UUID,
    "application" VARCHAR NOT NULL,
    "uid" VARCHAR NOT NULL,
    "nickname" VARCHAR NOT NULL,
    "data" TEXT,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shopping_external_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_citizens" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID,
    "mobile" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_citizens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_members" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "shopping_citizen_id" UUID,
    "nickname" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "withdrawn_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_member_emails" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "shopping_member_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_member_emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sellers" (
    "id" UUID NOT NULL,
    "shopping_member_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_administrators" (
    "id" UUID NOT NULL,
    "shopping_member_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_administrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_addresses" (
    "id" UUID NOT NULL,
    "mobile" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL,
    "province" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "department" VARCHAR NOT NULL,
    "possession" VARCHAR NOT NULL,
    "zip_code" VARCHAR NOT NULL,
    "special_note" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sales" (
    "id" UUID NOT NULL,
    "shopping_section_id" UUID NOT NULL,
    "shopping_seller_customer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "opened_at" TIMESTAMPTZ,
    "closed_at" TIMESTAMPTZ,
    "paused_at" TIMESTAMPTZ,
    "suspended_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshots" (
    "id" UUID NOT NULL,
    "shopping_sale_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_sale_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_contents" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "format" VARCHAR NOT NULL,
    "body" TEXT NOT NULL,
    "revert_policy" VARCHAR,

    CONSTRAINT "shopping_sale_snapshot_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_content_files" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_content_id" UUID NOT NULL,
    "attachment_file_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_content_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_tags" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "value" VARCHAR NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_channels" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_channel_categories" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_channel_id" UUID NOT NULL,
    "shopping_channel_category_id" UUID NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_channel_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_units" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "required" BOOLEAN NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_unit_options" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "variable" BOOLEAN NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_unit_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_unit_option_candidates" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_option_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_unit_option_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_unit_stocks" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "nominal_price" DOUBLE PRECISION NOT NULL,
    "real_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_unit_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_unit_stock_choices" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_stock_id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_option_candidate_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_unit_stock_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_unit_stock_supplements" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_stock_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_unit_stock_supplements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_carts" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "actor_type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart_commodities" (
    "id" UUID NOT NULL,
    "shopping_cart_id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "volume" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "published" BOOLEAN NOT NULL,

    CONSTRAINT "shopping_cart_commodities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart_commodity_stocks" (
    "id" UUID NOT NULL,
    "shopping_cart_commodity_id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_stock_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_cart_commodity_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_cart_commodity_stock_choices" (
    "id" UUID NOT NULL,
    "shopping_cart_commodity_stock_id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_option_id" UUID NOT NULL,
    "shopping_sale_snapshot_unit_option_candidate_id" UUID,
    "value" VARCHAR,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_cart_commodity_stock_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_orders" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "shopping_address_id" UUID,
    "cash" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_order_goods" (
    "id" UUID NOT NULL,
    "shopping_order_id" UUID NOT NULL,
    "shopping_cart_commodity_id" UUID NOT NULL,
    "shopping_seller_id" UUID NOT NULL,
    "volume" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "confirmed_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_order_goods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_order_publishes" (
    "id" UUID NOT NULL,
    "shopping_order_id" UUID NOT NULL,
    "password" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL,
    "paid_at" TIMESTAMPTZ,
    "cancelled_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_order_publishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_deliveries" (
    "id" UUID NOT NULL,
    "shopping_seller_customer_id" UUID NOT NULL,
    "invoice_code" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "shopping_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_delivery_pieces" (
    "id" UUID NOT NULL,
    "shopping_delivery_id" UUID NOT NULL,
    "shopping_order_good_id" UUID NOT NULL,
    "shopping_cart_commodity_stock_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_delivery_pieces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_delivery_journeys" (
    "id" UUID NOT NULL,
    "shopping_delivery_id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
    "title" VARCHAR,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_delivery_journeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupons" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "actor_type" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "access" VARCHAR NOT NULL,
    "exclusive" BOOLEAN NOT NULL,
    "unit" VARCHAR NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "threshold" DOUBLE PRECISION,
    "limit" INTEGER,
    "volume" INTEGER,
    "volume_per_citizen" INTEGER,
    "expired_in" INTEGER,
    "expired_at" TIMESTAMPTZ,
    "opened_at" TIMESTAMPTZ,
    "closed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_criterias" (
    "id" UUID NOT NULL,
    "shopping_coupon_id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
    "direction" VARCHAR NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "shopping_coupon_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_section_criterias" (
    "id" UUID NOT NULL,
    "shopping_section_id" UUID NOT NULL,

    CONSTRAINT "shopping_coupon_section_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_channel_criterias" (
    "id" UUID NOT NULL,
    "shopping_channel_id" UUID NOT NULL,
    "shopping_channel_category_id" UUID,

    CONSTRAINT "shopping_coupon_channel_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_seller_criterias" (
    "id" UUID NOT NULL,
    "shopping_seller_id" UUID NOT NULL,

    CONSTRAINT "shopping_coupon_seller_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_sale_criterias" (
    "id" UUID NOT NULL,
    "shopping_sale_id" UUID NOT NULL,

    CONSTRAINT "shopping_coupon_sale_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_funnel_criterias" (
    "id" UUID NOT NULL,
    "kind" VARCHAR NOT NULL,
    "key" VARCHAR,
    "value" VARCHAR NOT NULL,

    CONSTRAINT "shopping_coupon_funnel_criterias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_tickets" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "shopping_coupon_id" UUID NOT NULL,
    "shopping_coupon_disposable_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL,
    "expired_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_coupon_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_ticket_payments" (
    "id" UUID NOT NULL,
    "shopping_coupon_ticket_id" UUID NOT NULL,
    "shopping_order_id" UUID NOT NULL,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_coupon_ticket_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_coupon_disposables" (
    "id" UUID NOT NULL,
    "shopping_coupon_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "expired_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_coupon_disposables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_deposits" (
    "id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "source" VARCHAR NOT NULL,
    "direction" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_deposit_histories" (
    "id" UUID NOT NULL,
    "shopping_deposit_id" UUID NOT NULL,
    "shopping_citizen_id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "cancelled_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_deposit_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_deposit_charges" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_deposit_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_deposit_charge_publishes" (
    "id" UUID NOT NULL,
    "shopping_deposit_charge_id" UUID NOT NULL,
    "password" VARCHAR,
    "created_at" TIMESTAMPTZ NOT NULL,
    "paid_at" TIMESTAMPTZ,
    "cancelled_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_deposit_charge_publishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_mileages" (
    "id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "source" VARCHAR NOT NULL,
    "direction" INTEGER NOT NULL,
    "default" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_mileages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_mileage_histories" (
    "id" UUID NOT NULL,
    "shopping_mileage_id" UUID NOT NULL,
    "shopping_citizen_id" UUID NOT NULL,
    "source_id" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "cancelled_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_mileage_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_inquiries" (
    "id" UUID NOT NULL,
    "shopping_sale_id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "read_by_seller_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sale_snapshot_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_questions" (
    "id" UUID NOT NULL,
    "secret" BOOLEAN NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_reviews" (
    "id" UUID NOT NULL,
    "shopping_order_good_id" UUID NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_review_snapshots" (
    "id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_review_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_inquiry_answers" (
    "id" UUID NOT NULL,
    "shopping_sale_snapshot_inquiry_id" UUID NOT NULL,
    "shopping_seller_customer_id" UUID NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_inquiry_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_inquiry_comments" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "actor_type" VARCHAR NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_inquiry_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_favorites" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "shopping_sale_id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sale_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_inquiry_favorites" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "shopping_sale_snapshot_inquiry_id" UUID NOT NULL,
    "bbs_article_snapshot_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_address_favorites" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "shopping_address_id" UUID NOT NULL,
    "title" VARCHAR NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_address_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_cache_times" (
    "id" UUID NOT NULL,
    "schema" VARCHAR NOT NULL,
    "table" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,
    "value" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mv_cache_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_bbs_article_last_snapshots" (
    "bbs_article_id" UUID NOT NULL,
    "bbs_article_snapshot_id" UUID NOT NULL,

    CONSTRAINT "mv_bbs_article_last_snapshots_pkey" PRIMARY KEY ("bbs_article_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_sale_last_snapshots" (
    "shopping_sale_id" UUID NOT NULL,
    "shopping_sale_snapshot_id" UUID NOT NULL,

    CONSTRAINT "mv_shopping_sale_last_snapshots_pkey" PRIMARY KEY ("shopping_sale_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_sale_snapshot_prices" (
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "nominal_representative" DOUBLE PRECISION NOT NULL,
    "nominal_lowest" DOUBLE PRECISION NOT NULL,
    "nominal_highest" DOUBLE PRECISION NOT NULL,
    "real_representative" DOUBLE PRECISION NOT NULL,
    "real_lowest" DOUBLE PRECISION NOT NULL,
    "real_highest" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_sale_snapshot_prices_pkey" PRIMARY KEY ("shopping_sale_snapshot_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_sale_snapshot_unit_stock_inventories" (
    "shopping_sale_snapshot_unit_stock_id" UUID NOT NULL,
    "income" INTEGER NOT NULL,
    "outcome" INTEGER NOT NULL,

    CONSTRAINT "mv_shopping_sale_snapshot_unit_stock_inventories_pkey" PRIMARY KEY ("shopping_sale_snapshot_unit_stock_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_cart_commodity_prices" (
    "shopping_cart_commodity_id" UUID NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "real" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_cart_commodity_prices_pkey" PRIMARY KEY ("shopping_cart_commodity_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_order_good_prices" (
    "shopping_order_good_id" UUID NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "real" DOUBLE PRECISION NOT NULL,
    "cash" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "ticket" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_order_good_prices_pkey" PRIMARY KEY ("shopping_order_good_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_order_prices" (
    "shopping_order_id" UUID NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "real" DOUBLE PRECISION NOT NULL,
    "cash" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "ticket" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_order_prices_pkey" PRIMARY KEY ("shopping_order_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_coupon_inventories" (
    "shopping_coupon_id" UUID NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "mv_shopping_coupon_inventories_pkey" PRIMARY KEY ("shopping_coupon_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_coupon_citizen_inventories" (
    "id" UUID NOT NULL,
    "shopping_citizen_id" UUID NOT NULL,
    "shopping_coupon_id" UUID NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "mv_shopping_coupon_citizen_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mv_shopping_deposit_balances" (
    "shopping_citizen_id" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_deposit_balances_pkey" PRIMARY KEY ("shopping_citizen_id")
);

-- CreateTable
CREATE TABLE "mv_shopping_mileage_balances" (
    "shopping_citizen_id" UUID NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "mv_shopping_mileage_balances_pkey" PRIMARY KEY ("shopping_citizen_id")
);

-- CreateIndex
CREATE INDEX "bbs_articles_created_at_idx" ON "bbs_articles"("created_at");

-- CreateIndex
CREATE INDEX "bbs_article_snapshots_bbs_article_id_created_at_idx" ON "bbs_article_snapshots"("bbs_article_id", "created_at");

-- CreateIndex
CREATE INDEX "bbs_article_snapshot_files_bbs_article_snapshot_id_idx" ON "bbs_article_snapshot_files"("bbs_article_snapshot_id");

-- CreateIndex
CREATE INDEX "bbs_article_snapshot_files_attachment_file_id_idx" ON "bbs_article_snapshot_files"("attachment_file_id");

-- CreateIndex
CREATE INDEX "bbs_article_comments_bbs_article_id_parent_id_created_at_idx" ON "bbs_article_comments"("bbs_article_id", "parent_id", "created_at");

-- CreateIndex
CREATE INDEX "bbs_article_comment_snapshots_bbs_article_comment_id_create_idx" ON "bbs_article_comment_snapshots"("bbs_article_comment_id", "created_at");

-- CreateIndex
CREATE INDEX "bbs_article_comment_snapshot_files_bbs_article_comment_snap_idx" ON "bbs_article_comment_snapshot_files"("bbs_article_comment_snapshot_id");

-- CreateIndex
CREATE INDEX "bbs_article_comment_snapshot_files_attachment_file_id_idx" ON "bbs_article_comment_snapshot_files"("attachment_file_id");

-- CreateIndex
CREATE INDEX "shopping_channels_created_at_idx" ON "shopping_channels"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channels_code_key" ON "shopping_channels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channels_name_key" ON "shopping_channels"("name");

-- CreateIndex
CREATE INDEX "shopping_channel_categories_parent_id_idx" ON "shopping_channel_categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channel_categories_shopping_channel_id_parent_id_n_key" ON "shopping_channel_categories"("shopping_channel_id", "parent_id", "name");

-- CreateIndex
CREATE INDEX "shopping_sections_created_at_idx" ON "shopping_sections"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sections_code_key" ON "shopping_sections"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sections_name_key" ON "shopping_sections"("name");

-- CreateIndex
CREATE INDEX "shopping_customers_shopping_channel_id_created_at_idx" ON "shopping_customers"("shopping_channel_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_customers_shopping_citizen_id_created_at_idx" ON "shopping_customers"("shopping_citizen_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_customers_shopping_external_user_id_created_at_idx" ON "shopping_customers"("shopping_external_user_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_customers_shopping_member_id_created_at_idx" ON "shopping_customers"("shopping_member_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_customers_href_idx" ON "shopping_customers"("href");

-- CreateIndex
CREATE INDEX "shopping_customers_referrer_idx" ON "shopping_customers"("referrer");

-- CreateIndex
CREATE INDEX "shopping_customers_ip_idx" ON "shopping_customers"("ip");

-- CreateIndex
CREATE INDEX "shopping_customers_created_at_idx" ON "shopping_customers"("created_at");

-- CreateIndex
CREATE INDEX "shopping_external_users_shopping_citizen_id_idx" ON "shopping_external_users"("shopping_citizen_id");

-- CreateIndex
CREATE INDEX "shopping_external_users_application_created_at_idx" ON "shopping_external_users"("application", "created_at");

-- CreateIndex
CREATE INDEX "shopping_external_users_created_at_idx" ON "shopping_external_users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_external_users_shopping_channel_id_application_uid_key" ON "shopping_external_users"("shopping_channel_id", "application", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_external_users_shopping_channel_id_application_nic_key" ON "shopping_external_users"("shopping_channel_id", "application", "nickname");

-- CreateIndex
CREATE INDEX "shopping_citizens_mobile_idx" ON "shopping_citizens"("mobile");

-- CreateIndex
CREATE INDEX "shopping_citizens_name_idx" ON "shopping_citizens"("name");

-- CreateIndex
CREATE INDEX "shopping_citizens_created_at_idx" ON "shopping_citizens"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_citizens_shopping_channel_id_mobile_key" ON "shopping_citizens"("shopping_channel_id", "mobile");

-- CreateIndex
CREATE INDEX "shopping_members_shopping_citizen_id_idx" ON "shopping_members"("shopping_citizen_id");

-- CreateIndex
CREATE INDEX "shopping_members_nickname_idx" ON "shopping_members"("nickname");

-- CreateIndex
CREATE INDEX "shopping_members_created_at_idx" ON "shopping_members"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_members_shopping_channel_id_nickname_key" ON "shopping_members"("shopping_channel_id", "nickname");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_members_shopping_channel_id_shopping_citizen_id_key" ON "shopping_members"("shopping_channel_id", "shopping_citizen_id");

-- CreateIndex
CREATE INDEX "shopping_member_emails_value_idx" ON "shopping_member_emails"("value");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_member_emails_shopping_channel_id_value_key" ON "shopping_member_emails"("shopping_channel_id", "value");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_member_emails_shopping_member_id_value_key" ON "shopping_member_emails"("shopping_member_id", "value");

-- CreateIndex
CREATE INDEX "shopping_sellers_created_at_idx" ON "shopping_sellers"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sellers_shopping_member_id_key" ON "shopping_sellers"("shopping_member_id");

-- CreateIndex
CREATE INDEX "shopping_administrators_created_at_idx" ON "shopping_administrators"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_administrators_shopping_member_id_key" ON "shopping_administrators"("shopping_member_id");

-- CreateIndex
CREATE INDEX "shopping_addresses_mobile_idx" ON "shopping_addresses"("mobile");

-- CreateIndex
CREATE INDEX "shopping_addresses_name_idx" ON "shopping_addresses"("name");

-- CreateIndex
CREATE INDEX "shopping_sales_shopping_section_id_idx" ON "shopping_sales"("shopping_section_id");

-- CreateIndex
CREATE INDEX "shopping_sales_shopping_seller_customer_id_idx" ON "shopping_sales"("shopping_seller_customer_id");

-- CreateIndex
CREATE INDEX "shopping_sales_created_at_idx" ON "shopping_sales"("created_at");

-- CreateIndex
CREATE INDEX "shopping_sales_opened_at_closed_at_suspended_at_idx" ON "shopping_sales"("opened_at", "closed_at", "suspended_at");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshots_shopping_sale_id_created_at_idx" ON "shopping_sale_snapshots"("shopping_sale_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_contents_title_idx" ON "shopping_sale_snapshot_contents"("title");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_contents_shopping_sale_snapshot_id_key" ON "shopping_sale_snapshot_contents"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_content_files_shopping_sale_snapshot_idx" ON "shopping_sale_snapshot_content_files"("shopping_sale_snapshot_content_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_content_files_attachment_file_id_idx" ON "shopping_sale_snapshot_content_files"("attachment_file_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_tags_value_idx" ON "shopping_sale_snapshot_tags"("value");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_tags_shopping_sale_snapshot_id_value_key" ON "shopping_sale_snapshot_tags"("shopping_sale_snapshot_id", "value");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_channels_shopping_channel_id_idx" ON "shopping_sale_snapshot_channels"("shopping_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_channels_shopping_sale_snapshot_id_s_key" ON "shopping_sale_snapshot_channels"("shopping_sale_snapshot_id", "shopping_channel_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_channel_categories_shopping_channel__idx" ON "shopping_sale_snapshot_channel_categories"("shopping_channel_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_channel_categories_shopping_sale_sna_key" ON "shopping_sale_snapshot_channel_categories"("shopping_sale_snapshot_channel_id", "shopping_channel_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_units_shopping_sale_snapshot_id_name_key" ON "shopping_sale_snapshot_units"("shopping_sale_snapshot_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_options_shopping_sale_snapshot__key" ON "shopping_sale_snapshot_unit_options"("shopping_sale_snapshot_unit_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_option_candidates_shopping_sale_key" ON "shopping_sale_snapshot_unit_option_candidates"("shopping_sale_snapshot_unit_option_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_stocks_shopping_sale_snapshot_u_key" ON "shopping_sale_snapshot_unit_stocks"("shopping_sale_snapshot_unit_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_stock_choices_shopping_sale_sna_key" ON "shopping_sale_snapshot_unit_stock_choices"("shopping_sale_snapshot_unit_stock_id", "shopping_sale_snapshot_unit_option_candidate_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_unit_stock_supplements_shopping_sale_idx" ON "shopping_sale_snapshot_unit_stock_supplements"("shopping_sale_snapshot_unit_stock_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_carts_shopping_customer_id_actor_type_created_at_d_idx" ON "shopping_carts"("shopping_customer_id", "actor_type", "created_at", "deleted_at");

-- CreateIndex
CREATE INDEX "shopping_cart_commodities_shopping_cart_id_created_at_idx" ON "shopping_cart_commodities"("shopping_cart_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_cart_commodities_shopping_sale_snapshot_id_idx" ON "shopping_cart_commodities"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE INDEX "shopping_cart_commodity_stocks_shopping_cart_commodity_id_idx" ON "shopping_cart_commodity_stocks"("shopping_cart_commodity_id");

-- CreateIndex
CREATE INDEX "idx_shopping_cart_commodity_stocks_unit" ON "shopping_cart_commodity_stocks"("shopping_sale_snapshot_unit_id");

-- CreateIndex
CREATE INDEX "idx_shopping_cart_commodity_stocks_stock" ON "shopping_cart_commodity_stocks"("shopping_sale_snapshot_unit_stock_id");

-- CreateIndex
CREATE INDEX "shopping_cart_commodity_stock_choices_shopping_cart_commodi_idx" ON "shopping_cart_commodity_stock_choices"("shopping_cart_commodity_stock_id");

-- CreateIndex
CREATE INDEX "idx_shopping_cart_commodity_stock_choices_option" ON "shopping_cart_commodity_stock_choices"("shopping_sale_snapshot_unit_option_id");

-- CreateIndex
CREATE INDEX "idx_shopping_cart_commodity_stock_choices_candidate" ON "shopping_cart_commodity_stock_choices"("shopping_sale_snapshot_unit_option_candidate_id");

-- CreateIndex
CREATE INDEX "shopping_orders_shopping_customer_id_created_at_idx" ON "shopping_orders"("shopping_customer_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_orders_created_at_idx" ON "shopping_orders"("created_at");

-- CreateIndex
CREATE INDEX "shopping_order_goods_shopping_cart_commodity_id_idx" ON "shopping_order_goods"("shopping_cart_commodity_id");

-- CreateIndex
CREATE INDEX "shopping_order_goods_shopping_seller_id_idx" ON "shopping_order_goods"("shopping_seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_order_goods_shopping_order_id_shopping_cart_commod_key" ON "shopping_order_goods"("shopping_order_id", "shopping_cart_commodity_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_order_publishes_shopping_order_id_key" ON "shopping_order_publishes"("shopping_order_id");

-- CreateIndex
CREATE INDEX "shopping_deliveries_shopping_seller_customer_id_created_at_idx" ON "shopping_deliveries"("shopping_seller_customer_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_deliveries_invoice_code_idx" ON "shopping_deliveries"("invoice_code");

-- CreateIndex
CREATE INDEX "shopping_deliveries_created_at_idx" ON "shopping_deliveries"("created_at");

-- CreateIndex
CREATE INDEX "shopping_delivery_pieces_shopping_delivery_id_idx" ON "shopping_delivery_pieces"("shopping_delivery_id");

-- CreateIndex
CREATE INDEX "shopping_delivery_pieces_shopping_order_good_id_idx" ON "shopping_delivery_pieces"("shopping_order_good_id");

-- CreateIndex
CREATE INDEX "shopping_delivery_pieces_shopping_cart_commodity_stock_id_idx" ON "shopping_delivery_pieces"("shopping_cart_commodity_stock_id");

-- CreateIndex
CREATE INDEX "shopping_delivery_journeys_shopping_delivery_id_idx" ON "shopping_delivery_journeys"("shopping_delivery_id");

-- CreateIndex
CREATE INDEX "shopping_coupons_shopping_customer_id_actor_type_idx" ON "shopping_coupons"("shopping_customer_id", "actor_type");

-- CreateIndex
CREATE INDEX "shopping_coupons_name_idx" ON "shopping_coupons"("name");

-- CreateIndex
CREATE INDEX "shopping_coupons_created_at_idx" ON "shopping_coupons"("created_at");

-- CreateIndex
CREATE INDEX "shopping_coupons_opened_at_idx" ON "shopping_coupons"("opened_at");

-- CreateIndex
CREATE INDEX "shopping_coupon_criterias_shopping_coupon_id_idx" ON "shopping_coupon_criterias"("shopping_coupon_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_section_criterias_shopping_section_id_idx" ON "shopping_coupon_section_criterias"("shopping_section_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_channel_criterias_shopping_channel_id_idx" ON "shopping_coupon_channel_criterias"("shopping_channel_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_channel_criterias_shopping_channel_category_idx" ON "shopping_coupon_channel_criterias"("shopping_channel_category_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_seller_criterias_shopping_seller_id_idx" ON "shopping_coupon_seller_criterias"("shopping_seller_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_sale_criterias_shopping_sale_id_idx" ON "shopping_coupon_sale_criterias"("shopping_sale_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_tickets_shopping_customer_id_created_at_idx" ON "shopping_coupon_tickets"("shopping_customer_id", "created_at");

-- CreateIndex
CREATE INDEX "shopping_coupon_tickets_shopping_coupon_id_created_at_idx" ON "shopping_coupon_tickets"("shopping_coupon_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_coupon_tickets_shopping_coupon_disposable_id_key" ON "shopping_coupon_tickets"("shopping_coupon_disposable_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_ticket_payments_shopping_order_id_idx" ON "shopping_coupon_ticket_payments"("shopping_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_coupon_ticket_payments_shopping_coupon_ticket_id_key" ON "shopping_coupon_ticket_payments"("shopping_coupon_ticket_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_disposables_shopping_coupon_id_idx" ON "shopping_coupon_disposables"("shopping_coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_coupon_disposables_code_key" ON "shopping_coupon_disposables"("code");

-- CreateIndex
CREATE INDEX "shopping_deposits_source_idx" ON "shopping_deposits"("source");

-- CreateIndex
CREATE INDEX "shopping_deposits_created_at_idx" ON "shopping_deposits"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_deposits_code_key" ON "shopping_deposits"("code");

-- CreateIndex
CREATE INDEX "shopping_deposit_histories_shopping_deposit_id_created_at_c_idx" ON "shopping_deposit_histories"("shopping_deposit_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_deposit_histories_shopping_deposit_id_source_id_cr_idx" ON "shopping_deposit_histories"("shopping_deposit_id", "source_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_deposit_histories_shopping_citizen_id_created_at_c_idx" ON "shopping_deposit_histories"("shopping_citizen_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_deposit_histories_created_at_cancelled_at_idx" ON "shopping_deposit_histories"("created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_deposit_charges_shopping_customer_id_created_at_de_idx" ON "shopping_deposit_charges"("shopping_customer_id", "created_at", "deleted_at");

-- CreateIndex
CREATE INDEX "shopping_deposit_charges_created_at_deleted_at_idx" ON "shopping_deposit_charges"("created_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_deposit_charge_publishes_shopping_deposit_charge_i_key" ON "shopping_deposit_charge_publishes"("shopping_deposit_charge_id");

-- CreateIndex
CREATE INDEX "shopping_mileages_source_idx" ON "shopping_mileages"("source");

-- CreateIndex
CREATE INDEX "shopping_mileages_created_at_idx" ON "shopping_mileages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_mileages_code_key" ON "shopping_mileages"("code");

-- CreateIndex
CREATE INDEX "shopping_mileage_histories_shopping_mileage_id_created_at_c_idx" ON "shopping_mileage_histories"("shopping_mileage_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_mileage_histories_shopping_mileage_id_source_id_cr_idx" ON "shopping_mileage_histories"("shopping_mileage_id", "source_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_mileage_histories_shopping_citizen_id_created_at_c_idx" ON "shopping_mileage_histories"("shopping_citizen_id", "created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_mileage_histories_created_at_cancelled_at_idx" ON "shopping_mileage_histories"("created_at", "cancelled_at");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiries_shopping_sale_snapshot_id_idx" ON "shopping_sale_snapshot_inquiries"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiries_shopping_customer_id_idx" ON "shopping_sale_snapshot_inquiries"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_reviews_shopping_order_good_id_idx" ON "shopping_sale_snapshot_reviews"("shopping_order_good_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiry_answers_shopping_seller_cust_idx" ON "shopping_sale_snapshot_inquiry_answers"("shopping_seller_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_inquiry_answers_shopping_sale_snapsh_key" ON "shopping_sale_snapshot_inquiry_answers"("shopping_sale_snapshot_inquiry_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiry_comments_shopping_customer_i_idx" ON "shopping_sale_snapshot_inquiry_comments"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_sale_favorites_shopping_customer_id_idx" ON "shopping_sale_favorites"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_sale_favorites_shopping_sale_id_idx" ON "shopping_sale_favorites"("shopping_sale_id");

-- CreateIndex
CREATE INDEX "shopping_sale_favorites_shopping_sale_snapshot_id_idx" ON "shopping_sale_favorites"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiry_favorites_shopping_customer__idx" ON "shopping_sale_snapshot_inquiry_favorites"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_inquiry_favorites_shopping_sale_snap_idx" ON "shopping_sale_snapshot_inquiry_favorites"("shopping_sale_snapshot_inquiry_id");

-- CreateIndex
CREATE INDEX "shopping_address_favorites_shopping_customer_id_idx" ON "shopping_address_favorites"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_address_favorites_shopping_address_id_idx" ON "shopping_address_favorites"("shopping_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "mv_cache_times_schema_table_key_key" ON "mv_cache_times"("schema", "table", "key");

-- CreateIndex
CREATE UNIQUE INDEX "mv_bbs_article_last_snapshots_bbs_article_snapshot_id_key" ON "mv_bbs_article_last_snapshots"("bbs_article_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "mv_shopping_sale_last_snapshots_shopping_sale_snapshot_id_key" ON "mv_shopping_sale_last_snapshots"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE INDEX "mv_shopping_sale_snapshot_prices_real_representative_idx" ON "mv_shopping_sale_snapshot_prices"("real_representative");

-- CreateIndex
CREATE INDEX "mv_shopping_sale_snapshot_prices_real_lowest_real_highest_idx" ON "mv_shopping_sale_snapshot_prices"("real_lowest", "real_highest");

-- CreateIndex
CREATE INDEX "mv_shopping_sale_snapshot_unit_stock_inventories_shopping_s_idx" ON "mv_shopping_sale_snapshot_unit_stock_inventories"("shopping_sale_snapshot_unit_stock_id");

-- CreateIndex
CREATE INDEX "mv_shopping_coupon_citizen_inventories_shopping_coupon_id_idx" ON "mv_shopping_coupon_citizen_inventories"("shopping_coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "mv_shopping_coupon_citizen_inventories_shopping_citizen_id__key" ON "mv_shopping_coupon_citizen_inventories"("shopping_citizen_id", "shopping_coupon_id");

-- AddForeignKey
ALTER TABLE "bbs_article_snapshots" ADD CONSTRAINT "bbs_article_snapshots_bbs_article_id_fkey" FOREIGN KEY ("bbs_article_id") REFERENCES "bbs_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_snapshot_files" ADD CONSTRAINT "bbs_article_snapshot_files_bbs_article_snapshot_id_fkey" FOREIGN KEY ("bbs_article_snapshot_id") REFERENCES "bbs_article_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_snapshot_files" ADD CONSTRAINT "bbs_article_snapshot_files_attachment_file_id_fkey" FOREIGN KEY ("attachment_file_id") REFERENCES "attachment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_comments" ADD CONSTRAINT "bbs_article_comments_bbs_article_id_fkey" FOREIGN KEY ("bbs_article_id") REFERENCES "bbs_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_comments" ADD CONSTRAINT "bbs_article_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "bbs_article_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_comment_snapshots" ADD CONSTRAINT "bbs_article_comment_snapshots_bbs_article_comment_id_fkey" FOREIGN KEY ("bbs_article_comment_id") REFERENCES "bbs_article_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_comment_snapshot_files" ADD CONSTRAINT "bbs_article_comment_snapshot_files_bbs_article_comment_sna_fkey" FOREIGN KEY ("bbs_article_comment_snapshot_id") REFERENCES "bbs_article_comment_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bbs_article_comment_snapshot_files" ADD CONSTRAINT "bbs_article_comment_snapshot_files_attachment_file_id_fkey" FOREIGN KEY ("attachment_file_id") REFERENCES "attachment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_channel_categories" ADD CONSTRAINT "shopping_channel_categories_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_channel_categories" ADD CONSTRAINT "shopping_channel_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "shopping_channel_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_customers" ADD CONSTRAINT "shopping_customers_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_customers" ADD CONSTRAINT "shopping_customers_shopping_member_id_fkey" FOREIGN KEY ("shopping_member_id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_customers" ADD CONSTRAINT "shopping_customers_shopping_external_user_id_fkey" FOREIGN KEY ("shopping_external_user_id") REFERENCES "shopping_external_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_customers" ADD CONSTRAINT "shopping_customers_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_external_users" ADD CONSTRAINT "shopping_external_users_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_external_users" ADD CONSTRAINT "shopping_external_users_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_citizens" ADD CONSTRAINT "shopping_citizens_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_members" ADD CONSTRAINT "shopping_members_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_members" ADD CONSTRAINT "shopping_members_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_member_emails" ADD CONSTRAINT "shopping_member_emails_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_member_emails" ADD CONSTRAINT "shopping_member_emails_shopping_member_id_fkey" FOREIGN KEY ("shopping_member_id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sellers" ADD CONSTRAINT "shopping_sellers_shopping_member_id_fkey" FOREIGN KEY ("shopping_member_id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_administrators" ADD CONSTRAINT "shopping_administrators_shopping_member_id_fkey" FOREIGN KEY ("shopping_member_id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sales" ADD CONSTRAINT "shopping_sales_shopping_section_id_fkey" FOREIGN KEY ("shopping_section_id") REFERENCES "shopping_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sales" ADD CONSTRAINT "shopping_sales_shopping_seller_customer_id_fkey" FOREIGN KEY ("shopping_seller_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshots" ADD CONSTRAINT "shopping_sale_snapshots_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_contents" ADD CONSTRAINT "shopping_sale_snapshot_contents_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_content_files" ADD CONSTRAINT "shopping_sale_snapshot_content_files_shopping_sale_snapsho_fkey" FOREIGN KEY ("shopping_sale_snapshot_content_id") REFERENCES "shopping_sale_snapshot_contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_content_files" ADD CONSTRAINT "shopping_sale_snapshot_content_files_attachment_file_id_fkey" FOREIGN KEY ("attachment_file_id") REFERENCES "attachment_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_tags" ADD CONSTRAINT "shopping_sale_snapshot_tags_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_channels" ADD CONSTRAINT "shopping_sale_snapshot_channels_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_channels" ADD CONSTRAINT "shopping_sale_snapshot_channels_shopping_channel_id_fkey" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_channel_categories" ADD CONSTRAINT "shopping_sale_snapshot_channel_categories_shopping_sale_sn_fkey" FOREIGN KEY ("shopping_sale_snapshot_channel_id") REFERENCES "shopping_sale_snapshot_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_channel_categories" ADD CONSTRAINT "shopping_sale_snapshot_channel_categories_shopping_channel_fkey" FOREIGN KEY ("shopping_channel_category_id") REFERENCES "shopping_channel_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_units" ADD CONSTRAINT "shopping_sale_snapshot_units_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_options" ADD CONSTRAINT "shopping_sale_snapshot_unit_options_shopping_sale_snapshot_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_id") REFERENCES "shopping_sale_snapshot_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_option_candidates" ADD CONSTRAINT "shopping_sale_snapshot_unit_option_candidates_shopping_sal_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_option_id") REFERENCES "shopping_sale_snapshot_unit_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_stocks" ADD CONSTRAINT "shopping_sale_snapshot_unit_stocks_shopping_sale_snapshot__fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_id") REFERENCES "shopping_sale_snapshot_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_stock_choices" ADD CONSTRAINT "fk_shopping_sale_snapshot_unit_stock_choices_stock" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_stock_choices" ADD CONSTRAINT "fk_shopping_sale_snapshot_unit_stock_choices_candidate" FOREIGN KEY ("shopping_sale_snapshot_unit_option_candidate_id") REFERENCES "shopping_sale_snapshot_unit_option_candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_unit_stock_supplements" ADD CONSTRAINT "shopping_sale_snapshot_unit_stock_supplements_shopping_sal_fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_carts" ADD CONSTRAINT "shopping_carts_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodities" ADD CONSTRAINT "shopping_cart_commodities_shopping_cart_id_fkey" FOREIGN KEY ("shopping_cart_id") REFERENCES "shopping_carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodities" ADD CONSTRAINT "shopping_cart_commodities_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stocks" ADD CONSTRAINT "shopping_cart_commodity_stocks_shopping_cart_commodity_id_fkey" FOREIGN KEY ("shopping_cart_commodity_id") REFERENCES "shopping_cart_commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stocks" ADD CONSTRAINT "rel_shopping_cart_commodity_stocks_unit" FOREIGN KEY ("shopping_sale_snapshot_unit_id") REFERENCES "shopping_sale_snapshot_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stocks" ADD CONSTRAINT "rel_shopping_cart_commodity_stocks_stock" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stock_choices" ADD CONSTRAINT "shopping_cart_commodity_stock_choices_shopping_cart_commod_fkey" FOREIGN KEY ("shopping_cart_commodity_stock_id") REFERENCES "shopping_cart_commodity_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stock_choices" ADD CONSTRAINT "rel_shopping_cart_commodity_stock_choices_option" FOREIGN KEY ("shopping_sale_snapshot_unit_option_id") REFERENCES "shopping_sale_snapshot_unit_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_cart_commodity_stock_choices" ADD CONSTRAINT "rel_shopping_cart_commodity_stock_choices_candidate" FOREIGN KEY ("shopping_sale_snapshot_unit_option_candidate_id") REFERENCES "shopping_sale_snapshot_unit_option_candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_orders" ADD CONSTRAINT "shopping_orders_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_orders" ADD CONSTRAINT "shopping_orders_shopping_address_id_fkey" FOREIGN KEY ("shopping_address_id") REFERENCES "shopping_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_order_goods" ADD CONSTRAINT "shopping_order_goods_shopping_order_id_fkey" FOREIGN KEY ("shopping_order_id") REFERENCES "shopping_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_order_goods" ADD CONSTRAINT "shopping_order_goods_shopping_cart_commodity_id_fkey" FOREIGN KEY ("shopping_cart_commodity_id") REFERENCES "shopping_cart_commodities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_order_goods" ADD CONSTRAINT "shopping_order_goods_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_order_publishes" ADD CONSTRAINT "shopping_order_publishes_shopping_order_id_fkey" FOREIGN KEY ("shopping_order_id") REFERENCES "shopping_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deliveries" ADD CONSTRAINT "shopping_deliveries_shopping_seller_customer_id_fkey" FOREIGN KEY ("shopping_seller_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_cart_commodity_stock_id_fkey" FOREIGN KEY ("shopping_cart_commodity_stock_id") REFERENCES "shopping_cart_commodity_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_journeys" ADD CONSTRAINT "shopping_delivery_journeys_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupons" ADD CONSTRAINT "shopping_coupons_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_criterias" ADD CONSTRAINT "shopping_coupon_criterias_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_section_criterias" ADD CONSTRAINT "shopping_coupon_section_criterias_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_coupon_criterias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_section_criterias" ADD CONSTRAINT "shopping_coupon_section_criterias_shopping_section_id_fkey" FOREIGN KEY ("shopping_section_id") REFERENCES "shopping_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_channel_criterias" ADD CONSTRAINT "shopping_coupon_channel_criterias_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_coupon_criterias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_channel_criterias" ADD CONSTRAINT "rel_shopping_coupon_channel_criterias_channel" FOREIGN KEY ("shopping_channel_id") REFERENCES "shopping_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_channel_criterias" ADD CONSTRAINT "rel_shopping_coupon_channel_criterias_category" FOREIGN KEY ("shopping_channel_category_id") REFERENCES "shopping_channel_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_seller_criterias" ADD CONSTRAINT "shopping_coupon_seller_criterias_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_coupon_criterias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_seller_criterias" ADD CONSTRAINT "shopping_coupon_seller_criterias_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_sale_criterias" ADD CONSTRAINT "shopping_coupon_sale_criterias_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_coupon_criterias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_sale_criterias" ADD CONSTRAINT "shopping_coupon_sale_criterias_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_funnel_criterias" ADD CONSTRAINT "shopping_coupon_funnel_criterias_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_coupon_criterias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_tickets" ADD CONSTRAINT "shopping_coupon_tickets_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_tickets" ADD CONSTRAINT "shopping_coupon_tickets_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_tickets" ADD CONSTRAINT "shopping_coupon_tickets_shopping_coupon_disposable_id_fkey" FOREIGN KEY ("shopping_coupon_disposable_id") REFERENCES "shopping_coupon_disposables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_ticket_payments" ADD CONSTRAINT "shopping_coupon_ticket_payments_shopping_coupon_ticket_id_fkey" FOREIGN KEY ("shopping_coupon_ticket_id") REFERENCES "shopping_coupon_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_ticket_payments" ADD CONSTRAINT "shopping_coupon_ticket_payments_shopping_order_id_fkey" FOREIGN KEY ("shopping_order_id") REFERENCES "shopping_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupon_disposables" ADD CONSTRAINT "shopping_coupon_disposables_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_histories" ADD CONSTRAINT "shopping_deposit_histories_shopping_deposit_id_fkey" FOREIGN KEY ("shopping_deposit_id") REFERENCES "shopping_deposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_histories" ADD CONSTRAINT "shopping_deposit_histories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_charges" ADD CONSTRAINT "shopping_deposit_charges_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_deposit_charge_publishes" ADD CONSTRAINT "shopping_deposit_charge_publishes_shopping_deposit_charge__fkey" FOREIGN KEY ("shopping_deposit_charge_id") REFERENCES "shopping_deposit_charges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_mileage_histories" ADD CONSTRAINT "shopping_mileage_histories_shopping_mileage_id_fkey" FOREIGN KEY ("shopping_mileage_id") REFERENCES "shopping_mileages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_mileage_histories" ADD CONSTRAINT "shopping_mileage_histories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiries" ADD CONSTRAINT "shopping_sale_snapshot_inquiries_id_fkey" FOREIGN KEY ("id") REFERENCES "bbs_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiries" ADD CONSTRAINT "shopping_sale_snapshot_inquiries_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiries" ADD CONSTRAINT "shopping_sale_snapshot_inquiries_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiries" ADD CONSTRAINT "shopping_sale_snapshot_inquiries_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_questions" ADD CONSTRAINT "shopping_sale_snapshot_questions_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_sale_snapshot_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_reviews" ADD CONSTRAINT "shopping_sale_snapshot_reviews_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_sale_snapshot_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_reviews" ADD CONSTRAINT "shopping_sale_snapshot_reviews_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_review_snapshots" ADD CONSTRAINT "shopping_sale_snapshot_review_snapshots_id_fkey" FOREIGN KEY ("id") REFERENCES "bbs_article_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_answers" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_answers_id_fkey" FOREIGN KEY ("id") REFERENCES "bbs_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_answers" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_answers_shopping_sale_snaps_fkey" FOREIGN KEY ("shopping_sale_snapshot_inquiry_id") REFERENCES "shopping_sale_snapshot_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_answers" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_answers_shopping_seller_cus_fkey" FOREIGN KEY ("shopping_seller_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_comments" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_comments_id_fkey" FOREIGN KEY ("id") REFERENCES "bbs_article_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_comments" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_comments_shopping_customer__fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_favorites" ADD CONSTRAINT "shopping_sale_favorites_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_customer_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_shopping_sale_sna_fkey" FOREIGN KEY ("shopping_sale_snapshot_inquiry_id") REFERENCES "shopping_sale_snapshot_inquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_favorites" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_favorites_bbs_article_snaps_fkey" FOREIGN KEY ("bbs_article_snapshot_id") REFERENCES "bbs_article_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_address_favorites" ADD CONSTRAINT "shopping_address_favorites_shopping_customer_id_fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_address_favorites" ADD CONSTRAINT "shopping_address_favorites_shopping_address_id_fkey" FOREIGN KEY ("shopping_address_id") REFERENCES "shopping_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" ADD CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_id_fkey" FOREIGN KEY ("bbs_article_id") REFERENCES "bbs_articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_bbs_article_last_snapshots" ADD CONSTRAINT "mv_bbs_article_last_snapshots_bbs_article_snapshot_id_fkey" FOREIGN KEY ("bbs_article_snapshot_id") REFERENCES "bbs_article_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" ADD CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_last_snapshots" ADD CONSTRAINT "mv_shopping_sale_last_snapshots_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_prices" ADD CONSTRAINT "mv_shopping_sale_snapshot_prices_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_sale_snapshot_unit_stock_inventories" ADD CONSTRAINT "mv_shopping_sale_snapshot_unit_stock_inventories_shopping__fkey" FOREIGN KEY ("shopping_sale_snapshot_unit_stock_id") REFERENCES "shopping_sale_snapshot_unit_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_cart_commodity_prices" ADD CONSTRAINT "mv_shopping_cart_commodity_prices_shopping_cart_commodity__fkey" FOREIGN KEY ("shopping_cart_commodity_id") REFERENCES "shopping_cart_commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_good_prices" ADD CONSTRAINT "mv_shopping_order_good_prices_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_order_prices" ADD CONSTRAINT "mv_shopping_order_prices_shopping_order_id_fkey" FOREIGN KEY ("shopping_order_id") REFERENCES "shopping_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_inventories" ADD CONSTRAINT "mv_shopping_coupon_inventories_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" ADD CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_coupon_citizen_inventories" ADD CONSTRAINT "mv_shopping_coupon_citizen_inventories_shopping_coupon_id_fkey" FOREIGN KEY ("shopping_coupon_id") REFERENCES "shopping_coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_deposit_balances" ADD CONSTRAINT "mv_shopping_deposit_balances_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mv_shopping_mileage_balances" ADD CONSTRAINT "mv_shopping_mileage_balances_shopping_citizen_id_fkey" FOREIGN KEY ("shopping_citizen_id") REFERENCES "shopping_citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
