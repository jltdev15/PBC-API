const express = require("express");
const adminController = require("../controller/adminController");
const authController = require("../middleware/authController");
const router = express.Router();

router.get(
  "/active",
  authController.verifyToken,
  adminController.getUserLoggedIn
);
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.post("/addlrn", adminController.addLearnerReferenceNumber);
router.get(
  "/requests",
  authController.verifyToken,
  adminController.getRequests
);
router.get(
  "/archiveRequests",
  authController.verifyToken,
  adminController.getArchiveRequests
);
router.patch("/approved/:id", adminController.updateStatusApproved);
router.patch("/reject/:id", adminController.updateStatusReject);
router.patch("/processing/:id", adminController.updateStatusProcessed);
router.patch("/schedule/:id", adminController.updatePickUpDate);
router.patch("/waiting/:id", adminController.updateStatusWaiting);
router.patch("/complete/:id", adminController.updateStatusCompleted);
router.patch("/rejected/:id", adminController.updateRejectRemarks);
router.patch("/archive/:id", adminController.updateStatusArchive);
router.patch("/changepassword/:id", adminController.updateAdminPassword);
router.patch("/changeusername/:id", adminController.updateAdminUserName);
module.exports = router;
