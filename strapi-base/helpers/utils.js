/**
 *
 * @param {Array} items
 * @param {string} key
 * @param {string} value
 * @returns Array of Objects with new key - value pair for each object
 */
const addObjectKeyValuePair = (items, key, value) => {
  return items.map((obj) => {
    return { ...obj, [key]: value };
  });
};

const getRandomNumberCode = (noOfDigits = 4) => {
  let min, max;
  switch (noOfDigits) {
    case 4:
      (min = 1000), (max = 9999);
      return Math.floor(Math.random() * (max - min + 1) + min);
    case 6:
      (min = 100000), (max = 999999);
      return Math.floor(Math.random() * (max - min + 1) + min);
    case 8:
      (min = 10000000), (max = 99999999);
      return Math.floor(Math.random() * (max - min + 1) + min);
    default:
      break;
  }
};

const getHashedOTP = (otp) => {
  return Buffer.from(otp.toString()).toString("base64");
};

const decodeHashedOTP = (otpString) => {
  return Buffer.from(otpString, "base64").toString("utf-8");
};

const generateRandomEmail = (myLength = 6) => {
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );

  const randomString = randomArray.join("");
  return randomString + "@random.com";
};

module.exports = {
  addObjectPair: addObjectKeyValuePair,
  getCode: getRandomNumberCode,
  getHashedOTP: getHashedOTP,
  decodedOTP: decodeHashedOTP,
  getRandomEmail: generateRandomEmail,
};
