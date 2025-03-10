import { Meteor } from "meteor/meteor";
import {
  Payments,
  Stamps,
  UserNotifications,
  UserStores,
  Carts,
  Reviews,
  Stores,
} from "/imports/api/collections";

Meteor.methods({
  async addPayment(userId, storeId, orderId, orderItems, totalSum) {
    if (
      !userId ||
      !storeId ||
      !orderId ||
      !orderItems ||
      totalSum === undefined
    ) {
      console.log("필요한 결제 정보가 누락되었습니다.");
    }

    Payments.insert({
      user_id: userId,
      store_id: storeId,
      order_id: orderId,
      payItems: orderItems,
      totalSum,
      paymentDate: new Date(),
      status: "대기",
    });

    const stampCount = orderItems.length;
    let stampTotal = 0;
    for (let i = 0; i < stampCount; i++) {
      const stamp = orderItems[i].quantity;
      stampTotal += stamp;
    }

    // 스탬프 적립
    const stampPromises = [];
    for (let i = 0; i < stampTotal; i++) {
      stampPromises.push(
        Stamps.insert({
          user_id: userId,
          store_id: storeId,
          createdAt: new Date(),
        })
      );
    }

    await Promise.all(stampPromises);

    if (!UserStores.findOne({ user_id: userId, store_id: storeId })) {
      UserStores.insert({
        user_id: userId,
        store_id: storeId,
      });
    }

    Carts.remove({ user_id: userId });

    setTimeout(async () => {
      await UserNotifications.insert({
        user_id: userId,
        notificationType: "stamp 발급",
        typeId: stampPromises,
        createdAt: new Date(),
        isRead: false,
      });
    }, 3000);

    return "결제가 완료되었습니다";
  },

  "payments.cancelPayment"(_id) {
    const payment = Payments.findOne({ _id });
    const { user_id, store_id, payItems } = payment;

    const stampTotal = payItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    // 스탬프 회수
    const stamps = Stamps.find(
      { user_id, store_id },
      { sort: { createdAt: -1 }, limit: stampTotal }
    ).fetch();
    const stampIds = stamps.map((stamp) => stamp._id);
    Stamps.remove({ _id: { $in: stampIds } });

    // 리뷰 삭제
    const reviewResult = Reviews.remove({ payment_id: _id });

    // 결제 취소 처리
    const result = Payments.update({ _id }, { $set: { status: "취소" } });
    return { result, reviewResult };
  },

  paymentPOS(userId, storeId, orderId, orderItems, totalSum) {
    return Payments.insert({
      user_id: userId,
      store_id: storeId,
      order_id: orderId,
      payItems: orderItems,
      totalSum,
      paymentDate: new Date(),
      status: "완료",
    });
  },

  async updatePayment(paymentId, currentUsername) {
    try {
      console.log(paymentId, currentUsername);

      // 사용자 정보 가져오기
      let userInfo = await Meteor.users.findOneAsync({
        username: currentUsername,
      }); // 비동기 호출
      const paymentInfo = await Payments.findOneAsync({ _id: paymentId }); // 비동기 호출
      if (!paymentInfo) throw new Error("Payment record not found");
      const storeId = paymentInfo.store_id;

      // 사용자 정보가 없으면 새 계정 생성
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
        userInfo = await Meteor.users.findOneAsync({
          username: currentUsername,
        });
      }
      if (!userInfo) throw new Error("Failed to retrieve user information");

      // UserStores에 사용자-스토어 연결 존재 여부 확인
      const userStoreLink = await UserStores.findOneAsync({
        user_id: userInfo._id,
        store_id: storeId,
      });
      if (!userStoreLink) {
        await UserStores.insertAsync({
          user_id: userInfo._id,
          store_id: storeId,
        });
      }

      // Payment 업데이트
      return await Payments.updateAsync(
        { _id: paymentId },
        { $set: { user_id: userInfo._id } }
      );
    } catch (error) {
      console.error("Error in updatePayment:", error);
      throw error; // 에러를 호출자로 전달
    }
  },
});
