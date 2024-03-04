const Learner = require("../model/LearnerModel");

exports.checkLRN = async (req, res, next) => {
  const { learnerReferenceNumber } = req.body;
  try {
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
