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
    "created_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "shopping_sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_administrators" (
    "id" UUID NOT NULL,
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
    "shopping_seller_id" UUID NOT NULL,
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
    "tax" DOUBLE PRECISION NOT NULL,
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
CREATE TABLE "shopping_carts" (
    "id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL,

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
    "shopping_seller_id" UUID NOT NULL,
    "invoice_code" VARCHAR,

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
    "state" VARCHAR NOT NULL,
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
    "shopping_administrator_id" UUID,
    "shopping_seller_id" UUID,
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
    "shopping_sale_snapshot_id" UUID NOT NULL,
    "shopping_customer_id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
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
    "shopping_seller_id" UUID NOT NULL,

    CONSTRAINT "shopping_sale_snapshot_inquiry_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shopping_sale_snapshot_inquiry_comments" (
    "id" UUID NOT NULL,
    "shopping_seller_id" UUID,
    "shopping_customer_id" UUID,

    CONSTRAINT "shopping_sale_snapshot_inquiry_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channels_code_key" ON "shopping_channels"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channels_name_key" ON "shopping_channels"("name");

-- CreateIndex
CREATE INDEX "shopping_channel_categories_parent_id_name_idx" ON "shopping_channel_categories"("parent_id", "name");

-- CreateIndex
CREATE INDEX "shopping_channel_categories_name_idx" ON "shopping_channel_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_channel_categories_shopping_channel_id_parent_id_n_key" ON "shopping_channel_categories"("shopping_channel_id", "parent_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sections_code_key" ON "shopping_sections"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sections_name_key" ON "shopping_sections"("name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_external_users_application_uid_key" ON "shopping_external_users"("application", "uid");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_external_users_application_nickname_key" ON "shopping_external_users"("application", "nickname");

-- CreateIndex
CREATE INDEX "shopping_addresses_mobile_idx" ON "shopping_addresses"("mobile");

-- CreateIndex
CREATE INDEX "shopping_addresses_name_idx" ON "shopping_addresses"("name");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_contents_title_idx" ON "shopping_sale_snapshot_contents"("title");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_contents_shopping_sale_snapshot_id_key" ON "shopping_sale_snapshot_contents"("shopping_sale_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_channels_shopping_sale_snapshot_id_s_key" ON "shopping_sale_snapshot_channels"("shopping_sale_snapshot_id", "shopping_channel_id");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_channel_categories_shopping_channel__idx" ON "shopping_sale_snapshot_channel_categories"("shopping_channel_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_channel_categories_shopping_sale_sna_key" ON "shopping_sale_snapshot_channel_categories"("shopping_sale_snapshot_channel_id", "shopping_channel_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_options_shopping_sale_snapshot__key" ON "shopping_sale_snapshot_unit_options"("shopping_sale_snapshot_unit_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_option_candidates_shopping_sale_key" ON "shopping_sale_snapshot_unit_option_candidates"("shopping_sale_snapshot_unit_option_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_stocks_shopping_sale_snapshot_u_key" ON "shopping_sale_snapshot_unit_stocks"("shopping_sale_snapshot_unit_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_sale_snapshot_unit_stock_choices_shopping_sale_sna_key" ON "shopping_sale_snapshot_unit_stock_choices"("shopping_sale_snapshot_unit_stock_id", "shopping_sale_snapshot_unit_option_candidate_id");

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
CREATE INDEX "shopping_order_goods_shopping_order_id_idx" ON "shopping_order_goods"("shopping_order_id");

-- CreateIndex
CREATE INDEX "shopping_order_goods_shopping_cart_commodity_id_idx" ON "shopping_order_goods"("shopping_cart_commodity_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_order_publishes_shopping_order_id_key" ON "shopping_order_publishes"("shopping_order_id");

-- CreateIndex
CREATE INDEX "shopping_coupons_shopping_administrator_id_idx" ON "shopping_coupons"("shopping_administrator_id");

-- CreateIndex
CREATE INDEX "shopping_coupons_shopping_seller_id_idx" ON "shopping_coupons"("shopping_seller_id");

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
CREATE INDEX "shopping_coupon_tickets_shopping_customer_id_idx" ON "shopping_coupon_tickets"("shopping_customer_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_tickets_shopping_coupon_id_idx" ON "shopping_coupon_tickets"("shopping_coupon_id");

-- CreateIndex
CREATE INDEX "shopping_coupon_tickets_shopping_coupon_disposable_id_idx" ON "shopping_coupon_tickets"("shopping_coupon_disposable_id");

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
CREATE UNIQUE INDEX "shopping_deposits_code_key" ON "shopping_deposits"("code");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_deposit_charge_publishes_shopping_deposit_charge_i_key" ON "shopping_deposit_charge_publishes"("shopping_deposit_charge_id");

-- CreateIndex
CREATE UNIQUE INDEX "shopping_mileages_code_key" ON "shopping_mileages"("code");

-- CreateIndex
CREATE INDEX "shopping_sale_snapshot_reviews_shopping_order_good_id_idx" ON "shopping_sale_snapshot_reviews"("shopping_order_good_id");

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
ALTER TABLE "shopping_sellers" ADD CONSTRAINT "shopping_sellers_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_administrators" ADD CONSTRAINT "shopping_administrators_id_fkey" FOREIGN KEY ("id") REFERENCES "shopping_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sales" ADD CONSTRAINT "shopping_sales_shopping_section_id_fkey" FOREIGN KEY ("shopping_section_id") REFERENCES "shopping_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sales" ADD CONSTRAINT "shopping_sales_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshots" ADD CONSTRAINT "shopping_sale_snapshots_shopping_sale_id_fkey" FOREIGN KEY ("shopping_sale_id") REFERENCES "shopping_sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_contents" ADD CONSTRAINT "shopping_sale_snapshot_contents_shopping_sale_snapshot_id_fkey" FOREIGN KEY ("shopping_sale_snapshot_id") REFERENCES "shopping_sale_snapshots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "shopping_deliveries" ADD CONSTRAINT "shopping_deliveries_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_order_good_id_fkey" FOREIGN KEY ("shopping_order_good_id") REFERENCES "shopping_order_goods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_pieces" ADD CONSTRAINT "shopping_delivery_pieces_shopping_cart_commodity_stock_id_fkey" FOREIGN KEY ("shopping_cart_commodity_stock_id") REFERENCES "shopping_cart_commodity_stocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_delivery_journeys" ADD CONSTRAINT "shopping_delivery_journeys_shopping_delivery_id_fkey" FOREIGN KEY ("shopping_delivery_id") REFERENCES "shopping_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupons" ADD CONSTRAINT "shopping_coupons_shopping_administrator_id_fkey" FOREIGN KEY ("shopping_administrator_id") REFERENCES "shopping_administrators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_coupons" ADD CONSTRAINT "shopping_coupons_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "shopping_sale_snapshot_inquiry_answers" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_answers_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_comments" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_comments_id_fkey" FOREIGN KEY ("id") REFERENCES "bbs_article_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_comments" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_comments_shopping_seller_id_fkey" FOREIGN KEY ("shopping_seller_id") REFERENCES "shopping_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shopping_sale_snapshot_inquiry_comments" ADD CONSTRAINT "shopping_sale_snapshot_inquiry_comments_shopping_customer__fkey" FOREIGN KEY ("shopping_customer_id") REFERENCES "shopping_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
