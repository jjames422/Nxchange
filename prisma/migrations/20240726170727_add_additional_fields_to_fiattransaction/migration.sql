-- AlterTable
ALTER TABLE "FiatTransaction" ADD COLUMN     "bicSender" TEXT,
ADD COLUMN     "senderName" TEXT,
ADD COLUMN     "transactionDate" TIMESTAMP(3),
ADD COLUMN     "transactionReferenceNumber" TEXT;
