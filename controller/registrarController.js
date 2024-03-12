const Registrar = require("../model/RegistrarModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Request = require("../model/RequestModel");

exports.login = async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  const checkUser = await Registrar.findOne({ userName }).exec();
  if (!checkUser) {
    return res.status(401).json({
      message: "Invalid username, please try again",
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
    { userName: checkUser.userName },
    process.env.JWT_REGISTRAR,
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
exports.getUserLoggedIn = async (req, res) => {
  console.log(req.user);
  try {
    const responseData = await Registrar.findOne({
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
