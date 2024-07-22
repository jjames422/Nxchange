/*
  Warnings:

  - Added the required column `exchangeFee` to the `CryptoTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasFee` to the `CryptoTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankAccount" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CryptoTransaction" ADD COLUMN     "exchangeFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gasFee" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FiatTransaction" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SWIFTTransfer" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "updatedAt" DROP DEFAULT;
