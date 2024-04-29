/** @format */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  bulkProductCreate,
  productDetails,
} from "@/controllers";

dotenv.config();
import "./receiveEvents";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/products/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

// handle routes
app.get("/products/:productId", productDetails);
app.patch("/products/:productId", updateProduct);
app.delete("/products/:productId", deleteProduct);
app.post("/products", createProduct);
app.get("/products", getProducts);

app.post("/products/bulk", bulkProductCreate);
// 404 Error Hnadler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});
// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "PrismaClientKnownRequestError") {
    console.log(err.stack);
    return res.status(403).json({ message: "Bad request" });
  }
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const port = process.env.PORT || 4000;
const service_name = process.env.SERVICE_NAME || "product";

app.listen(port, () => {
  console.log(`Server running on port ${port} for ${service_name} service`);
});
