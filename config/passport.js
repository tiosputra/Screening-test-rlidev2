let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../models");

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({ email: jwt_payload.email })
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(error => {
          done(error, false);
        });
    })
  );
};
