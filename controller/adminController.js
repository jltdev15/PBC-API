require("dotenv").config({ path: "/config.env" });

const Registrar = require("../model/RegistrarModel");
const Admin = require("../model/AdminModel");
const Request = require("../model/RequestModel");
const Learner = require("../model/LearnerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const excel = require("exceljs");

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
  await res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  await res.sendStatus(204);
};
exports.getRequests = async (req, res) => {
  try {
    const requestData = await Request.find({ status: { $ne: "Archive" } })
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
exports.updateStatusArchive = async (req, res) => {
  try {
    const updatedData = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status: "Archive",
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
    const { password, ...data } = responseData.toJSON();
    if (responseData) {
      return res.status(200).json({
        content: data,
      });
    }
  } catch (err) {
    res.status(401).json({
      errorMessage: err,
    });
  }
};
exports.getArchiveRequests = async (req, res) => {
  try {
    const requestData = await Request.find({
      status: { $eq: "Archive" },
    }).exec();
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
exports.addLearnerReferenceNumber = async (req, res) => {
  try {
    const newLrn = new Learner({
      learnerReferenceNumber: req.body.lrn,
    });
    await newLrn.save();
    res.status(200).json({
      content: newLrn,
    });
  } catch (err) {
    res.status(400).json({
      content: err,
    });
  }
};
exports.updateAdminPassword = async (req, res) => {
  console.log(req.params.id);
  const foundData = await Admin.findOne({
    userName: req.params.id,
  });
  const { password, ...data } = foundData.toJSON();
  console.log(password);
  if (!(await bcrypt.compare(req.body.currentPassword, password))) {
    return res.status(401).json({
      message: "Current password incorrect!",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const newhashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  const query = { password: password };
  const updatedPassword = await Admin.findOneAndUpdate(
    query,
    { password: newhashedPassword },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPassword) {
    return res.send({
      message: "Password not updated",
    });
  }
  return res.status(201).json({
    message: "Password changed!",
  });
};
exports.updateAdminUserName = async (req, res) => {
  console.log(req.params.id);
  const foundData = await Admin.findOne({
    userName: req.params.id,
  });
  const { userName, ...data } = foundData.toJSON();
  console.log(userName);
  if (userName !== req.body.currentUsername) {
    return res.status(401).json({
      message: "Current username incorrect!",
    });
  }

  const query = { userName: userName };
  const updatedUsername = await Admin.findOneAndUpdate(
    query,
    { userName: req.body.newUserName },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUsername) {
    return res.send({
      message: "Username not updated",
    });
  }
  return res.status(201).json({
    message: "Username changed!",
  });
};
exports.exportRequest = async (req, res) => {
  try {
    const archiveData = await Request.find({ status: "Archive" }).lean();

    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet("Request");

    workSheet.columns = [
      {
        header: "Learner Reference Number",
        key: "learnerReferenceNumber",
        type: "number",
        width: 30,
      },
      {
        header: "Name",
        key: "requestorName",
        width: 30,
      },
      {
        header: "Date Requested",
        size: 16,
        key: "dateCreated",
        width: 30,
      },
      {
        header: "Type of document",
        key: "documentType",
        width: 30,
      },
      {
        header: "Purpose of Request",
        key: "purpose",
        width: 30,
      },
      {
        header: "Pick up date",
        key: "pickUpDate",
        width: 30,
      },
      {
        header: "Status",
        key: "status",
        width: 30,
      },
    ];
    workSheet.getRow(1).font = { bold: true, color: { argb: "FFFFFF" } };
    workSheet.getRow(1).alignment = { horizontal: "center" };
    workSheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffffff" },
    };
    archiveData.forEach((item) => {
      workSheet.addRow(item);
    });
    const style = {
      font: {
        size: 16,
        bold: true,
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Apply style to all cells
    workSheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.font = style.font;
        cell.border = style.border;
      });
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Archived-Request.xlsx"
    );
    await workBook.xlsx.write(res);
  } catch (err) {
    res.status(400).json({
      content: err,
    });
  }
};
exports.createRegistrarAccount = async (req, res) => {
  console.log(req.body);
  try {
    const newAccount = new Registrar(req.body);
    await newAccount.save();
    res.status(201).json({
      status: "Success",
      content: newAccount,
    });
  } catch (err) {
    res.status(404).json({
      content: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Registrar.find().exec();

    if (!users) {
      res.status(404).json({
        content: "No users found",
      });
    }
    return res.status(200).json({
      content: users,
    });
  } catch (err) {
    res.status(400).json({
      content: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await Registrar.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    res.status(204).json({
      message: "Account deleted!",
    });
  } catch (err) {
    res.status(404).json({
      content: err,
    });
  }
};
exports.updateUserInfo = async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  try {
    const updatedData = await Registrar.findByIdAndUpdate(
      req.params.id,
      req.body,
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
