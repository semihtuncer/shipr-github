const User = require("../models/User");
const Ship = require("../models/Ship");

const { verifyAuthorizationUser } = require("../utils/verifyTokenUtil");

const router = require("express").Router();

// request shipping
router.get("/request_ship/:id", verifyAuthorizationUser, async (req, res) => {
  try {
    const men = await User.find({ gender: 0 });
    const women = await User.find({ gender: 1 });

    const manRandom = men[Math.floor(Math.random() * men.length)];

    const womenLocation = women.filter(
      (a) => a.location === manRandom.location
    );
    const womanRandom =
      womenLocation[Math.floor(Math.random() * womenLocation.length)];

    let m = {};
    let wm = {};
    if (manRandom) {
      m = {
        _id: manRandom._id,
        username: manRandom.username,
        gender: manRandom.gender,
        birthday: manRandom.birthday,
        interests: manRandom.interests,
        location: manRandom.location,
      };
    }

    if (womanRandom) {
      wm = {
        _id: womanRandom._id,
        username: womanRandom.username,
        gender: womanRandom.gender,
        birthday: womanRandom.birthday,
        interests: womanRandom.interests,
        location: womanRandom.location,
      };
    }

    res.status(200).json({ man: m, woman: wm });
  } catch (err) {
    res.status(500).json(err);
  }
});
// send ship
router.post("/send_ship/:id", verifyAuthorizationUser, async (req, res) => {
  try {
    const man = await User.findById(req.body.man._id);
    const woman = await User.findById(req.body.woman._id);
    const shipper = await User.findById(req.params.id);
    const existing = await Ship.findOne({ man: man._id, woman: woman._id });

    if (!shipper || !man || !woman) {
      res.status(200).json("NOT EXISTING");
      return;
    }

    if (existing) {
      if (existing.shippers.includes(shipper._id)) {
        res.status(200).json("ALREADY SHIPPED");
        return;
      }

      await Ship.findByIdAndUpdate(
        existing._id,
        {
          count: existing.count + 1,
          shippers: [...existing.shippers, shipper._id],
        },
        { new: true }
      );
      res.status(200).json("SHIPPED");
    } else {
      const newShip = new Ship({
        man: man._id,
        woman: woman._id,
        count: 1,
        shippers: [shipper._id],
      });
      await newShip.save();

      res.status(200).json("SHIPPED");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
