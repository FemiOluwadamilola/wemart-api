const request = require("supertest");
const app = require("../app");

describe("Wemart API", () => {
  describe("Vendor Authentication", () => {
    describe("given vendor password or email is incorrect or not vaild", () => {
      it("should return a 403 status code and a message", async () => {
        const vendor = {
          email: "failed@gmail.com",
          password: "password",
        };
        await request(app)
          .post("/api/vendors/signin")
          .send(vendor)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(403);
      });
    });

    describe("given vendor password or email is missing", () => {
      it("should return a 403 status code and a message", async () => {
        const vendors = [
          {
            email: "",
            password: "password",
          },
          {
            email: "test@gmail.com",
            password: "",
          },
        ];

        await request(app)
          .post("/api/vendors/signin")
          .send(vendors)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(403);
      });
    });
  });

  // describe("Products", () => {
  //   describe("Get ");
  // });
});
