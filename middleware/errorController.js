const Learner = require("../model/LearnerModel");
const User = require("../model/UserModel");

exports.checkLRN = async (req, res, next) => {
  const { learnerReferenceNumber } = req.body;
  try {
    const checkDuplicate = await User.exists({
      learnerReferenceNumber: learnerReferenceNumber,
    });
    if (checkDuplicate) {
      return res.status(404).json({
        content: "LRN already registered",
      });
    }
    const lrnFound = await Learner.exists({
      learnerReferenceNumber: learnerReferenceNumber,
    }).exec();
    if (lrnFound) {
      return next();
    }
    return res.status(404).json({
      content: "Learner Reference Number not found.",
    });
  } catch (err) {
    res.status(400).json({
      content: err,
    });
  }
};
