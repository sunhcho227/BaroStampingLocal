import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Stamps, Stores, Coupons } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Nav from "./Nav.jsx";
import "/imports/ui/lib/utils.js";
import Header from "./Header.jsx";
import "../styles/user_main.css";
import couponIsVisible from "../styles/couponIsVisible.css";
import MainMyQR from "./MainMyQR.jsx";
import Reader from "../admins/Reader.jsx";
import CouponAddbyUser from "./CouponAddbyUser.jsx";
import ReadMoreButton from "/imports/ui/customers/ReadMoreButton.jsx";
import GaugeBar from "/imports/ui/customers/GaugeBar.jsx";
import CouponCard from "./couponCard";
import Loading from "../Loading.jsx";

export default () => {
  const user = Meteor.user();

  // 퍼블릭 이미지 사용
  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;
  

  /// useTracker 선언
  useTracker(() => {
    Stamps.find().fetch();
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  const [nickname, setNickname] = useState(user?.profile.nickname || "");
  const [isEditing, setIsEditing] = useState(false);

  // 스탬프 적립중인 가게 Ids
  const myStampStores = Stamps.find({ user_id: user._id }).fetch();
  const myStampStoresIds = myStampStores.map((coupon) => coupon.store_id);
  const myAllStampStoresIds = [...new Set([...myStampStoresIds])];

  // 닉네임 수정
  const handleNicknameChange = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    if (nickname !== user?.profile?.nickname) {
      Meteor.call(
        "users.updatenickname",
        user._id,
        nickname.trim(), // 공백만 입력된 경우를 방지
        (error) => {
          if (error) {
            console.error("Error updating nickname:", error);
          } else {
            setIsEditing(false);
          }
        }
      );
    } else {
      setIsEditing(false);
    }
  };

  //handleNicknameCancle
  const handleNicknameCancle = () => {
    setIsEditing(false);
  };

  
  //로그아웃처리
  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      Meteor.logout(() => {
        navigate("/");
      });
    }
  };

  /// 비회원일 경우 회원가입 유도 메시지 표시
  const isMember = user?.profile?.userGrade === "회원";

  // 현재 사용할 수 있는 쿠폰
  const [isCouponListVisible, setIsCouponListVisible] = useState(false);
  const [isStampListVisible, setIsStampListVisible] = useState(false);

  const toggleCouponList = () => setIsCouponListVisible((prev) => !prev);
  const toggleStampList = () => setIsStampListVisible((prev) => !prev);

  const pageTitle = "홈";
  document.title = `Stamping - ${pageTitle}`;

  // 유저 QR nav 선택 처리
  const [activeComponent, setActiveComponent] = useState("MainMyQR");

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  const getIconPath = (componentName, defaultPath, activePath) => {
    return activeComponent === componentName ? activePath : defaultPath;
  };

  const getTextClassName = (componentName) => {
    return activeComponent === componentName
      ? "text_body_l"
      : "text_body_l font_black_light";
  };

  // 더보기 버튼 추가
  const [couponDeiplaycount, setcouponDeiplaycount] = useState(3);
  const [storeDisplayCount, setStoreDisplayCount] = useState(3);

  const handlecouponDeiplaycount = () =>
    setcouponDeiplaycount((prev) => prev + 3);
  const handlestoreDisplayCount = () =>
    setStoreDisplayCount((prev) => prev + 3);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
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
                <form onSubmit={handleNicknameChange}>
                  <div className="nick-edit-box">
                    <div className="custom-inputbox-container">
                      <input
                        className="custom-inputbox"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="새 닉네임을 입력하세요"
                        required // 필수 입력 처리
                        minLength={1} // 최소 1자 입력
                      />
                    </div>
                    <div className="nick-edit-button">
                      <div>
                        <button
                          type="button"
                          className="btn-small-sc"
                          onClick={handleNicknameCancle}
                        >
                          취소
                        </button>
                      </div>
                      <div>
                        <button type="submit" className="btn-small">
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="nick-edit-button-start">
                  <button
                    className="btn-small"
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

          {/* 비회원일 경우 표시 */}
          <div className="mb-6">
            {!isMember && (
              <div className="nomember-main-message">
                <div className="text_body_m">
                  지금 <span className="text_title_xs primary">회원</span>으로
                  전환하시면,{" "}
                  <span className="text_title_xs primary">DALL·E</span>의{" "}
                  <span className="text_title_xs primary">
                    AI 기반 디테일링 비주얼아트
                  </span>
                  를 활용하여 나만의 특별한 캐릭터를 제작할 수 있습니다!{" "}
                  <Link to="/customers/joinus">
                    <span className="joinus-message">
                      <span className="text_title_xs primary">회원가입</span>
                      <img src="/icons/arrow-right-secondary.svg" />
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {!isMember && (
              <div className="nomember-main-message">
                <div className="text_body_m">
                  기존 회원고객이시면{" "}
                  <span className="text_title_xs primary">
                    <u onClick={handleLogout}>여기</u>
                  </span>
                  를 눌러 {" "}
                  <span className="text_title_xs primary">로그인</span>
                  해주세요
                </div>
              </div>
            )}
          </div>

          {/* QR 섹션 */}
          <div className="qr_section">
            <div className="user-actions">
              <div
                className={`action-item ${
                  activeComponent === "MainMyQR" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("MainMyQR")}
              >
                <div className="action-icon">
                  <img
                    src={getIconPath(
                      "MainMyQR",
                      "/icons/myqr_silver.svg",
                      "/icons/myqr_black.svg"
                    )}
                    alt="마이QR"
                  />
                </div>
                <div className={getTextClassName("MainMyQR")}>마이QR</div>
              </div>

              <div
                className={`action-item ${
                  activeComponent === "Reader" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("Reader")}
              >
                <div className="action-icon">
                  <img
                    src={getIconPath(
                      "Reader",
                      "/icons/qrscan_silver.svg",
                      "/icons/qrscan_black.svg"
                    )}
                    alt="QR적립"
                  />
                </div>
                <div className={getTextClassName("Reader")}>QR적립</div>
              </div>

              <div
                className={`action-item ${
                  activeComponent === "ReaderCustomerOrder" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("ReaderCustomerOrder")}
              >
                <div className="action-icon">
                  <img
                    src={getIconPath(
                      "ReaderCustomerOrder",
                      "/icons/list_silver.svg",
                      "/icons/list_black.svg"
                    )}
                    alt="QR주문"
                  />
                </div>
                <div className={getTextClassName("ReaderCustomerOrder")}>
                  QR주문
                </div>
              </div>

              <div
                className={`action-item ${
                  activeComponent === "CouponAddbyUser" ? "active" : ""
                }`}
                onClick={() => handleComponentChange("CouponAddbyUser")}
              >
                <div className="action-icon">
                  <img
                    src={getIconPath(
                      "CouponAddbyUser",
                      "/icons/typing_silver.svg",
                      "/icons/typing_black.svg"
                    )}
                    alt="코드등록"
                  />
                </div>
                <div className={getTextClassName("CouponAddbyUser")}>
                  코드등록
                </div>
              </div>
            </div>

            <div className="mainQRarea">
              {activeComponent === "MainMyQR" && <MainMyQR />}
              {activeComponent === "Reader" && <Reader type="addStamp" />}
              {activeComponent === "ReaderCustomerOrder" && (
                <Reader type="order" />
              )}
              {activeComponent === "CouponAddbyUser" && <CouponAddbyUser />}
            </div>
          </div>
        </div>

        {/* main_list section1 */}
        {/* 현재 사용 할 수 있는 쿠폰 */}
        <div className="main_list">
          {/* 리스트 헤더 */}
          <div className="section-header" onClick={toggleCouponList}>
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
              <img
                src={`/icons/${
                  isCouponListVisible ? "arrow_top" : "arrow_bottom"
                }.svg`}
                alt="더보기"
              />
            </div>
          </div>
          {/* 가게 상세 섹션 */}
          <div
            className={`storedetail-useablecouponlist ${
              isCouponListVisible ? "show" : "hide"
            }`}
          >
            {Coupons.find({ user_id: user._id, couponUsage: false }).fetch()
              .length === 0 ? (
              <p className="text_body_l ml-6">
                현재 사용할 수 있는 쿠폰이 없습니다
              </p>
            ) : (
              <>
                {Coupons.find({ user_id: user._id, couponUsage: false })
                  .fetch()
                  .slice(0, couponDeiplaycount)
                  .map((coupon) => {
                    const store = Stores.findOne({ _id: coupon.store_id });
                    return (
                      <CouponCard
                        key={coupon._id}
                        coupon={coupon}
                        store={store}
                      />
                    );
                  })}

                {Coupons.find({ user_id: user._id, couponUsage: false }).fetch()
                  .length > couponDeiplaycount && (
                  <button
                    onClick={handlecouponDeiplaycount}
                    className="read-more-button"
                  >
                    더보기
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* main_list section2 */}
        <div className="main_list">
          {/* 리스트 헤더 */}
          <div className="section-header" onClick={toggleStampList}>
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
              <img
                src={`/icons/${
                  isStampListVisible ? "arrow_top" : "arrow_bottom"
                }.svg`}
                alt="더보기"
              />
            </div>
          </div>

          <div
            className={`storedetail-stampstorelist ${
              isStampListVisible ? "show" : "hide"
            }`}
          >
            {Stores.find({ _id: { $in: myAllStampStoresIds } }).fetch()
              .length === 0 ? (
              <p className="text_body_l ml-6">현재 적립중인 가게가 없습니다</p>
            ) : (
              Stores.find({ _id: { $in: myAllStampStoresIds } })
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
                        <div className="store-section customers-sc">
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
                        <div className="store-section customers-sc">
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
                          <div className="coupon-buttons">
                            <Link
                              to={`/customers/storeDetail/${store.storeUrlName}`}
                            >
                              <button className="btn-secondary-outline">
                                자세히 보기
                              </button>
                            </Link>
                            <Link to={`/customers/order/${store.storeUrlName}`}>
                              <button className="btn-secondary">
                                주문하기
                              </button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className="banner-section">
          <Link to="/customers/StampTour">
            <div className="banner-item">
              <img src="/images/banner/banner01.png" alt="스탬프 투어 개최중" />
            </div>
          </Link>

          <Link to="/customers/mypage">
            <div className="banner-item">
              <img src="/images/banner/banner02.png" alt="DALL-E 이미지 생성" />
            </div>
          </Link>

          <Link to="/customers/LandingPage">
            <div className="banner-item">
              <img src="/images/banner/banner03.png" alt="바로스탬핑" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
