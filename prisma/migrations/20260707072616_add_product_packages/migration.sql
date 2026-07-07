-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "package_id" TEXT,
ADD COLUMN     "package_name" VARCHAR(200);

-- CreateTable
CREATE TABLE "product_packages" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "subtitle" VARCHAR(500),
    "features" TEXT[],
    "implementation_weeks" INTEGER NOT NULL DEFAULT 2,
    "price" DECIMAL(12,2) NOT NULL,
    "badge" VARCHAR(100),
    "recommended" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_packages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_packages_product_id_sort_order_idx" ON "product_packages"("product_id", "sort_order");

-- AddForeignKey
ALTER TABLE "product_packages" ADD CONSTRAINT "product_packages_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "product_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
