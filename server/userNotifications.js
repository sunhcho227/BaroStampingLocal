import { Meteor } from "meteor/meteor";
import { UserNotifications } from "/imports/api/collections";

// Table userNotification {
//   _id String [primary key]
//   user_id String
//   notificationType String [note: "stamp 발급, service coupon 발급, coupon 사용"]
//   typeId Array [note: "stamp_id 또는 coupon_id 넣기"]
//   createdAt date
//   isRead boolean [note: "default F, user가 읽으면 T"]
// }

Meteor.methods({
  "userNotifications.markAsRead"(notificationId) {
    UserNotifications.update(
      { _id: notificationId },
      { $set: { isRead: true } }
    );
  },

});
