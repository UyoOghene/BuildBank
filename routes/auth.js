const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username });
  await User.register(user, password);
  res.redirect('/login');
});

router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/projects'
}));

// Change this to POST method to match your form submission
router.post('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

// Keep this GET route as well for flexibility
router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

module.exports = router;