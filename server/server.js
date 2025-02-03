require("dotenv").config();
const express = require("express");
const app = express();
const applicationRoutes = require("./routes/applications");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const isLocal = process.env.IS_LOCAL;

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/applications", applicationRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    if (isLocal) {
      app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err.message);
  });

module.exports = app;
