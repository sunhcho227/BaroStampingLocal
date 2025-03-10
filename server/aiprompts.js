import { Meteor } from "meteor/meteor";
import { AIprompts } from "/imports/api/collections";

Meteor.methods({
  // storeId에 맞는 category 업데이트
  "aiprompts.updateCategoryByStoreId"(storeId, newCategory) {
    AIprompts.update(
      { store_id: storeId },
      { $set: { category: newCategory } }
    );
  },

  // storeId에 맞는 product 업데이트
  "aiprompts.updateProductByStoreId"(storeId, newProduct) {
    AIprompts.update({ store_id: storeId }, { $set: { product: newProduct } });
  },
});
