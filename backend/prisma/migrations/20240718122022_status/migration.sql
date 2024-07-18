/*
  Warnings:

  - You are about to drop the column `pending` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('Pending', 'Completed', 'Cancelled');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "pending",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'Pending';
