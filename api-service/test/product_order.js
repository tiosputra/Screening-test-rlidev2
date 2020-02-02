process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const { Order, User, Product, ProductOrder } = require("../models");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../app");

let user = {
  email: "tioorderproductemail@gmail.com",
  name: "tio order product",
  password: "password"
};
let accessToken = "";

describe("ProductOrder API Testing", () => {
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

  /**
   * Test for getting single product_order by orderId and productId
   */
  describe("GET /orders/{orderId}/products/{productOrderId}", () => {
    let order = null;
    let product = null;
    let productOrder = null;

    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });

      order = await Order.create({ userId: findUser.id });

      product = await Product.create({
        code: "TS045",
        name: "Keyboard Lenovo (i am a product in product_order test)",
        price: 70000,
        stock: 89
      });

      productOrder = await ProductOrder.create({
        orderId: order.id,
        quanity: 2,
        productId: product.id
      });
    });

    it("it should not get productOrder with wrong order id", done => {
      chai
        .request(server)
        .get(`/api/v1/orders/787/products/${productOrder.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("order with id not found");

          done();
        });
    });

    it("it should not get productOrder with wrong productId", done => {
      chai
        .request(server)
        .get(`/api/v1/orders/${order.id}/products/456`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal(
            "product_order not found with the given productOrderId"
          );

          done();
        });
    });

    it("it should get productOrder with valid parameters", done => {
      chai
        .request(server)
        .get(`/api/v1/orders/${order.id}/products/${productOrder.id}`)
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

  /**
   * Test for create product_order in order by orderId
   */
  describe("POST /orders/{orderId}/products", () => {
    let order = null;
    let product = null;
    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });

      order = await Order.create({ userId: findUser.id });

      product = await Product.create({
        code: "BR009",
        name: "product order test",
        price: 25000,
        stock: 56
      });
    });

    it("it should not create productOrder with wrong order id", done => {
      chai
        .request(server)
        .post("/api/v1/orders/43/products")
        .send({
          productId: product.id,
          quantity: 5
        })
        .set("Authorization", `Bearer ${accessToken}`)

        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("order with id not found");

          done();
        });
    });

    it("it should not create productOrder with incomplete parameters", done => {
      chai
        .request(server)
        .post(`/api/v1/orders/${order.id}/products`)
        .send({ productId: product.id })
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should create productOrder with valid request", done => {
      chai
        .request(server)
        .post(`/api/v1/orders/${order.id}/products`)
        .send({ productId: product.id, quantity: 5 })
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

  /**
   * Test for update product_order in order by
   */
  describe("PUT /orders/{orderId}/products/{productOrderId}", () => {
    let order = null;
    let product = null;
    let productOrder = null;
    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });

      order = await Order.create({ userId: findUser.id });

      product = await Product.create({
        code: "TS9877",
        name: "ASUS Charger",
        price: 45000,
        stock: 89
      });

      productOrder = await ProductOrder.create({
        orderId: order.id,
        quanity: 7,
        productId: product.id
      });
    });

    it("it should not update productOrder with wrong order id", done => {
      chai
        .request(server)
        .put(`/api/v1/orders/787/products/${productOrder.id}`)
        .send({ quantity: 5 })
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("order with id not found");

          done();
        });
    });

    it("it should not update productOrder with wrong productOrderId", done => {
      chai
        .request(server)
        .put(`/api/v1/orders/${order.id}/products/678`)
        .send({ quantity: 5 })
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal(
            "productOrder with id doesn't exists"
          );

          done();
        });
    });

    it("it should not update productOrder with incomplete parameters", done => {
      chai
        .request(server)
        .put(`/api/v1/orders/${order.id}/products/${productOrder.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should update productOrder with valid request", done => {
      chai
        .request(server)
        .put(`/api/v1/orders/${order.id}/products/${productOrder.id}`)
        .send({ quantity: 5 })
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          expect(res.body.success).to.equal(true);

          done();
        });
    });
  });

  /**
   * Test for delete product_order in order by
   */
  describe("DELETE /orders/{orderId}/products/{productOrderId}", () => {
    let order = null;
    let product = null;
    let productOrder = null;
    before(async function() {
      const findUser = await User.findOne({ where: { email: user.email } });

      order = await Order.create({ userId: findUser.id });

      product = await Product.create({
        code: "BR078",
        name: "RAM 5 GB",
        price: 1000000,
        stock: 50
      });

      productOrder = await ProductOrder.create({
        orderId: order.id,
        quanity: 90,
        productId: product.id
      });
    });

    it("it should not delete productOrder with invalid orderId", done => {
      chai
        .request(server)
        .delete(`/api/v1/orders/787/products/${productOrder.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("order with id not found");

          done();
        });
    });

    it("it should not delete productOrder with invalid productOrderId", done => {
      chai
        .request(server)
        .delete(`/api/v1/orders/${order.id}/products/4234`)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal(
            "productOrder with id doesn't exists"
          );

          done();
        });
    });

    it("it should delete productOrder with valid request", done => {
      chai
        .request(server)
        .delete(`/api/v1/orders/${order.id}/products/${productOrder.id}`)
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
});
