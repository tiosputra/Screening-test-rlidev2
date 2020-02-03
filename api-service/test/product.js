process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { Product } = require("../models");

chai.use(chaiHttp);

const server = require("../app");

let accessToken = "";

describe("Product API Testing", () => {
  before(done => {
    let user = {
      email: "tiosaputraproduct@gmail.com",
      name: "tio product",
      password: "password"
    };

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
   * Test for get all products
   *  - get all products
   */
  describe("/GET products", () => {
    it("it should GET all products", done => {
      chai
        .request(server)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.data.length).be.equal(0);

          done();
        });
    });
  });

  /**
   * Test for get single product
   *  - get product with invalid code
   *  - get product with valid code
   */
  describe("/GET products/{code}", () => {
    let product = {
      code: "TS005",
      name: "Monitor LG",
      price: 1000000,
      stock: 10
    };
    before(function() {
      // create dummy content for testing get
      Product.create(product);
    });

    it("it should not get product with invalid code", done => {
      chai
        .request(server)
        .get("/api/v1/products/BR9999")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("No product with the given code");

          done();
        });
    });

    it("it should get product with valid code", done => {
      chai
        .request(server)
        .get(`/api/v1/products/${product.code}`)
        .set("Authorization", `Bearer ${accessToken}`)
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
  });

  /**
   * Test for creating prodcts
   *  - create product with incomple parameter
   *  - create product with valid parameter
   *  - create product with code that already exists
   */
  describe("/POST products", () => {
    it("it should not create product without complete parameters", done => {
      let product = {
        name: "Headphone Rexus",
        price: 35000
      };

      chai
        .request(server)
        .post("/api/v1/products")
        .send(product)
        .set("Authorization", `Bearer ${accessToken}`)
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
        .post("/api/v1/products")
        .send(product)
        .set("Authorization", `Bearer ${accessToken}`)
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
        .post("/api/v1/products")
        .send(product)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("Product code already exists");

          done();
        });
    });
  });

  /**
   * TEST for update product
   *  - update product with invalid code
   *  - update product with incomplete parameter
   *  - update product with complete parameter
   */
  describe("/PUT product/{code}", () => {
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

    it("it should not update product with invalid code", done => {
      let updateProduct = {
        name: "Mouse SLEC wireless",
        price: 89000,
        stock: 20
      };

      chai
        .request(server)
        .put("/api/v1/products/BR9999")
        .send(updateProduct)
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("No product with the given code");

          done();
        });
    });

    it("it should not update product without complete parameter", done => {
      let updateProduct = {
        name: "Mouse SLEC wireless",
        price: 89000
      };

      chai
        .request(server)
        .put(`/api/v1/products/${product.code}`)
        .send(updateProduct)
        .set("Authorization", `Bearer ${accessToken}`)
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
        .put(`/api/v1/products/${product.code}`)
        .send(updateProduct)
        .set("Authorization", `Bearer ${accessToken}`)
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

  /**
   * TEST for delete product
   *  - delete product with invalid code
   *  - delete product with valid code
   */
  describe("/DELETE product/{code}", () => {
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
        .delete("/api/v1/products/BR9999")
        .set("Authorization", `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("No product with the given code");

          done();
        });
    });

    it("it should delete product", done => {
      chai
        .request(server)
        .delete(`/api/v1/products/${product.code}`)
        .set("Authorization", `Bearer ${accessToken}`)
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
