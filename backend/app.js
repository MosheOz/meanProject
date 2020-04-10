const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const postsRequests = require("./routes/posts");
const userRequests = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://Moshe:" +
      process.env.MONGO_PW +
      "@cluster0-mkmpx.mongodb.net/mean-project-db?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("You Are Connected To DB!"))
  .catch(err => console.log("Connection failed. Error: " + err));

// app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Wuth, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use("/api/posts", postsRequests);
app.use("/api/user", userRequests);

module.exports = app;


