// Stores.jsx
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

  const [stampCountByStore, setStampCountByStore] = useState({});
  const [couponCountByStore, setCouponCountByStore] = useState({});

  // const allStores = Stores.find().fetch();
  const [regularStores, setRegularStores] = useState([]);

  // 자주 가는 가게 목록 업데이트
  useEffect(() => {
    if (user) {
      const regularStoresData = Coupons.find({
        user_id: user._id,
      })
        .fetch()
        .map((coupon) => coupon.store_id);

      // 해당 store_id들을 기반으로 자주 가는 가게 목록을 stores에서 찾아오기
      const regularStoresList = Stores.find({
        _id: { $in: regularStoresData },
      }).fetch();
      setRegularStores(regularStoresList);
    }
  }, [user]);

  // 각 가게별 데이터 가져오기
  const { stores, stampCounts, couponCounts } = useTracker(() => {
    if (!user) return { stores: [], stampCounts: {}, couponCounts: {} };

    const stamps = Stamps.find({ user_id: user._id }).fetch();
    const storeIds = [...new Set(stamps.map((stamp) => stamp.store_id))];
    
    // storeIds 배열에 있는 각 가게 ID에 해당하는 정보
    const stores = Stores.find({ _id: { $in: storeIds } }).fetch();
    
    const stampCounts = {};
    const couponCounts = {};
    
    stores.forEach((store) => {
      // 각 가게별 스탬프 카운트와 쿠폰 카운트 계산
      const stampCount = stamps.filter((stamp) => stamp.store_id === store._id).length;
      stampCounts[store._id] = stampCount;

      const coupons = Coupons.find({ user_id: user._id, store_id: store._id, couponUsage: false }).fetch();
      couponCounts[store._id] = coupons.length;
    });
    
    return { stores, stampCounts, couponCounts };
  }, [user]);

  useEffect(() => {
    if (stores.length > 0) {
      stores.forEach((store) => {
        // 서버 메소드 호출로 각 가게별 스탬프와 쿠폰 카운트 가져오기
        Meteor.call("userStampCount", user._id, store._id, (error, result) => {
          if (!error) {
            setStampCountByStore((prev) => ({
              ...prev,
              [store._id]: result, // store ID별로 스탬프 카운트 저장
            }));
          }
        });

        Meteor.call("userCouponCount", user._id, store._id, (error, result) => {
          if (!error) {
            setCouponCountByStore((prev) => ({
              ...prev,
              [store._id]: result, // store ID별로 쿠폰 카운트 저장
            }));
          }
        });
      });
    }
  }, [stores, user]);

  const pageTitle = "스토어 리스트";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <div>
      <Header pageTitle={pageTitle}/>
      <h1>가게 리스트 화면 입니다</h1>
      <Nav />
      <h3>{user?.profile?.nickname}님 방문을 환영합니다</h3>
      <hr />

      <h3>스탬프 적립중인 가게</h3>
      {stores.length > 0 ? (
        stores.map((store) => {
          // store별 스탬프 카운트와 쿠폰 카운트를 가져옴
          const stampCount = stampCounts[store._id] || 0;
          const couponCount = couponCounts[store._id] || 0;

          return (
            <div key={store._id}>
              <h4>{store.storeName}</h4>
              <p>{store.storeInformation}</p>
              {couponCount > 0 && (
                <div>
                  <p>사용 가능한 쿠폰: {couponCount}개</p>
                  <Link to="/customers/coupons">
                  <button style={ { marginBottom: "20px"} }>전체 쿠폰 확인하기</button>
                  </Link>                  
                </div>
              )}
              <div
                style={{
                  width: "400px",
                  height: "20px",
                  backgroundColor: "green",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                이미지 처리된 게이지
              </div>
              <p>스탬프 현황: {stampCount} / {store.maxStamp}</p>
              <p>스탬프 달성 보상: {store.couponInformation}</p>
              <p>사용 가능한 쿠폰: {couponCount}개</p>
              {stampCount >= store.maxStamp ? (
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
        })
      ) : (
        <p>적립 중인 가게가 없습니다.</p>
      )}
      {regularStores.length > 0 && (
        <section>
          <h3>자주 가는 가게 리스트</h3>
          {regularStores.map((store) => {
            return (
              <div key={store._id}>
                <h4>{store.storeName}</h4>
                <p>{store.storeAddress}</p>
                <p>
                  스탬프 달성 시 {store.couponInformation} 서비스 쿠폰을
                  드립니다
                </p>
                <Link to={`/customers/storeDetail/${store.storeUrlName}`}>
                  <button>자세히 보기</button>
                </Link>
              </div>
            );
          })}
          <hr />
        </section>
      )}

      {/* <h3>모든 가게 리스트</h3>
      {allStores.map((store) => {
        return (
          <div key={store._id}>
            <h4>{store.storeName}</h4>
            <p>{store.storeInformation}</p>
            <p>{store.storeAddress}</p>
            <p>{store.storePhoneNumber}</p>
            <p>
              스탬프 달성 시 {store.couponInformation} 서비스 쿠폰을
              드립니다
            </p>
            <Link to={`/customers/storeDetail/${store.storeUrlName}`}>
              <button>자세히 보기</button>
            </Link>
          </div>
        );
      })} */}
    </div>
  );
};
