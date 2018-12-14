var path           = require('path'),
    router         = require('express').Router(),
    express        = require('express');

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../../app/index.html'));
});

router.get('/game', function (req, res) {
  res.sendFile(path.join(__dirname, '../../app/index.html'));
});

router.get('/prompt', function (req, res) {
  res.sendFile(path.join(__dirname, '../../app/index.html'));
});

router.get('/meme-selection', function (req, res) {
  res.sendFile(path.join(__dirname, '../../app/index.html'));
});

router.get('/game/:id', function (req, res) {
  res.sendFile(path.join(__dirname, '../../app/index.html'));
});

router.post("/urlgenerator", (req, res) => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return res.send({"unique_session_id" : text})
});

module.exports = router;
