const express = require("express");
const adminController = require("../controller/adminController");
const registrarController = require("../controller/registrarController");
const authController = require("../middleware/authController");
const router = express.Router();

router.get(
  "/active",
  authController.verifyTokenRegistrar,
  registrarController.getUserLoggedIn
);

router.post("/login", registrarController.login);
router.post("/logout", registrarController.logout);

// router.get(
//   "/requests",
//   authController.verifyTokenRegistrar,
//   registrarController.getRequests
// );
// router.get(
//   "/archive",
//   authController.verifyTokenRegistrar,
//   registrarController.getArchiveRequests
// );
// router.get(
//   "/export",
//   authController.verifyTokenRegistrar,
//   registrarController.exportRequest
// );

module.exports = router;
