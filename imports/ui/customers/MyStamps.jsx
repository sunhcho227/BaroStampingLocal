// MyStamps.jsx
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stamps, Stores, Coupons } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import { Link } from "react-router-dom";
import "/imports/ui/lib/utils.js";
import Header from "/imports/ui/customers/Header.jsx";

export default () => {
  const user = useTracker(() => Meteor.user(), []);

  // useTracker 선언
  useTracker(()=>{
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  })

  // 스탬프 발급중인 가게
  const myStampStores = Stamps.find({ user_id: user._id }).fetch();
  const myStampStoresIds = myStampStores.map((stamp) => stamp.store_id);
  const myAllStampStores = [...new Set([...myStampStoresIds]),];

  const pageTitle = "마이 스탬프";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <div>
      <Header pageTitle={pageTitle}/>
      <Nav />
      <h3>{user.profile.nickname}님 환영합니다</h3>
      <h1>마이 스탬프 화면 입니다</h1>
      <section>
          <h3>스탬프 적립중인 가게 {Stores.find({ _id: { $in: myAllStampStores} }).fetch().length}개</h3>
          {Stores.find({ _id: { $in: myAllStampStores} }).fetch().map((store) => {
            return (
              <div key={store._id}>
                <h4>{store.storeName}</h4>
                <p>{store.couponInformation} 서비스 쿠폰</p>
                <div
                  style={{
                    width: "400px",
                    height: "30px",
                    backgroundColor: "gray",
                    color: "#FFF",
                    textAlign: "center",
                  }}
                >
                  스탬프 이미지
                </div>
                <p>
                  스탬프 현황: {Stamps.find({ user_id: user._id, store_id:store._id }).fetch().length} / {store.maxStamp}
                </p>
                {Stamps.find({ user_id: user._id, store_id: store._id }).fetch().length >= store.maxStamp ? (
                <div>
                  <p>
                    스탬프가 목표에 달성되었습니다! <br />
                    쿠폰으로 교환하여 편하게 사용해보세요!
                  </p>
                  <Link to="/customers/makeCoupon" state={{ storeId: store._id }}>
                    <button style={ { marginBottom: "20px"} }>쿠폰 발급 받기</button>
                  </Link>
                </div>
              ) : (
                <p>
                  스탬프 {store.maxStamp}개를 모으면 <u>쿠폰</u>으로 사용할 수
                  있어요!
                </p>
              )}
                <Link to={`/customers/storeDetail/${store.storeUrlName}`}>
                  <button>자세히 보기</button>
                </Link>
                <hr />
              </div>
            );
          })}
        </section>
    </div>
  );
};
