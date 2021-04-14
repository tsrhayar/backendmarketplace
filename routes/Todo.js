const express = require("express");
const todoRouter = express.Router();
const passport = require("passport");
const User = require("../models/User");
const Todo = require("../models/Todo");

// create todo
todoRouter.post("/todo", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (req.user.role !== "user") {
    const todo = new Todo(req.body);
    todo.save((err) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.todos.push(todo);
        req.user.save((err) => {
          if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
          else
            res
              .status(200)
              .json({ message: { msgBody: "Successfully created todo", msgError: false } });
        });
      }
    });
  } else {
    res.status(401).json({ message: { msgBody: "not authorized to add", msgError: true } });
  }
});

// read todo of this user
todoRouter.get("/todo", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findById({ _id: req.user._id })
    .populate("todos")
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        res.status(200).json({ todos: document.todos, authenticated: true });
      }
    });
});

// read todo of this user
todoRouter.get("/todoo", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findById({ _id: req.user._id })
    .populate("products")
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        res.status(200).json({ products: document.todos, authenticated: true });
      }
    });
});

module.exports = todoRouter;
