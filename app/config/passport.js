const LocalStratergy = require("passport-local").Strategy;
const { User } = require("../models/User/user");
const bcrypt = require("bcryptjs");

function init(passport) {
  passport.use(
    new LocalStratergy(
      { usernameField: 'email' },
      async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "No user with this email" });
        }

        bcrypt
          .compare(password, user.password1)
          .then((match) => {
            if (match) {
              return done(null, user, { message: "Logged in succesfully" });
            }
            return done(null, false, { message: "Wrong username or password" });
          })
          .catch((err) => {
            return done(null, false, { message: "Something went wrong" });
          });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
