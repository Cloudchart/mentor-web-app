var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (!req.user) return res.redirect('/login')
  res.render('index', { title: 'Express', user: req.user });
});


router.get('/favorites', function(req, res, next) {
  if (!req.user) return res.redirect('/login')
  if (!req.user.is_active) return res.redirect('/')
  res.render('favorites', { title: 'Favorites' })
})


router.get('/login', function(req, res, next) {
  res.render('login')
})


router.get('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/')
})

module.exports = router;
