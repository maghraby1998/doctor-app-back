/*
  Warnings:

  - Added the required column `weekends` to the `offices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offices` ADD COLUMN `weekends` VARCHAR(191) NOT NULL;
