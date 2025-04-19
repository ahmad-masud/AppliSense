require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const applicationRoutes = require("./routes/applications");
const userRoutes = require("./routes/user");
const mongoose = require("mongoose");
const allowedOrigins = ["https://applisense.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.PORT) {
        return callback(null, true);
      }

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.use((req, _res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/applications", applicationRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    if (process.env.PORT) {
      app.listen(process.env.PORT, () => {
        console.log(`Server running locally on port ${process.env.PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err.message);
  });

module.exports = app;
