/*
  Warnings:

  - You are about to drop the column `ratingId` on the `feedback_staff` table. All the data in the column will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `feedback_staff` DROP FOREIGN KEY `feedback_staff_ratingId_fkey`;

-- DropIndex
DROP INDEX `feedback_staff_ratingId_fkey` ON `feedback_staff`;

-- AlterTable
ALTER TABLE `feedback_staff` DROP COLUMN `ratingId`;

-- DropTable
DROP TABLE `ratings`;
