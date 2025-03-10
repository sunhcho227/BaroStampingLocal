import { Meteor } from "meteor/meteor";
import {
  Coupons,
  UserNotifications,
  Admins,
  UserStores,
} from "/imports/api/collections";

Meteor.methods({
  // admin이 회원 목록 페이지에서 [체크한 user]에게 쿠폰 발행
  "users.addCoupon"(storeId, userIds, coupons, reason) {
    userIds.forEach((userId) => {
      const couponIds = [];
      for (let i = 0; i < coupons; i++) {
        couponIds.push(
          Coupons.insert({
            user_id: userId,
            store_id: storeId,
            createdAt: new Date(),
            usedAt: null,
            couponType: "서비스",
            couponUsage: false,
            couponMemo: reason,
          })
        );
      }

      UserNotifications.insert({
        user_id: userId,
        notificationType: "service coupon 발급",
        typeId: couponIds,
        createdAt: new Date(),
        isRead: false,
      });
    });
  },

  // admin이 직접 user qr을 카메라로 스캔해서 쿠폰 발행
  addCouponbyCamera(storeId, userId, coupons, reason) {
    const couponIds = [];
    for (let i = 0; i < coupons; i++) {
      couponIds.push(
        Coupons.insert({
          user_id: userId,
          store_id: storeId,
          createdAt: new Date(),
          usedAt: null,
          couponType: "서비스",
          couponUsage: false,
          couponMemo: reason,
        })
      );
    }

    UserNotifications.insert({
      user_id: userId,
      notificationType: "service coupon 발급",
      typeId: couponIds,
      createdAt: new Date(),
      isRead: false,
    });

    if (!UserStores.findOne({ user_id: userId, store_id: storeId })) {
      UserStores.insert({
        user_id: userId,
        store_id: storeId,
      });
    }
  },

  // 쿠폰 사용 완료 처리
  "users.useCoupon"(admin_id, couponId) {
    // 해당 쿠폰과 admin의 가게 정보 일치 여부 확인
    const admin = Admins.findOne({ user_id: admin_id });
    const storeId = admin.store_id;
    const couponInfo = Coupons.findOne({ _id: couponId });

    if (!Coupons.findOne({ _id: couponId, store_id: storeId })) {
      return "해당 가게와 일치하는 쿠폰이 아닙니다";
    } else {
      Coupons.update(couponId, {
        $set: { couponUsage: true, usedAt: new Date() },
      });

      UserNotifications.insert({
        user_id: couponInfo.user_id,
        notificationType: "coupon 사용",
        typeId: [couponId],
        createdAt: new Date(),
        isRead: false,
      });

      return "쿠폰이 정상적으로 사용되었습니다!";
    }
  },

  // 가게별 쿠폰 갯수 카운트
  userCouponCount(userId, storeId) {
    return Coupons.find({
      user_id: userId,
      store_id: storeId,
      couponUsage: false,
    }).count();
  },
});
