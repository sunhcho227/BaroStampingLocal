import { Mongo } from "meteor/mongo";
import { Products } from "/imports/api/collections";

Meteor.methods({
  addProducts(store_id, productName, productPrice) {
    Products.insert({
      store_id,
      productName,
      productPrice,
    });
  },

  updateProducts(product_id, productName, productPrice) {
    Products.update(
      { _id: product_id },
      {
        $set: {
          productName,
          productPrice,
        },
      }
    );
  },

  removeProducts(product_id) {
    Products.remove({ _id: product_id });
  },
});
