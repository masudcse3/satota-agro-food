/** @format */

import { expect } from "chai";
import request from "supertest";

import app from "../src";

describe("Customer Service", () => {
  describe("GET /customers", () => {
    it("should return all customers", async () => {
      const response = await request(app)
        .get("/customers")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      response.body.forEach((customer: any) => {
        expect(customer).to.have.property("_id");
        expect(customer).to.have.property("name");
        expect(customer).to.have.property("email");
        expect(customer).to.have.property("phone");
        expect(customer).to.have.property("address");
        expect(customer).to.have.property("type");
        expect(customer).to.have.property("status");
      });
    });

    it("should handle empty data", async () => {
      const response = await request(app)
        .get("/customers")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.be.an("array");
      expect(response.body).to.have.length(0);
    });
  });
});
