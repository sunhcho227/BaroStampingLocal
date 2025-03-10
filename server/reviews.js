// review.js
import { Mongo } from "meteor/mongo";
import { Reviews } from "/imports/api/collections";

// 서버에서 리뷰 관련 메서드 정의
Meteor.methods({
  "reviews.add"(user_id, store_id, payment_id, reviewContents, rating) {
    return Reviews.insert({
      user_id: user_id,
      store_id: store_id,
      payment_id: payment_id,
      reviewContents: reviewContents,
      rating: Number(rating),
      aiReview: null,
      createdAt: new Date(),
      updatedAt: null,
    });
  },

  "reviews.getByUser": function (userId) {
    return Reviews.find({ user_id: userId }).fetch();
  },

  "reviews.update"(_id, reviewContents, rating) {
    // 리뷰 업데이트
    Reviews.update(
      { _id },
      {
        $set: {
          reviewContents,
          rating: Number(rating),
          updatedAt: new Date(),
        },
      }
    );
  },

  "reviews.remove"(_id) {
    return Reviews.remove(_id);
  },

  // 해당 가게 모든 리뷰 가져오기
  "reviews.getReviewsByStoreId": function (store_id) {
    return Reviews.find(
      { store_id: store_id },
      { sort: { createdAt: -1 } }
    ).fetch();
  },
});
