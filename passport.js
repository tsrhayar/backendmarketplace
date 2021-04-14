const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;

const User = require("./models/User");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "TahaSrhayarSecret",
    },
    (payload, done) => {
      // sub = subject
      User.findById({ _id: payload.sub }, (err, user) => {
        // si (erreur)
        if (err) return done(err, false);
        if (user) return done(null, user);
        else return done(null, false);
      });
    }
  )
);

// authentification
// authenticated local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      // en cas d'erreur dans la bbase donnes
      // something went wrong with database
      if (err) return done(err);

      // en cas pas de user return erreur => null, et done => false
      // if no user exist
      if (!user) return done(null, false);

      // en cas user exit comparer motdepasse
      // check if password is correct
      user.comparePassword(password, done);
    });
  })
);
