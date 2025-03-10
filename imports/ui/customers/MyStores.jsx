// MyStores.jsx
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stamps, Stores, Coupons } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import ReadMoreButton from "/imports/ui/customers/ReadMoreButton.jsx";
import GaugeBar from "/imports/ui/customers/GaugeBar.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import "/imports/ui/lib/utils.js";

export default () => {
  const user = useTracker(() => Meteor.user(), []);

  // useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  // 스탬프와 쿠폰이 있는 가게
  const myAllStores1 = Stamps.find({ user_id: user._id }).fetch();
  const myAllStores2 = Coupons.find({ user_id: user._id }).fetch();

  // 두 배열에서 store_id만 추출
  const storeIdsFromStamps = myAllStores1.map((stamp) => stamp.store_id);
  const storeIdsFromCoupons = myAllStores2.map((coupon) => coupon.store_id);

  // store_id를 합치고 중복 제거
  const allStoreIds = [
    ...new Set([...storeIdsFromStamps, ...storeIdsFromCoupons]),
  ];

  // 더보기 버튼
  // 표시할 쿠폰 개수를 관리하는 상태 변수 (초기값 3개)
  const [unusedDisplayCount, setUnusedDisplayCount] = useState(3);
  const [moreStorecount, setmoreStorecount] = useState(3);

  // 더보기 버튼 클릭 시 표시할 쿠폰 개수 증가
  const handleLoadMoreUnused = () => {
    setUnusedDisplayCount((prev) => prev + 3); // 3개씩 더 표시
  };

  const handlemoreStorecount = () => {
    setmoreStorecount((prev) => prev + 3); // 3개씩 더 표시
  };

  // 스탬프 적립중인 가게 Ids
  const myStampStores = Stamps.find({ user_id: user._id }).fetch();
  const myStampStoresIds = myStampStores.map((coupon) => coupon.store_id);
  const myAllStampStoresIds = [...new Set([...myStampStoresIds])];

  const pageTitle = "서비스 이용중인 스토어";
  document.title = `Stamping - ${pageTitle}`;
  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="mystore-container">
        <div className="mystore-store mystoreonly">
          <div className="title_all">
            스탬프 적립중인 가게 {allStoreIds.length}개
          </div>

          {allStoreIds.length === 0 ? (
            <p className="text_body_m">현재 적립중인 가게가 없습니다</p>
          ) : (
            Stores.find({ _id: { $in: myAllStampStoresIds } })
              .fetch()
              .slice(0, moreStorecount)
              .map((store) => {
                // 현재 유저가 가진 스탬프 개수 계산
                const userStampCount = Stamps.find({
                  user_id: user._id,
                  store_id: store._id,
                }).fetch().length;

                return (
                  <div key={store._id}>
                    {userStampCount >= store.maxStamp ? (
                      <div className="store-section">
                        <div className="text_title_s">{store.storeName}</div>
                        <div className="bar-section">
                          <div className="bar-img">
                            <GaugeBar
                              current={userStampCount}
                              max={store.maxStamp}
                            />
                          </div>
                          <div className="bar-text">
                            <span className="text_title_xs primary">
                              {userStampCount}
                            </span>
                            <span className="text_title_xs">/</span>
                            <span className="text_title_xs">
                              {store.maxStamp}
                            </span>
                          </div>
                        </div>
                        <div className="text_body_s">
                          스탬프 보상을 달성하여{" "}
                          <span className="text_title_xs primary">
                            {store.couponInformation}
                          </span>
                          으로 바꿀 수 있어요!
                        </div>
                        <div className="coupon-buttons">
                          <Link
                            to={`/customers/storeDetail/${store.storeUrlName}`}
                          >
                            <button className="btn-secondary-outline">
                              자세히 보기
                            </button>
                          </Link>
                          <Link
                            to="/customers/makeCoupon"
                            state={{ storeId: store._id }}
                          >
                            <button className="btn-secondary">
                              쿠폰 발급 받기
                            </button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="store-section">
                        <div className="text_title_s">{store.storeName}</div>
                        <div className="bar-section">
                          <div className="bar-img">
                            <GaugeBar
                              current={userStampCount}
                              max={store.maxStamp}
                            />
                          </div>
                          <div className="bar-text">
                            <span className="text_title_xs primary">
                              {userStampCount}
                            </span>
                            <span className="text_title_xs">/</span>
                            <span className="text_title_xs">
                              {store.maxStamp}
                            </span>
                          </div>
                        </div>
                        <div className="text_body_s">
                          12개를 모으면{" "}
                          <span className="text_title_xs primary">
                            {store.couponInformation}
                          </span>
                          으로 사용할 수 있어요!
                        </div>
                        <Link
                          to={`/customers/storeDetail/${store.storeUrlName}`}
                        >
                          <button className="btn-secondary-outline btn-fill">
                            자세히 보기
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })
          )}

          {Stores.find({ _id: { $in: allStoreIds } }).fetch().length >
            moreStorecount && (
            <ReadMoreButton
              onClick={handlemoreStorecount}
              text="스탬프 적립중인 가게 더보기"
            />
          )}
        </div>

        <div>
          <div className="mystore-store mystoreonly">
            <div className="title_all">자주가는 가게 리스트</div>

            {Stores.find({ _id: { $in: allStoreIds } }).fetch().length === 0 ? (
              <p className="text_body_m">방문한 가게가 없습니다</p>
            ) : (
              Stores.find({ _id: { $in: allStoreIds } })
                .fetch()
                .map((store) => {
                  return (
                    <div key={store._id}>
                      <div className="store-section-fill bg">
                        <div className="text_title_s">{store.storeName}</div>
                        <div className="text_body_m">
                          {store.storePhoneNumber}
                          <br />
                          {store.storeAddress}
                        </div>
                        <div className="text_body_s">
                          스탬프 {store.maxStamp}개를 모으면{" "}
                          <span className="text_title_xs primary">
                            {store.couponInformation}
                          </span>
                          으로 교환할 수 있어요!
                        </div>
                        <Link
                          to={`/customers/storeDetail/${store.storeUrlName}`}
                        >
                          <button className="btn-secondary-outline btn-fill">
                            자세히 보기
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </>
  );
};
