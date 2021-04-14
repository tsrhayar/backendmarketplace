const express = require("express");
const productRouter = express.Router();
const passport = require("passport");
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const path = require("path");

// create by seller
productRouter.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { name, description, image, price, category } = req.body;

  const product = new Product({
    name,
    description,
    image: path.parse(image).base,
    price,
    category,
    seller: req.user._id,
  });

  product.save((err) => {
    if (err) {
      res.status(500).json({ message: { msgBody: "Error has occured1", msgError: true } });
      console.log(err);
    } else {
      product.save((err) => {
        if (err)
          res.status(500).json({ message: { msgBody: "Error has occured2", msgError: true } });
        else
          res
            .status(200)
            .json({ message: { msgBody: "Successfully created product", msgError: false } });
      });
    }
  });
});

//delete product
productRouter.post(
  "/deleteproduct/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "seller") {
      Product.findByIdAndDelete(req.params.id, (err, result) => {
        if (err)
          return res
            .status(500)
            .send({ message: { msgBody: "Error has occured", msgError: true, err } });
        return res
          .status(200)
          .send({ message: { msgBody: "Product successfully deleted", msgError: false } });
      });
    } else {
      res.send({ message: "Not Authorized" });
    }
  }
);

// get all product of categorie
productRouter.get("/c", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { category } = req.body;
  Product.find({ category })
    .populate("category")
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else res.status(200).json({ category: document, authenticated: true });
    });
});

// get all product
productRouter.get("/", (req, res) => {
  Product.find().exec((err, document) => {
    if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    else res.status(200).json({ products: document, authenticated: true });
  });
});

// get all product of this seller
productRouter.get(
  "/productthisseller",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "seller") {
      Product.find({ seller: req.user._id }).exec((err, document) => {
        if (err)
          res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else res.status(200).json({ products: document, authenticated: true });
      });
    }
  }
);

// low to higth
productRouter.get("/bypricelth", (req, res) => {
  Product.find()
    .sort({ price: 1 })
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else res.status(200).json({ products: document, authenticated: true });
    });
});

// higth to low
productRouter.get("/bypricehtl", (req, res) => {
  Product.find()
    .sort({ price: -1 })
    .exec((err, document) => {
      if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
      else res.status(200).json({ products: document, authenticated: true });
    });
});

// add to pannier
productRouter.post(
  "/addtopannier/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "user") {
      if (req.user.pannier.indexOf(req.params.id) == -1) {
        req.user.pannier.push(req.params.id);
        req.user.save();
        res.json(req.user.pannier);
      } else {
        res.json({ message: "noo" });
      }
    }
  }
);

// add to pannier
productRouter.post(
  "/deletefrompannier/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "user") {
      if (req.user.pannier.indexOf(req.params.id) !== -1) {
        let index = req.user.pannier.indexOf(req.params.id);
        req.user.pannier.splice(index, 1);
        req.user.save();
        res.json(req.user.pannier);
      } else {
        res.json({ message: "noo" });
      }
    }
  }
);

// get products from pannier
productRouter.get(
  "/getfrompannier",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    try {
      User.findById({ _id: req.user._id })
        .populate("pannier")
        .exec((err, document) => {
          if (err)
            res
              .status(500)
              .json({ message: { msgBody: "Error has occured", msgError: true, err } });
          else {
            res.status(200).json({ pannier: document.pannier, authenticated: true });
          }
        });
    } catch (error) {
      res.json({ error });
    }
  }
);

// get product
productRouter.get("/getproduct/:id", (req, res) => {
  const { id } = req.params;
  Product.findById(id).exec((err, document) => {
    if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    else res.status(200).json({ product: document });
  });
});

// get all category
productRouter.get("/categories", (req, res) => {
  Category.find().exec((err, document) => {
    if (err) res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    else res.status(200).json({ categories: document, authenticated: true });
  });
});

module.exports = productRouter;
