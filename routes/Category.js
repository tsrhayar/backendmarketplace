const express = require("express");
const categoryRouter = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Category = require("../models/Category");

// create todo
categoryRouter.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (req.user.role === "superadmin" || req.user.role === "admin" || req.user.role === "seller") {
    const category = new Category(req.body);
    category.save((err) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.save((err) => {
          if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
          else
            res.status(200).json({ message: { msgBody: "Successfully created", msgError: false } });
        });
      }
    });
  } else {
    res.status(401).json({ message: { msgBody: "not authorized to add", msgError: true } });
  }
});

// read todo of this user
categoryRouter.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { _id } = req.body;
  Category.findById(_id)
    .populate("products")
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        res.status(200).json({ todos: document.todos, authenticated: true });
      }
    });
});

module.exports = categoryRouter;
