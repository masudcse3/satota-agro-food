/** @format */

import { Request, Response, NextFunction } from "express";
import { Customer } from "@/model";

const deleteCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const customerExists = await Customer.findOne({ _id: id });
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await Customer.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
};

export default deleteCustomer;
