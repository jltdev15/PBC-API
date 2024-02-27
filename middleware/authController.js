require("dotenv").config({ path: "/config.env" });

const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const cookies = req.cookies["jwt"];
    jwt.verify(cookies, process.env.SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      console.log(req.user);
      next();
    });
  } catch (err) {
    res.status(401).json({
      message: err,
    });
  }
};
exports.verifyTokenStudent = async (req, res, next) => {
  try {
    const cookies = req.cookies["jwt"];
    jwt.verify(cookies, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      console.log(req.user);
      next();
    });
  } catch (err) {
    res.status(401).json({
      message: err,
    });
  }
};
