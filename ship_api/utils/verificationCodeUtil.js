const VerificationCode = require("../models/VerificationCode");

const CODE_EXPIRY = 45; // seconds

const generateVerificationCode = async (body) => {
  try {
    const verifyCode = await VerificationCode.findOne({
      phoneNum: body.phoneNum,
    });

    if (verifyCode) {
      var expirySecs =
        (new Date().getTime() - verifyCode.creationTime.getTime()) / 1000;

      if (expirySecs > CODE_EXPIRY)
        await VerificationCode.deleteOne({ phoneNum: body.phoneNum });
      else {
        console.log(verifyCode.code);
        return;
      }
    }

    const code = generateRandomCode(6);

    console.log(code);
    const dbCode = new VerificationCode({
      phoneNum: body.phoneNum,
      code: code,
      creationTime: new Date(),
    });
    const saved = await dbCode.save();

    return Promise.resolve(saved);
  } catch (err) {
    return Promise.reject(err);
  }
};
const useVerificationCode = async (vc) => {
  try {
    const a = await VerificationCode.findByIdAndDelete(vc._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const checkVerificationCode = (vc, userVC) => {
  try {
    if (vc) {
      if (vc.code == userVC) {
        const expirySecs =
          (new Date().getTime() - vc.creationTime.getTime()) / 1000;

        if (expirySecs > CODE_EXPIRY) return false;
        else return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

const generateRandomCode = (len) => {
  const chars = "0123456789";

  let res = "";
  for (let i = 0; i < len; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return res;
};

module.exports = {
  generateVerificationCode,
  useVerificationCode,
  checkVerificationCode,
};
