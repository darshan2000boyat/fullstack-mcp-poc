// @ts-nocheck
const logger = require("./logger").default;
const CustomError = require("./error").default;

const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const _ = require("lodash");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(strapi.config.get("firebase")),
  });
}

const getUserMgmApp = function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDKQeScWigGPHZoEzlUVVE3idRNiNXi0Mo",
    authDomain: "almadallah-dev-3c3e9.firebaseapp.com",
    projectId: "almadallah-dev-3c3e9",
    storageBucket: "almadallah-dev-3c3e9.appspot.com",
    messagingSenderId: "952785187146",
    appId: "1:952785187146:web:6060391c1d56a73ccbd1b3",
    measurementId: "G-41CFSBL1VF",
  };

  return (userMgmApp = initializeApp(firebaseConfig));
};

module.exports = {
  async getFBUserByUID(uid) {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      return null;
    }
  },
  async getFBUserByEmail(email) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      return user;
    } catch (error) {
      return false;
    }
  },
  async getFBUserByPhoneNumber(phoneNumber) {
    return await admin.auth().getUserByPhoneNumber(phoneNumber);
  },
  async createFBUserWithEmailAndPassword(fbUser) {
    // const testuser = {
    //   //email: 'user@example.com',
    //   //emailVerified: false,
    //   phoneNumber: '+11234567880',
    //   password: 'secretPassword',
    //   displayName: 'John Doe',
    //   photoURL: 'http://www.example.com/12345678/photo.png',
    //   disabled: false,
    // };

    try {
      const user = await admin.auth().createUser(fbUser);
      return user;
    } catch (error) {
      throw new CustomError(
        "Email or Phone number are already taken",
        strapi.config.get("error-codes.EMAIL_TAKEN"),
        409
      );
    }
  },
  async checkIfFBUserExists(param, type = "email") {
    try {
      let user;
      switch (type) {
        case "email":
          user = await admin.auth().getUserByEmail(param);
          break;
        case "phone":
          user = await admin.auth().getUserByPhoneNumber(param);
          break;
        default:
          return false;
      }
      return user;
    } catch (error) {
      return false;
    }
  },
  async updateUser(uid, data) {
    try {
      const user = await admin.auth().updateUser(uid, data);
      return user;
    } catch (error) {
      throw new CustomError(
        "Email or Phone number are already taken",
        strapi.config.get("error-codes.EMAIL_TAKEN"),
        409
      );
    }
  },
  async generatePasswordResetLink(email, actionCodeSettings) {
    return await admin
      .auth()
      .generatePasswordResetLink(email, actionCodeSettings);
  },

  async signInWithEmailAndPassword(email, password) {
    try {
      const userMgmAdmin = getUserMgmApp();
      const auth = getAuth(userMgmAdmin);

      let result = await signInWithEmailAndPassword(auth, email, password);

      return result?.user;
    } catch (error) {
      return null;
    }
  },
};
