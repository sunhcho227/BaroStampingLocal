import { Meteor } from "meteor/meteor";
import { Orders, Payments } from "/imports/api/collections";

Meteor.methods({
  // 주문하기
  addOrder(userId, storeId, orderItems, totalPrice) {
    return Orders.insert({
      user_id: userId,
      store_id: storeId,
      orderItems,
      totalPrice,
      orderType: "Baro주문",
    });
  },

  // 주문 확인하기
  "orders.markCompleted"(paymentId) {
    const payment = Payments.findOne({ _id: paymentId });
    Payments.update({ _id: paymentId }, { $set: { status: "완료" } });
    return "Payment status updated to 완료";
  },

  orderPOS(userId, storeId, orderItems, totalPrice) {
    return Orders.insert({
      user_id: userId,
      store_id: storeId,
      orderItems,
      totalPrice,
      orderType: "현장 주문",
    });
  },
});
