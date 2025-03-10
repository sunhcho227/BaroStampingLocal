import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Stores, Coupons, Stamps } from "/imports/api/collections";
import couponIsVisible from "../styles/couponIsVisible.css";
import Header from "/imports/ui/customers/Header.jsx";
import ReadMoreButton from "/imports/ui/customers/ReadMoreButton.jsx";
import GaugeBar from "/imports/ui/customers/GaugeBar.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

const UserStamps = () => {
  const user = useTracker(() => Meteor.user(), []);
  const { storeUrlName } = useParams();
  const store = Stores.findOne({ storeUrlName });
  const storeId = store._id;

  // useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  // 현재 사용할 수 있는 쿠폰
  const [isCouponListVisible, setIsCouponListVisible] = useState(true);
  const toggleCouponList = () => {
    setIsCouponListVisible((prev) => !prev);
  };

  // 더보기 버튼 구현
  const [couponDisplayCount, setcouponDisplayCount] = useState(2);

  const handlecouponDisplayCount = () =>
    setcouponDisplayCount((prev) => prev + 3);

  return (
    <div className="userstanos-control">
      <div>
        <div>
          {Stamps.find({ user_id: user._id, store_id: store._id }).fetch()
            .length >= store.maxStamp ? (
            <div className="store-section">
              <div className="text_title_m primary">보유 스탬프</div>
              <div className="bar-section">
                <div className="bar-img">
                  <GaugeBar
                    current={
                      Stamps.find({
                        user_id: user._id,
                        store_id: store._id,
                      }).fetch().length
                    }
                    max={store.maxStamp}
                  />
                </div>
                <div className="bar-text">
                  <span className="text_title_xs primary">
                    {
                      Stamps.find({
                        user_id: user._id,
                        store_id: store._id,
                      }).fetch().length
                    }
                  </span>
                  <span className="text_title_xs">/</span>
                  <span className="text_title_xs">{store.maxStamp}</span>
                </div>
              </div>
              <div className="text_body_s">
                스탬프 보상을 달성하여{" "}
                <span className="text_title_xs primary">
                  {store.couponInformation} 쿠폰
                </span>
                으로 바꿀 수 있어요!
              </div>
              <Link to="/customers/makeCoupon" state={{ storeId: store._id }}>
                <button className="btn-secondary btn-fill">
                  쿠폰 발급 받기
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="store-section">
                <div className="text_title_m primary">보유 스탬프</div>
                {/* <div className="text_title_s">{store.storeName}</div> */}
                <div className="bar-section">
                  <div className="bar-img">
                    <GaugeBar
                      current={
                        Stamps.find({
                          user_id: user._id,
                          store_id: store._id,
                        }).fetch().length
                      }
                      max={store.maxStamp}
                    />
                  </div>
                  <div className="bar-text">
                    <span className="text_title_xs primary">
                      {
                        Stamps.find({
                          user_id: user._id,
                          store_id: store._id,
                        }).fetch().length
                      }
                    </span>
                    <span className="text_title_xs">/</span>
                    <span className="text_title_xs">{store.maxStamp}</span>
                  </div>
                </div>
                <div className="text_body_s">
                  {store.maxStamp}개를 모으면{" "}
                  <span className="text_title_xs primary">
                    {store.couponInformation} 쿠폰
                  </span>
                  으로 사용할 수 있어요!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* main_list section1 */}
      {/* 현재 사용 할 수 있는 쿠폰 */}
      <div className="main_list userstamps">
        {/* 리스트 헤더 */}
        <div className="section-header" onClick={toggleCouponList}>
          <div>
            <span className="text_title_s">현재 사용 할 수 있는 쿠폰</span>
            <span className="text_title_s">
              {" "}
              {
                Coupons.find({
                  user_id: user._id,
                  store_id: store._id,
                  couponUsage: false,
                }).fetch().length
              }{" "}
              개
            </span>
          </div>
          <div className="icon_16">
            <img
              src={`/icons/${
                isCouponListVisible ? "arrow_top" : "arrow_bottom"
              }.svg`}
              alt="더보기"
            />
          </div>
        </div>

        {/* 가게 상세 섹션 */}
        {Coupons.find({
          user_id: user._id,
          store_id: store._id,
          couponUsage: false,
        }).fetch().length === 0 ? (
          <div className="text_body_l p-4">
            현재 사용할 수 있는 쿠폰이 없습니다
          </div>
        ) : (
          <div
            className={`storedetail-useablecouponlist ${
              isCouponListVisible ? "show" : "hide"
            }`}
          >
            {Coupons.find({
              user_id: user._id,
              store_id: store._id,
              couponUsage: false,
            })
              .fetch()
              .slice(0, couponDisplayCount)
              .map((coupon) => {
                const expirationDate = new Date(coupon.createdAt);
                expirationDate.setDate(expirationDate.getDate() + 30);

                return (
                  <div key={coupon._id}>
                    <Link to={`/customers/usingCoupon/${coupon._id}`}>
                      <div className="sc-coupon-card">
                        <div className="sc-coupon-content">
                          <div className="sc-coupon-details">
                            <div className="text_title_s">
                              {store.couponInformation} 쿠폰
                            </div>
                            <div className="sc-coupon-info">
                              <div className="text_body_l">
                                {store.storeName}
                              </div>
                              <div className="text_body_l">
                                {coupon.couponMemo || `스탬프 적립 쿠폰`}
                              </div>
                            </div>
                            <div className="text_body_xs">
                              유효기간 : ~{" "}
                              {expirationDate.toLocaleDateString().slice(0, -1)}
                            </div>
                          </div>
                        </div>
                        <div className="sc-coupon-action">
                          <div className="text_body_xs">
                            쿠폰
                            <br />
                            사용
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}

            {Coupons.find({
              user_id: user._id,
              store_id: store._id,
              couponUsage: false,
            }).fetch().length > couponDisplayCount && (
              <button
                onClick={handlecouponDisplayCount}
                className="read-more-button"
              >
                더보기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStamps;
