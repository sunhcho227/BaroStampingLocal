// stores.js
import { Stores, Stamps, Coupons } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";

Meteor.methods({
  "stores.getName": function (storeId) {
    const store = Stores.findOne({ _id: storeId });
    if (!store) {
      throw new Meteor.Error(
        "store-not-found",
        "해당 스토어를 찾을 수 없습니다."
      );
    }
    return store.storeName; // storeName 반환
  },

  // 가게 설명 업데이트
  "storeInformation.update"(store_id, storeInformation) {
    Stores.update(
      { _id: store_id },
      { $set: { storeInformation: storeInformation } }
    );
  },

  // 가게 보상 업데이트 
  "couponInformation.update"(store_id, couponInformation) {
    Stores.update(
      { _id: store_id },
      { $set: { couponInformation: couponInformation } }
    );
  },

  // 내가 갔던 모든 가게들 -> 앞으로는 userStores 콜렉션을 참고하세요 ^^
  getAllMyStores(userId) {
    // 사용자가 로그인되어 있는지 확인
    if (!userId) {
      throw new Meteor.Error("not-authorized", "로그인이 필요합니다.");
    }

    // Stamps와 Coupons 컬렉션에서 store_id를 추출
    const myAllStores1 = Stamps.find({ user_id: userId }).fetch();
    const myAllStores2 = Coupons.find({ user_id: userId }).fetch();

    const storeIdsFromStamps = myAllStores1.map((stamp) => stamp.store_id);
    const storeIdsFromCoupons = myAllStores2.map((coupon) => coupon.store_id);

    // 중복 제거
    const allStoreIds = [
      ...new Set([...storeIdsFromStamps, ...storeIdsFromCoupons]),
    ];

    return allStoreIds; // 결과 반환
  },

  // ai가 만든 가게 홍보 문구 storeLLM 업데이트
  updateStoreLLM(storeId, storeLLM) {
    Stores.update({ _id: storeId }, { $set: { storeLLM } });
  },
});
