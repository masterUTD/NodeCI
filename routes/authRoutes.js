const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'), // si esta la session de google  lo redirecciono a la pagina blogs
    (req, res) => {
      res.redirect('/blogs');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
    // req.logout(() => {
    //   res.redirect('/');
    // }); // provided by passport to close sessions
    
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
