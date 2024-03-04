const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema({
  learnerReferenceNumber: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: String,
    default: getDateValue(),
  },
  updatedAt: {
    type: String,
    default: getDateValue(),
  },
});

function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return (finaldate = `${month} ${day},${year}`);
}

const Learner = mongoose.model("Learner", learnerSchema);
module.exports = Learner;
