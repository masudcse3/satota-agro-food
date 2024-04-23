/** @format */
import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const deleteStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stockId = req.params.stockId;
    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found to delete." });
    }
    await prisma.stock.delete({ where: { id: stockId } });
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (err) {
    next(err);
  }
};
export default deleteStock;
