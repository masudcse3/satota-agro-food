/** @format */

import { model, Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    image: String,
    type: {
      type: String,
      enum: ["Wholesaler", "Retailer"],
      default: "Wholesaler",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    role: {
      type: String,
      enum: ["Customer"],
      default: "Customer",
    },
  },
  { timestamps: true, id: true }
);

const Customer = model("Customer", customerSchema);

export default Customer;
