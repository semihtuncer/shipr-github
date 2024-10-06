const fs = require("fs");

const writeFileBinary = (data, dir) => {
  fs.writeFile(dir, data, (err) => {});
};
const readFileBase64 = (dir) => {
  const a = fs.readFileSync(dir, { encoding: "base64" });
  return a;
};
const deleteFile = (dir) => {
  try {
    fs.unlinkSync(dir);
  } catch (error) {
    console.log(error);
  }
};
const base64ToByteArray = (base64String) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const byteArray = new Uint8Array(Math.ceil(base64String.length * 0.75));

  let byteIndex = 0;
  let charIndex = 0;

  while (charIndex < base64String.length) {
    let enc1 = chars.indexOf(base64String.charAt(charIndex++));
    let enc2 = chars.indexOf(base64String.charAt(charIndex++));
    let enc3 = chars.indexOf(base64String.charAt(charIndex++));
    let enc4 = chars.indexOf(base64String.charAt(charIndex++));

    let bits24 = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;

    let byte1 = (bits24 >> 16) & 0xff;
    let byte2 = (bits24 >> 8) & 0xff;
    let byte3 = bits24 & 0xff;

    byteArray[byteIndex++] = byte1;

    if (enc3 !== 64) {
      byteArray[byteIndex++] = byte2;
      if (enc4 !== 64) {
        byteArray[byteIndex++] = byte3;
      }
    }
  }

  return byteArray.subarray(0, byteIndex);
};

module.exports = {
  writeFileBinary,
  readFileBase64,
  deleteFile,
  base64ToByteArray,
};
