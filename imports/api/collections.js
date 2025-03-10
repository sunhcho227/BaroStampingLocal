import { Mongo } from "meteor/mongo";

export const Admins = new Mongo.Collection("admins");
export const AIprompts = new Mongo.Collection("aiprompts");
export const Carts = new Mongo.Collection("carts");
export const Coupons = new Mongo.Collection("coupons");
export const Orders = new Mongo.Collection("orders");
export const Products = new Mongo.Collection("products");
export const Payments = new Mongo.Collection("payments");
export const Reviews = new Mongo.Collection("reviews");
export const Stamps = new Mongo.Collection("stamps");
export const StoreAnnouncements = new Mongo.Collection("storeAnnouncements");
export const Stores = new Mongo.Collection("stores");
export const UserNotifications = new Mongo.Collection("userNotifications");
export const UserStores = new Mongo.Collection("userStores");
