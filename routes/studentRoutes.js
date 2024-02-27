const express = require("express");
const multer = require("multer");
const studentController = require("../controller/studentController");
const authController = require("../middleware/authController");
const router = express.Router();

// const upload = multer({ dest: "public/img/proof" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get(
  "/allrequest",
  authController.verifyTokenStudent,
  studentController.getAllRequest
);
router.post("/register", studentController.registerAccount);
router.post("/login", studentController.login);
router.post(
  "/create",
  authController.verifyTokenStudent,
  upload.single("fileName"),
  studentController.createRequest
);
router.patch(
  "/update/:id",
  authController.verifyTokenStudent,
  upload.single("proof"),
  studentController.updatePayment
);
router.get(
  "/active_student",
  authController.verifyTokenStudent,
  studentController.getStudentLoggedIn
);
module.exports = router;
