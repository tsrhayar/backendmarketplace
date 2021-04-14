const mongoose = require("mongoose");
// 1 pour chiffrer mot de passe
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    max: 15,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "seller", "livreur", "user"],
    default: "user",
    required: true,
  },
  adress: {
    type: String,
    required: function () {
      return this.role === "user";
    },
  },
  cin: {
    type: String,
    required: function () {
      return this.role === "seller";
    },
  },
  livreurType: {
    type: String,
    required: function () {
      return this.role === "livreur";
    },
    enum: ["standard", "express"],
  },
  phone: {
    type: String,
    required: function () {
      return this.role === "livreur";
    },
  },
  isActive: {
    type: Number,
    required: true,
    default: function () {
      if (this.role === "seller" || this.role === "livreur") {
        return 0;
      }
      return 1;
    },
  },
  pannier: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// 2 apres save user
UserSchema.pre("save", function (next) {
  // 3 si le mot de passe ne pas modifier
  if (!this.isModified("password")) return next();
  // 4 si le mot de passe modifier
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

// 5 ajouter method "comparePassword" a les methode de "UserSchema"
UserSchema.methods.comparePassword = function (password, cb) {
  // 6 comparer les mots de passe (dans db && qui insert user)
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
