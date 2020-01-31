process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { Product } = require("../models");

chai.use(chaiHttp);

const server = require("../index");

describe("Product API Testing", () => {
  describe("/GET products", () => {
    it("it should GET all products", done => {
      chai
        .request(server)
        .get("/products")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.length).be.equal(0);

          done();
        });
    });
  });

  describe("/POST products", () => {
    it("it should not create product without complete parameters", done => {
      let product = {
        name: "Headphone Rexus",
        price: 35000
      };

      chai
        .request(server)
        .post("/products")
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should create product", done => {
      let product = {
        code: "TS001",
        name: "Headphone Rexus",
        price: 35000,
        stock: 45
      };

      chai
        .request(server)
        .post("/products")
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.name).to.equal(product.name);
          expect(res.body.data.price).to.equal(product.price);
          expect(res.body.data.stock).to.equal(product.stock);

          done();
        });
    });

    it("it should not create product with code that already exists", done => {
      let product = {
        code: "TS001",
        name: "Headphone Rexus",
        price: 35000,
        stock: 45
      };

      chai
        .request(server)
        .post("/products")
        .send(product)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.success).to.equal(false);
          expect(res.body.error).to.equal("Product code already exists");

          done();
        });
    });
  });

  describe("/PUT product", done => {
    let product = {
      code: "TS002",
      name: "Mouse SLEC",
      price: 80000,
      stock: 75
    };

    before(function() {
      // create dummy content for testing update
      Product.create(product);
    });

    it("it should not update product without complete parameter", done => {
      let updateProduct = {
        name: "Mouse SLEC wireless",
        price: 89000
      };

      chai
        .request(server)
        .put(`/products/${product.code}`)
        .send(updateProduct)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should update product", done => {
      let updateProduct = {
        name: "Mouse SLEC wireless",
        price: 89000,
        stock: 20
      };

      chai
        .request(server)
        .put(`/products/${product.code}`)
        .send(updateProduct)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("data");
          expect(res.body.data).to.be.an("object");
          expect(res.body.data.name).to.equal(updateProduct.name);
          expect(res.body.data.price).to.equal(updateProduct.price);
          expect(res.body.data.stock).to.equal(updateProduct.stock);

          done();
        });
    });
  });

  describe("/DELETE product", done => {
    let product = {
      code: "TS004",
      name: "Mousepad Razer",
      price: 80000,
      stock: 75
    };

    before(function() {
      // create dummy content for testing delete api
      Product.create(product);
    });

    it("it should not delete product with invalid code", done => {
      chai
        .request(server)
        .delete("/products/BR9999")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("No product with the given code");

          done();
        });
    });

    it("it should delete product", done => {
      chai
        .request(server)
        .delete(`/products/${product.code}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("success");
          expect(res.body).to.have.property("data");
          expect(res.body.data.code).to.equal(product.code);
          expect(res.body.data.name).to.equal(product.name);
          expect(res.body.data.price).to.equal(product.price);
          expect(res.body.data.stock).to.equal(product.stock);

          done();
        });
    });
  });
});
