const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const regUserSchema = new mongoose.Schema({
  employeeID: {
    type: Number,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    // unique: true,
    // lowercase: true,
    // validate: [validator.isEmail, "Please provide a valid email"],
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
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

regUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

function getDateValue() {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  let finaldate;

  return (finaldate = `${month} ${day},${year}`);
}

const Registrar = mongoose.model("Registrar", regUserSchema);
module.exports = Registrar;
