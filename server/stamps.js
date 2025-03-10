import { Meteor } from "meteor/meteor";
import {
  Stamps,
  Stores,
  Coupons,
  UserStores,
  UserNotifications,
} from "/imports/api/collections";

// utils 실행 예제
// import utils from "../lib/utils";
// console.log(
//   Stamps.findOne({ user_id: "iozfAu4rKJPzfjbCP" }).createdAt.toStringYMD()
// );
// 위와 같이 실행하면 콘솔에 2024-11-13 와 같이 결과를 얻을 수 있음

Meteor.methods({
  // admin이 회원 목록 페이지에서 [체크한 user]에게 스탬프 적립
  "users.addStamps"(storeId, userIds, stamps) {
    userIds.forEach((userId) => {
      const stampIds = [];
      for (let i = 0; i < stamps; i++) {
        stampIds.push(
          Stamps.insert({
            user_id: userId,
            store_id: storeId,
            createdAt: new Date(),
          })
        );
      }

      UserNotifications.insert({
        user_id: userId,
        notificationType: "stamp 발급",
        typeId: stampIds,
        createdAt: new Date(),
        isRead: false,
      });
    });
  },

  // admin이 직접 user qr을 카메라로 스캔해서 스탬프 적립
  addStampsbyCamera(storeId, userId, stamps) {
    const stampIds = [];
    for (let i = 0; i < stamps; i++) {
      stampIds.push(
        Stamps.insert({
          user_id: userId,
          store_id: storeId,
          createdAt: new Date(),
        })
      );
    }

    UserNotifications.insert({
      user_id: userId,
      notificationType: "stamp 발급",
      typeId: stampIds,
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

  // 가게 QR을 이용해 user에게 stamp 적립
  async addStampsbyQR(storeId, stampCount, currentUsername) {
    const storeInfo = await Stores.findOne({ _id: storeId });

    // username을 통해 기존 사용자인지 여부 확인
    let userInfo = Meteor.users.findOne({ username: currentUsername });

    // 해당 username이 없으면 새 계정 생성 (비회원)
    if (!userInfo) {
      await Accounts.createUser({
        username: currentUsername,
        password: "1234",
        profile: {
          nickname: "Guest",
          phoneNumber: null,
          email: null,
          userGrade: "비회원",
          createdAt: new Date(),
        },
      });

      // 새로 생성된 사용자 정보 다시 가져오기
      userInfo = Meteor.users.findOne({ username: currentUsername });
    }

    // 스탬프 적립
    const stampPromises = [];
    for (let i = 0; i < stampCount; i++) {
      stampPromises.push(
        Stamps.insert({
          user_id: userInfo._id,
          store_id: storeId,
          createdAt: new Date(),
        })
      );
    }

    await Promise.all(stampPromises);

    UserNotifications.insert({
      user_id: userInfo._id,
      notificationType: "stamp 발급",
      typeId: stampPromises,
      createdAt: new Date(),
      isRead: false,
    });

    if (!UserStores.findOne({ user_id: userInfo._id, store_id: storeId })) {
      UserStores.insert({
        user_id: userInfo._id,
        store_id: storeId,
      });
    }

    const storeName = storeInfo?.storeName || "알 수 없는 가게";

    return `${userInfo.username}님 ${storeName}의 스탬프가 ${stampCount}개 발행되었습니다`;
  },

  // user && store 스탬프 조회, 가게별 스탬프 카운트
  userStampCount(userId, storeId) {
    return Stamps.find({
      user_id: userId,
      store_id: storeId,
    }).count();
  },

  // user가 가진 stamp를 coupon으로 전환하기
  makeCoupon(userId, storeId, stampCount, couponCount) {
    const store = Stores.findOne({ _id: storeId });

    const stampsToDelete = Stamps.find(
      { user_id: userId, store_id: storeId },
      { sort: { createdAt: 1 }, limit: stampCount }
    ).fetch();

    if (stampsToDelete.length < stampCount) {
      throw new Meteor.Error(
        "not-enough-stamps",
        "사용 가능한 스탬프가 부족합니다."
      );
    }

    const maxCoupons = Math.floor(stampsToDelete.length / store.maxStamp);
    if (couponCount > maxCoupons) {
      throw new Meteor.Error(
        "exceed-max-coupons",
        "전환 가능한 최대 쿠폰 개수를 초과했습니다."
      );
    }

    const idsToDelete = stampsToDelete.map((stamp) => stamp._id);
    Stamps.remove({ _id: { $in: idsToDelete } });

    for (let i = 0; i < couponCount; i++) {
      Coupons.insert({
        user_id: userId,
        store_id: storeId,
        createdAt: new Date(),
        usedAt: null,
        couponType: "통상",
        couponUsage: false,
        couponMemo: null,
      });
    }

    return `쿠폰 ${couponCount}개 발행되었습니다`;
  },
});
