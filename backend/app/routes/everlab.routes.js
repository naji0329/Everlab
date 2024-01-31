module.exports = app => {
  const everlab_test = require("../controllers/everlab.controller.js");

  var router = require("express").Router();

  router.post("/analyse", everlab_test.analyse);

  app.use('/api/v1', router);
};
