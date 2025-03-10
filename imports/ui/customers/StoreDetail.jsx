// storeDetail.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useParams, Link } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import {
  Stores,
  Coupons,
  Stamps,
  Reviews,
  UserStores,
} from "/imports/api/collections";
import Nav from "./Nav.jsx";
import Header from "./Header.jsx";
import "../styles/user_main.css";
import "../styles/user_layout.css";
import StoreReviews from "./StoreReviews.jsx";
import UserStamps from "./UserStamps.jsx";
import StoreInfo from "./StoreInfo.jsx";
import OrderStoreTap from "./OrderStoreTap.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default () => {
  // 현재 사용자 가져오기
  const user = useTracker(() => Meteor.user(), []);

  // 퍼블릭 이미지 사용
  const getPublicImagePath = (storeUrlName, fileName) =>
    `/stores/${storeUrlName}_${fileName}.png`;

  // 파라미터로부터 storeUrlName 추출
  const { storeUrlName } = useParams();

  // DB에서 Store 정보 가져오기
  const store = useTracker(
    () => Stores.findOne({ storeUrlName }),
    [storeUrlName]
  );

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState("info");

  // storeId와 type 선언
  const storeId = store?._id || null;

  // 이미지 상태 및 로딩 상태 관리
  const [topImages, setTopImages] = useState([]);
  const [mainImages, setMainImages] = useState([]);
  const [couponImages, setCouponImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이미지 불러오기
  useEffect(() => {
    if (!storeId || !store) return;

    // 스토어 이름을 활용해 이미지 경로 구성
    const mainImages = [
      getPublicImagePath(store.storeUrlName, "main"),
      getPublicImagePath(store.storeUrlName, "logo"),
    ];

    const subImages = Array.from({ length: 3 }, (_, i) =>
      getPublicImagePath(store.storeUrlName, `sub${i + 1}`)
    );

    const couponImages = [
      getPublicImagePath(store.storeUrlName, "coupon"),
      getPublicImagePath(store.storeUrlName, "servicecoupon"),
    ];

    setTopImages([...mainImages, ...subImages]);
    setCouponImages(couponImages);
    setMainImages(mainImages);

    // fetchImages();
  }, [storeId, store]);

  // 캐러쉘
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  // 스탬프, 쿠폰 등 추가 데이터 트래킹
  useTracker(() => {
    Stamps.find().fetch();
    Coupons.find().fetch();
    Reviews.find().fetch();
    UserStores.find().fetch();
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".swiper-container", {
      loop: true, // 무한 루프
      slidesPerView: 1, // 한 장씩 보이도록 설정
      centeredSlides: true, // 슬라이드를 항상 가운데 정렬
      spaceBetween: 0, // 슬라이드 간 간격 없음
      autoplay: {
        delay: 4000, // 3초마다 자동 전환
        disableOnInteraction: false, // 상호작용 후에도 자동 재생 유지
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, [topImages]);

  // 페이지 제목 설정
  const pageTitle = store ? store.storeName : "로딩 중...";
  document.title = `Stamping - ${pageTitle}`;

  // 로딩 상태 처리
  if (!store) {
    return <p>스토어 정보를 불러오는 중...</p>;
  }

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="storedetail-container">
        <div className="w-full overflow-hidden relative">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {topImages.map((imageUrl, index) => (
                <div key={index} className="swiper-slide storeimg">
                  <img src={imageUrl} alt={`Store Image ${index}`} />
                </div>
              ))}
            </div>

            {/* 페이지네이션과 네비게이션 버튼 */}
            <div className="swiper-pagination"></div>
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </div>

          {/* 이미지 위에 텍스트 배치 */}
          <div
            style={{
              width: "100%",
              position: "absolute",
              bottom: "0px",
              left: "0px",
              backgroundImage:
                "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
              color: "#FFFFFF",
              padding: "40px 10px 5px 10px",
              // border: "1px solid black",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              zIndex: 10, // z-index 추가

              alignItems: "center",
            }}
          >
            <div className="flex flex-col ml-3 mb-3 md:flex-row items-start md:items-center md:gap-2">
              <div className="text-2xl font-medium text-white">
                {store.storeName}
              </div>
              <div className="text-sm">{store.storePhoneNumber}</div>
              <div className="text-sm">{store.storeAddress}</div>
            </div>
          </div>
        </div>

        {/* <div className="storeimg">
          
          {topImages.length > 0 ? (
            <Slider {...sliderSettings}>
              {topImages.map((image) => (
                <div key={image.name} className="storeimg">
                  <img src={image.url} alt={image.name} />
                </div>
              ))}
            </Slider>
          ) : (
            <p>이미지를 불러오는 중...</p>
          )}

          
          <div
            style={{
              width: "100%",
              position: "absolute",
              bottom: "0px",
              left: "0px",
              backgroundImage:
                "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
              color: "#FFFFFF",
              padding: "40px 10px 5px 10px",
              // border: "1px solid black",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              zIndex: 10, // z-index 추가

              alignItems: "center",
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center md:gap-2">
              <div className="text-2xl font-medium text-white">
                {store.storeName}
              </div>
              <div className="text-sm">{store.storePhoneNumber}</div>
              <div className="text-sm">{store.storeAddress}</div>
            </div>

          </div>




        </div> */}

        <div>
          <UserStamps />
        </div>

        <div className="store-navigation">
          <div
            className={`nav-item ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <div className="text_title_m">정보</div>
          </div>

          <div
            className={`nav-item ${activeTab === "order" ? "active" : ""}`}
            onClick={() => setActiveTab("order")}
          >
            <div className="text_title_m">주문하기</div>
          </div>

          <div
            className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <div className="text_title_m">리뷰 보기</div>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "info" && <StoreInfo />}
          {activeTab === "order" && <OrderStoreTap />}
          {activeTab === "reviews" && <StoreReviews />}
        </div>
      </div>
    </>
  );
};
