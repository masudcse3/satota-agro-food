/*
  Warnings:

  - Added the required column `currentStock` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "currentStock" INTEGER NOT NULL;
