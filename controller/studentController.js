require("dotenv").config({ path: "/config.env" });
const User = require("../model/UserModel");
const Request = require("../model/RequestModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAccount = async (req, res) => {
  const {
    fullName,
    learnerReferenceNumber,
    address,
    contact,
    email,
    password,
    requestList,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newData = new User({
      fullName: fullName,
      learnerReferenceNumber: learnerReferenceNumber,
      address: address,
      contact: contact,
      email: email,
      password: hashedPassword,
    });
    await newData.save();
    res.status(200).json({
      message: "Successfully saved!",
      content: newData,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.login = async (req, res) => {
  const { learnerReferenceNumber, password } = req.body;

  console.log(learnerReferenceNumber);
  const checkUser = await User.findOne({ learnerReferenceNumber }).exec();
  if (!checkUser) {
    return res.status(401).json({
      message: "LRN is not registered",
    });
  }
  console.log(checkUser);
  const passwordMatch = await bcrypt.compare(password, checkUser.password);

  if (!passwordMatch) {
    return res.status(404).json({
      message: "Incorrect Password",
    });
  }
  const accessToken = jwt.sign(
    { learnerReferenceNumber: checkUser.learnerReferenceNumber },
    process.env.JWT_SECRET,
    { expiresIn: "18000s" }
  );

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Access granted",
  });
};
exports.createRequest = async (req, res) => {
  try {
    const id = req.user.learnerReferenceNumber;
    const checkId = await User.findOne({
      learnerReferenceNumber: id,
    }).exec();
    console.log(req.file);
    if (req.file) {
      const newRequest = new Request({
        learnerReferenceNumber: id,
        requestorName: checkId.fullName,
        documentType: req.body.documentType,
        dateCreated: req.body.dateCreated,
        year: req.body.year,
        dateNeeded: req.body.dateNeeded,
        purpose: req.body.purpose,
        fileName: req.file.filename,
        filePath: "https://pbc-api.onrender.com/img/" + req.file.filename,
      });
      await newRequest.save();
      checkId.requestList.push(newRequest);
      await checkId.save();
      res.status(200).json({
        message: "Sucess!",
      });
    } else {
      const newRequest = new Request({
        learnerReferenceNumber: id,
        requestorName: checkId.fullName,
        documentType: req.body.documentType,
        year: req.body.year,
        dateNeeded: req.body.dateNeeded,
        purpose: req.body.purpose,
      });
      await newRequest.save();
      checkId.requestList.push(newRequest);
      await checkId.save();
      res.status(200).json({
        message: "Sucess!",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};

exports.updatePayment = async (req, res) => {
  const id = req.user.learnerReferenceNumber;
  console.log(id);
  console.log(req.file);

  try {
    const updatedData = await Request.findOneAndUpdate(
      { _id: req.params.id },
      {
        proof: req.file.filename,
        proofPath: "https://pbc-api.onrender.com/img/" + req.file.filename,
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

exports.getAllRequest = async (req, res) => {
  console.log(req.user.learnerReferenceNumber);
  try {
    const getData = await User.findOne({
      learnerReferenceNumber: req.user.learnerReferenceNumber,
    })
      .populate("requestList")
      .exec();

    res.status(200).json({
      content: getData.requestList,
    });
  } catch (err) {
    res.status(404).json({
      content: err,
    });
  }
};
exports.getStudentLoggedIn = async (req, res) => {
  console.log(req.user);
  try {
    const responseData = await User.findOne({
      learnerReferenceNumber: req.user.learnerReferenceNumber,
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
