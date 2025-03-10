import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import {
  Stores,
  StoreAnnouncements,
  Coupons,
  Stamps,
  Reviews,
  UserStores,
} from "/imports/api/collections";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = useTracker(() => Meteor.user(), []);
  const { storeUrlName } = useParams();
  // const store = Stores.findOne({ storeUrlName });
  const store = Stores.findOne({ storeUrlName: "senaCafe" });

  // useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
    Reviews.find().fetch();
    UserStores.find().fetch();
  });

  // 지도에 사용될 좌표 설정
  const defaultLat = 37.539449;
  const defaultLng = 127.066732;
  const mapCenter = {
    lat: store?.storeLatitude || defaultLat,
    lng: store?.storeLongitude || defaultLng,
  };

  // 지도 컴포넌트
  const KakaoMap = () => (
    <Map
      center={mapCenter}
      style={{ width: "400px", height: "200px" }}
      level={3}
    >
      <MapMarker position={mapCenter}>
        <div>{store ? store.storeName : "여기입니다!"}</div>
      </MapMarker>
    </Map>
  );

  return (
    <>
      <Nav />
      <Header />
      <div className="storedetail-container">
        <div className="storeimg">
          <div className="text_title_l">{store.storeName}</div>
          <div className="text_body_m">
            전화번호 : {store.storePhoneNumber}
            <br />
            주소 : {store.storeAddress}
          </div>
        </div>

        <div>
          <div className="store-section-fill">
            <div className="text_title_m primary">보유 스탬프</div>
            {Stamps.find({ user_id: user._id, store_id: store._id }).fetch()
              .length >= store.maxStamp ? (
              <div>
                <div className="text_title_s">{store.storeName}</div>
                <div className="bar-section">
                  <div className="bar-img"></div>
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
                <div className="coupon-buttons">
                  <Link
                    to="/customers/makeCoupon"
                    state={{ storeId: store._id }}
                  >
                    <button className="btn-secondary">쿠폰 발급 받기</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="store-section">
                  <div className="text_title_s">{store.storeName}</div>
                  <div className="bar-section">
                    <div className="bar-img"></div>
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
                    store_id: store._id,
                    couponUsage: false,
                  }).fetch().length
                }{" "}
                개
              </span>
            </div>
            <div className="icon_16">
              <img src="/icons/arrow_bottom.svg" alt="더보기" />
            </div>
          </div>

          {/* 가게 상세 섹션 */}
          <div className="coupon-section">
            {Coupons.find({
              user_id: user._id,
              store_id: store._id,
              couponUsage: false,
            })
              .fetch()
              .map((coupon) => {
                const expirationDate = new Date(coupon.createdAt).addDays(30);
                return (
                  <div key={coupon._id}>
                    <div className="coupon-item">
                      <div className="coupon-thumbnail"></div>
                      <div className="coupon-details">
                        <div className="text_title_s">{store.storeName}</div>
                        <div className="text_body_s">
                          {store.couponInformation} 쿠폰
                          <br />
                          {coupon.couponMemo || `스탬프 적립 쿠폰`} 쿠폰
                          <br />
                          유효기간: ~{expirationDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="coupon-buttons">
                      <Link to={`/customers/usingCoupon/${coupon._id}`}>
                        <button className="btn-secondary">쿠폰 사용하기</button>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <div className="store-navigation">
            <div className="nav-item active">
              <div className="text_title_m">정보</div>
            </div>
            <div className="nav-item">
              <div className="text_title_m">주문하기</div>
            </div>
            <div className="nav-item">
              <div className="text_title_m">리뷰 보기</div>
            </div>
          </div>
          <div className="announcement-section">
            <div className="text_title_m primary">공지사항</div>
            <div className="announcement-list">
              <div className="announcement-item">
                <div className="announcement-title">
                  <div className="text_title_xs">
                    겨울맞이 특별 이벤트 안내!
                  </div>
                  <div className="text_body_xs">2024. 11. 25</div>
                </div>
                <div className="text_body_s">
                  안녕하세요, 세나카페입니다! ❄️
                  <br />
                  추운 겨울을 따뜻하게 맞이하실 수 있도록 겨울 한정 무료 음료
                  쿠폰 이벤트를 준비했습니다.
                </div>
              </div>
            </div>
            <div className="announcement-list">
              <div className="announcement-item">
                <div className="announcement-title">
                  <div className="text_title_xs">
                    겨울맞이 특별 이벤트 안내!
                  </div>
                  <div className="text_body_xs">2024. 11. 25</div>
                </div>
                <div className="text_body_s">
                  안녕하세요, 세나카페입니다! ❄️
                  <br />
                  추운 겨울을 따뜻하게 맞이하실 수 있도록 겨울 한정 무료 음료
                  쿠폰 이벤트를 준비했습니다.
                </div>
              </div>
            </div>
            <div className="announcement-list">
              <div className="announcement-item">
                <div className="announcement-title">
                  <div className="text_title_xs">
                    겨울맞이 특별 이벤트 안내!
                  </div>
                  <div className="text_body_xs">2024. 11. 25</div>
                </div>
                <div className="text_body_s">
                  안녕하세요, 세나카페입니다! ❄️
                  <br />
                  추운 겨울을 따뜻하게 맞이하실 수 있도록 겨울 한정 무료 음료
                  쿠폰 이벤트를 준비했습니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="store-navigation">
            <div className="nav-item">
              <div className="text_title_m">정보</div>
            </div>
            <div className="nav-item active">
              <div className="text_title_m">주문하기</div>
            </div>
            <div className="nav-item">
              <div className="text_title_m">리뷰 보기</div>
            </div>
          </div>
          <div className="product-item">
            <div>
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox-input" />
                <span className="product-checkbox"></span>
              </label>
            </div>
            <div className="product-details">
              <div className="product-info">
                <div className="text_body_l">피치 망고 자봉 클랙티</div>
                <div className="text_body_l">223,000원</div>
              </div>
              <div className="product-quantity">
                <div className="quantity-control-icon">
                  <img src="/icons/minus.svg" alt="minus" />
                </div>
                <div className="quantity-value">99</div>
                <div className="quantity-control-icon">
                  <img src="/icons/plus.svg" alt="plus" />
                </div>
              </div>
            </div>
          </div>
          <div className="product-item">
            <div>
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox-input" />
                <span className="product-checkbox"></span>
              </label>
            </div>
            <div className="product-details">
              <div className="product-info">
                <div className="text_body_l">피치 망고 자봉 클랙티</div>
                <div className="text_body_l">223,000원</div>
              </div>
              <div className="product-quantity">
                <div className="quantity-control-icon">
                  <img src="/icons/minus.svg" alt="minus" />
                </div>
                <div className="quantity-value">99</div>
                <div className="quantity-control-icon">
                  <img src="/icons/plus.svg" alt="plus" />
                </div>
              </div>
            </div>
          </div>
          <div className="product-item">
            <div>
              <label className="checkbox-container">
                <input type="checkbox" className="checkbox-input" />
                <span className="product-checkbox"></span>
              </label>
            </div>
            <div className="product-details">
              <div className="product-info">
                <div className="text_body_l">피치 망고 자봉 클랙티</div>
                <div className="text_body_l">223,000원</div>
              </div>
              <div className="product-quantity">
                <div className="quantity-control-icon">
                  <img src="/icons/minus.svg" alt="minus" />
                </div>
                <div className="quantity-value">99</div>
                <div className="quantity-control-icon">
                  <img src="/icons/plus.svg" alt="plus" />
                </div>
              </div>
            </div>
          </div>
          <div className="total-amount-container">
            <div className="total-amount">
              <div className="text_body_l">총 금액</div>
              <div className="amount-container">
                <div className="amount-value">123,456,417</div>
                <div className="text_body_l">원</div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn-secondary-outline">장바구니 담기</button>
              <button className="btn-secondary">바로 구매</button>
            </div>
          </div>

          <div>
            <div className="store-navigation">
              <div className="nav-item">
                <div className="text_title_m">정보</div>
              </div>
              <div className="nav-item">
                <div className="text_title_m">주문하기</div>
              </div>
              <div className="nav-item active">
                <div className="text_title_m">리뷰 보기</div>
              </div>
            </div>
            <div className="reviews-container">
              <div className="review-card">
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-avatar" />
                    <div className="user-details">
                      <div className="text_title_xs">홍길동</div>
                      <div className="user-rating">
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                      </div>
                    </div>
                  </div>
                  <div className="text_body_xs">2024. 11. 25</div>
                </div>
                <div className="text_body_m">
                  직원분들이 정말 친절하고 분위기도 너무 좋아요! 커피도 깔끔한
                  맛이라 매일 오고 싶어요. 특히 시즌 한정 음료가 항상
                  기대됩니다! 👍
                </div>
              </div>
              <div className="review-card">
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-avatar" />
                    <div className="user-details">
                      <div className="user-name">김철수</div>
                      <div className="user-rating">
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                        <img src="/icons/star.svg" alt="더보기" />
                      </div>
                    </div>
                  </div>
                  <div className="review-date">2024. 11. 25</div>
                </div>
                <div className="review-comment">
                  직원분들이 정말 친절하고 분위기도 너무 좋아요! 커피도 깔끔한
                  맛이라 매일 오고 싶어요. 특히 시즌 한정 음료가 항상
                  기대됩니다! 👍
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
