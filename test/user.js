const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const { User } = require("../models");

const server = require("../index");

chai.use(chaiHttp);

describe("User API", () => {
  // TEST for user registration
  describe("/POST register", () => {
    it("it should not successfuly register without complete  parameter", done => {
      let user = {
        email: "karya.tiosaputra@gmail.com",
        name: "tio"
      };

      chai
        .request(server)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("success");
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.have.lengthOf.above(0);

          done();
        });
    });

    it("it should successfuly register", done => {
      let user = {
        email: "karya.tiosaputra@gmail.com",
        name: "tio",
        password: "passwordku"
      };

      chai
        .request(server)
        .post("/users/register")
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

          done();
        });
    });

    it("it should not successfuly register with already exists email", done => {
      let user = {
        email: "karya.tiosaputra@gmail.com",
        name: "tio",
        password: "passwordku"
      };

      chai
        .request(server)
        .post("/users/register")
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property("success");
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Email already exists");

          done();
        });
    });
  });

  // TEST for user authentication(login)
  describe("/POST login", () => {
    before(() => {
      // dummy data for login api
      User.create({
        email: "login@test.com",
        name: "login test",
        password: "$2a$10$KqW/u4AnJorCr3lzCEP9DugIRkzG6lgryJEgbozlVIaUFtFWq9mf." // hash for : password
      });
    });

    it("it should not successfully login without complete paramter", done => {
      let credential = {
        email: "karya.tiosaputra@gmail.com"
      };

      chai
        .request(server)
        .post("/users/login")
        .send(credential)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.property("error");

          done();
        });
    });

    it("it should not successfuly login user with non exists email", done => {
      let credential = {
        email: "wrongemail@gmail.com",
        password: "password"
      };

      chai
        .request(server)
        .post("/users/login")
        .send(credential)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("success");
          expect(res.body).to.have.property("message");
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal("Email didn't exists");

          done();
        });
    });

    it("it should not successfuly login user with wrong password", done => {
      let credential = {
        email: "karya.tiosaputra@gmail.com",
        password: "wrongpassword"
      };

      chai
        .request(server)
        .post("/users/login")
        .send(credential)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property("message");
          expect(res.body.message).to.equal("Wrong password");

          done();
        });
    });

    it("it should successfuly login user", done => {
      let credential = {
        email: "karya.tiosaputra@gmail.com",
        password: "passwordku"
      };

      chai
        .request(server)
        .post("/users/login")
        .send(credential)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          expect(res.body).to.have.property("accessToken");

          done();
        });
    });
  });
});
