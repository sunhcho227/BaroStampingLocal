import { Meteor } from "meteor/meteor";
import init from "./init.js";
import users from "./users.js";
import admins from "./admins.js";
import carts from "./carts.js";
import coupons from "./coupons.js";
import products from "./products.js";
import payments from "./payments.js";
import reviews from "./reviews.js";
import stamps from "./stamps.js";
import storeAnnouncements from "./storeAnnouncements.js";
import stores from "./stores.js";
import userNotifications from "./userNotifications.js";
import userStores from "./userStores.js";
import myProfile from "./myProfile.js";
import orders from "./orders.js";
import reviewLLM from "./reviewLLM.js";
import storeImage from "./storeImage.js";
import aiprompts from "./aiprompts.js";
import os from "os";

Meteor.methods({
  // Wi-Fi 어댑터의 IPv4 주소 가져오기
  getWiFiIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      if (/wi[- ]?fi/i.test(name)) {
        for (const iface of interfaces[name]) {
          if (iface.family === "IPv4" && !iface.internal) {
            return iface.address;
          }
        }
      }
    }
    throw new Error("Wi-Fi adapter's IPv4 address not found");
  },
});
