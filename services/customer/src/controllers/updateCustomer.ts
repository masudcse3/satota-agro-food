/** @format */

import { Request, Response, NextFunction } from "express";
import { Customer } from "@/model";
import { updateCustomerSchema } from "@/schemas";
import bcryptjs from "bcryptjs";

const updateCustomer = async (
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
    const parseData = updateCustomerSchema.safeParse(req.body);
    if (!parseData.success) {
      return res
        .status(422)
        .json({ message: "Validation failed", error: parseData.error.errors });
    }
    const { name, email, phone, address, image, type, status } = parseData.data;
    // hash the password

    console.log({ name, email, address, image, type });

    const payload = {
      name: name || customerExists.name,
      phone: phone || customerExists.phone,
      email: email || customerExists.email,
      address: address || customerExists.address,
      image: image || customerExists.image,
      type: type || customerExists.type,
      status: status || customerExists.status,
    };
    const updatedCustomer = await Customer.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.status(200).json({ data: updatedCustomer });
  } catch (error) {
    next(error);
  }
};

export default updateCustomer;
