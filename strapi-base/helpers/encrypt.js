//const logger = require("./logger").default;
const crypto = require("crypto");
const secret = strapi.config.get("constants.ENCRYPTION_SECRET_KEY");

module.exports = {
  /**
   * Encrypt
   */
  encrypt(text, secret, iv) {
    const text1 = String(text);
    const cipher = crypto.createCipheriv("aes-256-cbc", secret, iv);
    let crypted = cipher.update(text1, "utf8", "hex");
    crypted += cipher.final("hex");
    return crypted;
  },

  /**
   * Decrypt
   */
  decrypt(text, secret, iv) {
    const text1 = String(text);
    const decipher = crypto.createDecipheriv("aes-256-cbc", secret, iv);
    let dec = decipher.update(text1, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  },

  hash(text,secret) {
    // Create a hash object
    let hash = crypto.createHash("sha256");

    // Update the hash object with the data and salt
    hash.update(text + secret);

    // Generate the hash code
    let hashCode = hash.digest("hex");
    return hashCode;
  },
};
