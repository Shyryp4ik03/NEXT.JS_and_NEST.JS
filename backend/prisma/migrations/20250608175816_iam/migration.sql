-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "security_level" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "last_check" DATE NOT NULL,

    CONSTRAINT "build_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
