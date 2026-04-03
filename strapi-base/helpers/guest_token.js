//const logger = require("./logger").default;
const { addSeconds, isWithinInterval, format } = require("date-fns");
const { hash, encrypt } = require("./encrypt");
const secret = strapi.config.get("constants.ENCRYPTION_SECRET_KEY");
const CryptoJS = require('crypto-js');

module.exports = {
    /**
     * Encrypt
     */
    check_request(ctx) {
        let result = { result: false, error: "Text is invalid" };

        const encryptedDate = ctx.request.header["new-text"];

        const bytes = CryptoJS.AES.decrypt(encryptedDate, secret);
        let originalDate = bytes.toString(CryptoJS.enc.Utf8);
        originalDate = new Date(originalDate);
        try {
            const currentTime = new Date();
            const sentTime = currentTime.setTime(originalDate);
            const toTime = addSeconds(sentTime, 5);

            const correct = isWithinInterval(new Date(), {
                start: new Date(sentTime),
                end: new Date(toTime),
            });

            if (!correct) {
                return result;
            }
        } catch (error) {
            return result;
        }
        result.result = true;
        result.error = "";
        return result;
    }
}