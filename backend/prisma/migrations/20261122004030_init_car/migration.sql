-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "registration_number" VARCHAR(20) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "year" INTEGER,
    "color" VARCHAR(30),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cars_brand_idx" ON "cars"("brand");

-- CreateIndex
CREATE UNIQUE INDEX "cars_registration_number_province_key" ON "cars"("registration_number", "province");
