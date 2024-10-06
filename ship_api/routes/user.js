const User = require("../models/User");

const {
  verifyToken,
  verifyAuthorizationUser,
} = require("../utils/verifyTokenUtil");
const {
  writeFileBinary,
  readFileBase64,
  base64ToByteArray,
} = require("../utils/streamUtil");

const multer = require("multer");
const upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 } });

const router = require("express").Router();

// set profile picture
router.post(
  "/set_profile_picture/:id",
  verifyAuthorizationUser,
  upload.fields([{ name: "photo", maxCount: 1 }]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        res.status(500).json("NO USER");
        return;
      }

      const bArray = base64ToByteArray(req.body.photo);
      writeFileBinary(bArray, "./userPhotos/" + req.params.id + ".jpg");

      res.status(200).json("SUCCESS");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
// get profile picture
router.get("/get_profile_picture/:userId", verifyToken, async (req, res) => {
  try {
    const a = readFileBase64("./userPhotos/" + req.params.userId + ".jpg");
    res.status(200).json(a);
  } catch (err) {
    res.status(500).json(err);
  }
});
// set location
router.post("/set_location/:id", verifyAuthorizationUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        location: req.body.location,
      },
      { new: true }
    ).then((user) => {
      res.status(200).json(user);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
