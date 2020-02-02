process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { Order, User } = require("../models");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../app");

let user = {
  email: "tioorderemail@gmail.com",
  name: "tio order",
  password: "password"
};
let accessToken = "";

describe("Orders API Testing", () => {
  before(done => {
    chai
      .request(server)
      .post("/api/v1/users/register")
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success");
        expect(res.body.data).to.have.property("accessToken");
        expect(res.body.data).to.have.property("name");
        expect(res.body.data).to.have.property("email");
        expect(res.body.success).to.equal(true);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.name).to.equal(user.name);

        accessToken = res.body.data.accessToken;

        done();
      });
  });

  describe("GET /orders", () => {
    it("it should get all orders", done => {
      chai
        .request(server)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.length).be.equal(0);

          done();
        });
    });
  });

  describe("GET /orders/{id}", () => {
    let order = null;

    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });
      order = await Order.create({ userId: findUser.id });
    });

    it("it should not get order with invalid id", done => {
      chai
        .request(server)
        .get("/api/v1/orders/123")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          if (err) done(err);

          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should get order with valid id", done => {
      chai
        .request(server)
        .get(`/api/v1/orders/${order.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          expect(res.body).to.have.property("data");
          expect(res.body.data.id).to.equal(order.id);
          expect(res.body.data.userId).to.equal(order.userId);

          done();
        });
    });
  });

  describe("POST /orders", () => {
    it("it should create order", done => {
      chai
        .request(server)
        .post(`/api/v1/orders`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          expect(res.body).to.have.property("data");
          expect(res.body.success).to.equal(true);

          done();
        });
    });
  });

  describe("DELETE /orders/{id}", () => {
    let order = null;

    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });

      order = await Order.create({ userId: findUser.id });
    });

    it("it should not delete order with invalid order id", done => {
      chai
        .request(server)
        .delete(`/api/v1/orders/6868`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("order with id not exists");

          done();
        });
    });

    it("it should delete order with valid order id", done => {
      chai
        .request(server)
        .delete(`/api/v1/orders/${order.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          expect(res.body).to.have.property("data");
          expect(res.body.success).to.equal(true);
          expect(res.body.data.userId).to.equal(order.userId);

          done();
        });
    });
  });
});
