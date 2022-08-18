const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const User = require('../models/User')

passport.serializeUser((user, done) => { // serializa al usuario en una session con el id  en el navegador
  done(null, user.id);
});

passport.deserializeUser((id, done) => { // lo deserializa por cada pagina que navegue para comprobar si esta loggiado ,, me envia de vuelta el id a mi servidor para comprobar si el usuario es valido ,, y me crea el req.user creo
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    { //los que envia del frontend con google strategy
      callbackURL: 'http://localhost:3000/auth/google/callback',
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => { // backend // aca lo agarra el backend osea el profile es lo que envia el frontend con google
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser); 
        }
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName
        }).save()
        done(null, user); // cuando se ejecuta esta funcion done, pasa a passport.serializeUser donde agarra el user.id
      } catch (err) { 
        done(err, null);
      }
    }
  )
);
