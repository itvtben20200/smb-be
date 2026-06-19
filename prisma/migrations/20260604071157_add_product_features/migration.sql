-- CreateEnum
CREATE TYPE "PortalContext" AS ENUM ('MICROSOFT_STACK_PORTAL', 'SOVEREIGN_STACK_PORTAL');

-- CreateEnum
CREATE TYPE "StackContext" AS ENUM ('MICROSOFT', 'OPEN_SOVEREIGN');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'DEMO_BOOKED', 'OFFER_REQUESTED', 'CONVERTED', 'DISQUALIFIED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DemoType" AS ENUM ('INTRO_DEMO', 'INDUSTRY_DEMO', 'TECHNICAL_DEMO', 'CONFIGURATION_DEMO', 'EXECUTIVE_DEMO');

-- CreateEnum
CREATE TYPE "DemoBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "features" TEXT[];

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "portal_context" "PortalContext" NOT NULL,
    "stack_context" "StackContext" NOT NULL,
    "industry_context" VARCHAR(100),
    "product_context" VARCHAR(100),
    "company_name" VARCHAR(200) NOT NULL,
    "company_size" VARCHAR(50),
    "country" VARCHAR(100),
    "contact_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "message" TEXT,
    "lead_source" VARCHAR(100),
    "utm_source" VARCHAR(200),
    "utm_medium" VARCHAR(200),
    "utm_campaign" VARCHAR(200),
    "consent_given" BOOLEAN NOT NULL DEFAULT false,
    "lead_status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "correlation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_bookings" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT,
    "demo_type" "DemoType" NOT NULL,
    "solution_interest" VARCHAR(200),
    "selected_slot" TIMESTAMP(3),
    "timezone" VARCHAR(100),
    "preferred_language" VARCHAR(10),
    "portal_context" "PortalContext" NOT NULL,
    "stack_context" "StackContext" NOT NULL,
    "product_context" VARCHAR(100),
    "status" "DemoBookingStatus" NOT NULL DEFAULT 'PENDING',
    "correlation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demo_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_email_idx" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_portal_context_lead_status_idx" ON "leads"("portal_context", "lead_status");

-- CreateIndex
CREATE INDEX "leads_correlation_id_idx" ON "leads"("correlation_id");

-- CreateIndex
CREATE INDEX "demo_bookings_lead_id_idx" ON "demo_bookings"("lead_id");

-- CreateIndex
CREATE INDEX "demo_bookings_portal_context_status_idx" ON "demo_bookings"("portal_context", "status");

-- CreateIndex
CREATE INDEX "demo_bookings_selected_slot_idx" ON "demo_bookings"("selected_slot");

-- AddForeignKey
ALTER TABLE "demo_bookings" ADD CONSTRAINT "demo_bookings_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
