const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");
const jwt = require("jsonwebtoken");

const {
  generateVerificationCode,
  checkVerificationCode,
  useVerificationCode,
} = require("../utils/verificationCodeUtil");

const {
  verifyAuthorizationRegisteryUser,
  verifyAuthorizationUser,
} = require("../utils/verifyTokenUtil");

const router = require("express").Router();

// request otp
router.post("/request_otp", async (req, res) => {
  try {
    const c = generateVerificationCode(req.body);
    // send sms here

    res.status(200).json("Code sent.");
  } catch (err) {
    res.status(500).json(err);
  }
});
// verify otp
router.post("/verify_otp", async (req, res) => {
  try {
    const vc = await VerificationCode.findOne({ phoneNum: req.body.phoneNum });

    if (!vc) {
      res.status(404).json("No Code Sent!");
    } else {
      const check = checkVerificationCode(vc, req.body.code);

      if (check) {
        useVerificationCode(vc);
        const user = await User.findOne({ phoneNum: req.body.phoneNum });

        if (user) {
          const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACC_KEY,
            {
              expiresIn: "30d",
            }
          );

          res.status(200).json({ ...user._doc, accessToken });
        } else {
          const registerToken = jwt.sign(
            { phoneNum: req.body.phoneNum },
            process.env.JWT_REG_KEY,
            {
              expiresIn: "5d",
            }
          );
          res.status(201).json({ registerToken });
        }
      } else {
        res.status(404).json("Verification Code Wrong!");
      }
    }
  } catch (err) {
    res.status(404).json(err);
  }
});
// register
router.post("/register", verifyAuthorizationRegisteryUser, async (req, res) => {
  try {
    const user = await User.findOne({ phoneNum: req.body.phoneNum });
    if (user) {
      res.status(404).json("User already exists!");
      return;
    }
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    if (savedUser) {
      const accessToken = jwt.sign(
        { id: savedUser._id },
        process.env.JWT_ACC_KEY,
        {
          expiresIn: "30d",
        }
      );
      const { photo, ...others } = savedUser._doc;

      res.status(200).json({ ...others, accessToken });
    } else {
      res.status(404).json("Error while registering!");
    }
  } catch (err) {
    res.status(404).json(err);
  }
});
// verify otp
router.get("/verify_token/:id", verifyAuthorizationUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
