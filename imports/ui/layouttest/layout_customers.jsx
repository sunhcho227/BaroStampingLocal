import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stamps, Stores, Coupons } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Barcode from "react-barcode";
import { QRCodeCanvas } from "qrcode.react";
import "/imports/ui/lib/utils.js";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();

  // useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  const [nickname, setNickname] = useState(user?.profile.nickname || "");
  const [isEditing, setIsEditing] = useState(false);

  // 고객님과 함께한 N일째
  const myFirstDay =
    new Date().diffInDays(new Date(user?.profile.createdAt)) + 1;

  // 스탬프 적립중인 가게 Ids
  const myStampStores = Stamps.find({ user_id: user._id }).fetch();
  const myStampStoresIds = myStampStores.map((coupon) => coupon.store_id);
  const myAllStampStoresIds = [...new Set([...myStampStoresIds])];

  // 스탬프가 max.Stamp를 당성한 가게
  const myAvailableStores = Stores.find({ _id: { $in: myAllStampStoresIds } })
    .fetch()
    .filter((store) => {
      const myStoreStampCount = Stamps.find({
        user_id: user._id,
        store_id: store._id,
      }).count(); // 스탬프 개수 계산
      return myStoreStampCount >= store.maxStamp; // 스탬프 개수가 최대값 이상이면 쿠폰 발급 가능
    });

  // userStores로 수정
  // 스탬프가 있거나 쿠폰이 있는 가게
  const myAllStores1 = Stamps.find({ user_id: user._id }).fetch();
  const myAllStores2 = Coupons.find({ user_id: user._id }).fetch();
  const storeIdsFromStamps = myAllStores1.map((stamp) => stamp.store_id);
  const storeIdsFromCoupons = myAllStores2.map((coupon) => coupon.store_id);
  const allStoreIds = [
    ...new Set([...storeIdsFromStamps, ...storeIdsFromCoupons]),
  ];

  // 닉네임 수정
  const handleNicknameChange = () => {
    if (nickname !== user?.profile?.nickname) {
      Meteor.call("users.updateProfile", user._id, { nickname }, (error) => {
        if (error) {
          console.error("Error updating nickname:", error);
        } else {
          setIsEditing(false);
        }
      });
    } else {
      setIsEditing(false);
    }
  };

  /// 비회원일 경우 회원가입 유도 메시지 표시
  const isMember = user?.profile?.userGrade === "회원";

  // qr 정보
  const qrSize = 160;
  const qrData = JSON.stringify({ user_id: user?._id });

  return (
    <>
      <Nav />
      <Header />
      <div className="customers-container">
        <div>
          {/* 웰컴 섹션 */}
          <div className="welcome-section">
            <div className="welcome-message">
              <div className="text_body_l">
                <span className="text_title_m primary">
                  {user?.profile?.nickname || "GUEST"}
                </span>
                님 방문을 환영합니다
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="새 닉네임을 입력하세요"
                  />
                  <button onClick={handleNicknameChange}>저장</button>
                </div>
              ) : (
                <div>
                  <button
                    className="edit-nickname-btn"
                    onClick={() => {
                      setIsEditing(true);
                      setNickname(user?.profile?.nickname);
                    }}
                  >
                    닉네임 수정
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* QR 섹션 */}
          <div className="qr_section">
            <div className="user-actions">
              <div className="action-item">
                <div className="action-icon">
                  <img src="/icons/myqr.svg" alt="마이QR" />
                </div>
                <div className="text_body_l">마이QR</div>
              </div>
              <div className="action-item">
                <div className="action-icon">
                  <img src="/icons/qrscan.svg" alt="QR적립" />
                </div>
                <div className="text_body_l font_black_light">QR적립</div>
              </div>
              <div className="action-item">
                <div className="action-icon">
                  <img src="/icons/list.svg" alt="QR주문" />
                </div>
                <div className="text_body_l font_black_light">QR주문</div>
              </div>
              <div className="action-item">
                <div className="action-icon">
                  <img src="/icons/typing.svg" alt="코드등록" />
                </div>
                <div className="text_body_l font_black_light">코드등록</div>
              </div>
            </div>
            <div className="qr_img">
              <QRCodeCanvas value={qrData} size={qrSize} />
            </div>
            <div className="text_body_l font_black_light">
              카운터에 이 화면을 제시해주세요
            </div>
          </div>
        </div>

        {/* main_list section1 */}
        {/* 현재 사용 할 수 있는 쿠폰 */}
        <div className="main_list">
          {/* 리스트 헤더 */}
          <div className="section-header">
            <div>
              <span className="text_title_s">현재 사용 할 수 있는 쿠폰</span>
              <span className="text_title_s">
                {" "}
                {
                  Coupons.find({
                    user_id: user._id,
                    couponUsage: false,
                  }).fetch().length
                }
                개
              </span>
            </div>
            <div className="icon_16">
              <img src="/icons/arrow_bottom.svg" alt="더보기" />
            </div>
          </div>

          {/* 가게 상세 섹션 */}
          {Coupons.find({ user_id: user._id, couponUsage: false })
            .fetch()
            .slice(0, 3)
            .map((coupon) => {
              const expirationDate = new Date(coupon.createdAt).addDays(30);
              return (
                <div key={coupon._id}>
                  <div className="coupon-section">
                    <div className="coupon-item">
                      <div className="coupon-thumbnail"></div>
                      <div className="coupon-details">
                        <div className="text_title_s">
                          {Stores.findOne({ _id: coupon.store_id }).storeName}
                        </div>
                        <div className="text_body_s">
                          {
                            Stores.findOne({ _id: coupon.store_id })
                              .couponInformation
                          }
                          <br />
                          {coupon.couponMemo ??
                            `발급날짜: ${new Date(
                              coupon.createdAt
                            ).toLocaleDateString()}`}
                          <br />
                          유효기간: ~2024.12.25
                        </div>
                      </div>
                    </div>
                    <div className="coupon-buttons">
                      <Link
                        to={`/customers/StoreDetail/${
                          Stores.findOne({ _id: coupon.store_id })?.storeUrlName
                        }`}
                      >
                        <button className="btn-secondary-outline">
                          가게 자세히 보기
                        </button>
                      </Link>
                      <Link to={`/customers/usingCoupon/${coupon._id}`}>
                        <button className="btn-secondary">쿠폰 사용하기</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* main_list section2 */}
        <div className="main_list">
          {/* 리스트 헤더 */}
          <div className="section-header">
            <div>
              <span className="text_title_s">적립중인 가게</span>
              <span className="text_title_s">
                {" "}
                {
                  Stores.find({ _id: { $in: myAllStampStoresIds } }).fetch()
                    .length
                }
                개
              </span>
            </div>
            <div className="icon_16">
              <img src="/icons/arrow_bottom.svg" alt="더보기" />
            </div>
          </div>
          {Stores.find({ _id: { $in: myAllStampStoresIds } })
            .fetch()
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
                        <div className="bar-img"></div>
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
                        <button className="btn-secondary-outline">
                          가게 자세히 보기
                        </button>
                        <button className="btn-secondary">
                          쿠폰 발급 받기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="store-section">
                      <div className="text_title_s">{store.storeName}</div>
                      <div className="bar-section">
                        <div className="bar-img"></div>
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
                      <button className="btn-secondary-outline btn-fill">
                        가게 자세히 보기
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <div className="banner-section">
          <div className="banner-item"></div>
          <div className="banner-item"></div>
          <div className="banner-item"></div>
        </div>
      </div>
    </>
  );
};
