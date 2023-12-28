const express = require("express");
const multer = require("multer");
const path = require("path");
const { isUserLogin } = require("../middleware/auth");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// import
const {
  renderRegisterPage,
  renderLoginPage,
  handleUserRegister,
  handleUserLogin,
  handleUserLogout,
} = require("../controller/user");
const router = express.Router();

router
  .route("/registration")
  .get(isUserLogin, renderRegisterPage)
  .post(upload.single("image"), handleUserRegister);
router.route("/login").get(isUserLogin, renderLoginPage).post(handleUserLogin);

router.get("/logout", handleUserLogout);

module.exports = router;
