/** @format */

import { Request, Response, NextFunction } from "express";
import { Customer } from "@/model";
import { changePasswordSchema } from "@/schemas";
import bcryptjs from "bcryptjs";

const changePassword = async (
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
    const password = customerExists.password || "";
    const parseData = changePasswordSchema.safeParse(req.body);
    if (!parseData.success) {
      return res
        .status(422)
        .json({ message: "Validation failed", error: parseData.error.errors });
    }
    const { oldPassword, newPassword } = parseData.data as {
      oldPassword: string;
      newPassword: string;
    };
    // verify old password
    const isMatch = await bcryptjs.compare(oldPassword, password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    const payload = {
      password: hashedPassword,
    };
    await Customer.findByIdAndUpdate(id, payload, {
      new: true,
    });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    next(error);
  }
};

export default changePassword;
