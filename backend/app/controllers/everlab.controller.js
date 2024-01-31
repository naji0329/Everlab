const Diagnostic = require("../models/everlab.model.js");

exports.analyse = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  Diagnostic.analyse(req.body.data, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while analysing data."
      });
    else res.send(data);
  });
};