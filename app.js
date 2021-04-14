const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

mongoose.connect(
  // "mongodb://localhost:27017/mernauth",
  "mongodb+srv://tahasrhdev:LSRJs5iXQkdEylex@cluster0.iezdt.mongodb.net/mernauth?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("successfully connected to database");
  }
);

const userRouter = require("./routes/User");
app.use("/user", userRouter);

const todoRouter = require("./routes/Todo");
app.use("/todo", todoRouter);

const productRouter = require("./routes/Product");
app.use("/product", productRouter);

const categoryRouter = require("./routes/Category");
app.use("/category", categoryRouter);

app.listen(5000, () => {
  console.log("express server started");
});
