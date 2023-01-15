const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport'); // para que mi servidor sepa que estoy usando passport // googleoauth
// solo ejecuta el servicio de passport
require('./services/cache')


mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {  useNewUrlParser: true }).then((db) => {
  console.log(`database is connected`)
})
.catch(error => console.log(`an Error has ocurred`))
 

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Middlewares
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);


app.use(passport.initialize()); // para inicializar passport
app.use(passport.session()); // para que passport almacene las sesiones dentro del navegador

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);
require('./routes/uploadRoutes')(app);

if (['production', 'ci'].includes(process.env.NODE_ENV)) { // cuando este en produccion
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
