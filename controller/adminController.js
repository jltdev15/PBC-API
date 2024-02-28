require("dotenv").config({ path: "/config.env" });

const Admin = require("../model/AdminModel");
const Request = require("../model/RequestModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = new Admin({
      userName: userName,
      password: hashedPassword,
    });
    await newAccount.save();
    res.status(200).json({
      message: "Successfully saved!",
      content: newAccount,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.login = async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  const checkUser = await Admin.findOne({ userName }).exec();
  if (!checkUser) {
    return res.status(401).json({
      message: "Username is not registered",
    });
  }
  console.log("username is correct");
  const passwordMatch = await bcrypt.compare(password, checkUser.password);

  if (!passwordMatch) {
    return res.status(404).json({
      message: "Incorrect Password",
    });
  }
  const accessToken = jwt.sign(
    { userName: checkUser.userName },
    process.env.SECRET,
    { expiresIn: "18000s" }
  );

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Login sucess",
  });
};
exports.logout = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};
exports.getRequests = async (req, res) => {
  try {
    const requestData = await Request.find()
      .sort({ status: "descending" })
      .exec();
    if (!requestData) {
      res.status(404).json({
        message: "Request empty",
      });
    }
    res.status(200).json({
      content: requestData,
    });
  } catch (err) {
    res.status(409).json({
      message: err,
    });
  }
};
exports.updateStatusProcessed = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Processing",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updateStatusApproved = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Approved",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updateStatusReject = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Reject",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updateStatusWaiting = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Waiting to pickup",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updateStatusCompleted = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Completed",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updatePickUpDate = async (req, res) => {
  console.log(req.body);
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.updateRejectRemarks = async (req, res) => {
  console.log(req.body);
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedData) {
      return res.status(409).json({
        message: "Id not exist",
      });
    }
    res.status(200).json({
      message: updatedData,
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};
exports.getUserLoggedIn = async (req, res) => {
  console.log(req.user);
  try {
    const responseData = await Admin.findOne({
      userName: req.user.userName,
    });
    if (responseData) {
      return res.status(200).json({
        content: responseData,
      });
    }
  } catch (err) {
    res.status(401).json({
      errorMessage: err,
    });
  }
};
