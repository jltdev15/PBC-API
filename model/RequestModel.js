const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    learnerReferenceNumber: {
      type: String,
      required: true,
    },
    requestorName: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: String,
      default: "",
      // default: getDateValue(),
    },
    documentType: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    processingDays: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    fileName: {
      type: String,
      default: "",
    },
    filePath: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    pickUpDate: {
      type: String,
      default: "",
    },
    proof: {
      type: String,
      default: "",
    },
    proofPath: {
      type: String,
      default: "",
    },
    rateDate: {
      type: String,
      default: "",
    },
    rating: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    others: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);
function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return `${month} ${day},${year}`;
}
const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
