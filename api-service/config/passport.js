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
      User.findOne({ where: { id: jwt_payload.id } })
        .then(user => {
          if (!user) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        })
        .catch(error => {
          done(error, false);
        });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};
