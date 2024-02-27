const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config({ path: "config.env" });
const port = process.env.PORT || 3000;
const db = process.env.DATABASE_URI;

const app = express();
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5173",
      "http://localhost:5174",
      "https://online-document-request-system.vercel.app/",
    ],
    credentials: true,
  })
);
app.options("*", cors());

app.use("/v1/api", studentRoutes);
app.use("/v1/api/admin", adminRoutes);

mongoose.connect(db).then(() => console.log("Connected to Database!"));

app.listen(port, () => {
  console.log("====================================");
  console.log("Server is running in port " + port);
  console.log("====================================");
});
