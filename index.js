const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongo = require("./database.js/database");
const register = require("./routes/user");
const login = require("./routes/login");
const forgotPassword = require("./routes/forgotPassword");
const testcase = require("./routes/testcase");
const steps = require("./routes/step");
const testset = require("./routes/testset");
const testrun = require("./routes/testrun");

app.use(cors());
app.use(express.json());
app.use("/api/register", register);
app.use("/api/forgotPassword", forgotPassword);
app.use("/api/login", login);
app.use("/api/testcase", testcase);
app.use("/api/step", steps);
app.use("/api/testset", testset);
app.use("/api/testrun", testrun);

const port = 5000;

app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
