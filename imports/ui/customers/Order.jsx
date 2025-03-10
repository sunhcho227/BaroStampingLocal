// Orders.jsx
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useMemo } from "react";
import {
  Stores,
  Payments,
  Reviews,
  Products,
  Orders,
} from "/imports/api/collections";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import Loading from "../Loading.jsx";

export default () => {
  const user = Meteor.user();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const excludedIds = Stores.find({ storeUrlName: /^team\d+$/ })
    .fetch()
    .map((store) => store._id);

  // const teamIds = [
  //   "GPXAza75jgBgyneXs",
  //   "Tb5FGZo65H59cd6AG",
  //   "xdSoda49BpM9TF4ZZ",
  //   "PHcjG77S38fMggzJp",
  //   "FFAjwXFmhzJ4QzFnQ",
  //   "Q2xiQL4BsXEytm3AF",
  //   "Wzr23ZKEQ65zFBYtn",
  //   "RTJky5uT2qYXKcKpH",
  //   "YoFStvFHyYpBZFfZ2",
  //   // "id10",
  // ];

  // 퍼블릭 이미지 사용
  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;

  // Tracker로 데이터 구독
  const stores = useTracker(() => Stores.find().fetch(), []);

  useTracker(() => {
    Stores.find().fetch();
    Payments.find().fetch();
    Products.find().fetch();
    Reviews.find().fetch();
  });

  const pageTitle = "주문하기";
  document.title = `Stamping - ${pageTitle}`;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlData = queryParams.get("data");

    if (urlData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(urlData));
        if (parsedData.storeUrlName) {
          navigate(`/customers/order/${parsedData.storeUrlName}`);
        }
      } catch (error) {
        console.error("데이터 파싱 중 오류 발생:", error);
      }
    }
  }, [location.search, navigate]);

  // 모든 로컬스토리지 데이터 초기화
  //  localStorage.clear();

  const [storeLogos, setStoreLogos] = useState({});

  // 로고 데이터 가져오기
  useEffect(() => {
    const fetchLogos = async () => {
      const promises = stores.map((store) => {
        return new Promise((resolve) => {
          const cachedLogo = localStorage.getItem(
            `storeLogo_${store.storeUrlName}`
          );
          if (cachedLogo) {
            resolve({ storeUrlName: store.storeUrlName, logo: cachedLogo });
          } else {
            const logoUrl = getPublicStoreLogoPath(store.storeUrlName);
            const img = new Image();
            img.src = logoUrl;

            img.onload = () => {
              localStorage.setItem(`storeLogo_${store.storeUrlName}`, logoUrl);
              resolve({ storeUrlName: store.storeUrlName, logo: logoUrl });
            };

            img.onerror = () => {
              resolve({
                storeUrlName: store.storeUrlName,
                logo: "/stores/default_logo.png",
              });
            };
          }
        });
      });

      const results = await Promise.all(promises);

      // 결과를 객체 형태로 변환
      const logosMap = results.reduce((acc, { storeUrlName, logo }) => {
        acc[storeUrlName] = logo;
        return acc;
      }, {});

      setStoreLogos(logosMap);
    };

    if (stores.length > 0) {
      fetchLogos();
    }
  }, [stores]);

  // 각 카드의 뒤집힘 상태 관리
  const payments = Payments.find(
    { user_id: user._id },
    { sort: { paymentDate: -1 } }
  )
    .fetch()
    .slice(0, 2);

  const [flipped, setFlipped] = useState(payments.map(() => false));

  const flipCard = (index) => {
    setFlipped((prevState) =>
      prevState.map((isFlipped, i) => (i === index ? !isFlipped : isFlipped))
    );
  };

  const randomColors = [
    "#B0D7E8",
    "#FFC857",
    "#E9724C",
    "#C5283D",
    "#255F85",
    "#9C89B8",
    "#FFB3C6",
    "#A0C4FF",
    "#BDE0FE",
    "#FFAFCC",
    "#98DDCA",
    "#D5AAFF",
  ];

  const getRandomColor = () => {
    return randomColors[Math.floor(Math.random() * randomColors.length)];
  };

  const storeColors = useMemo(() => {
    return Stores.find()
      .fetch()
      .map(() => getRandomColor());
  }, []);

  useEffect(() => {
    const swiper = new Swiper(".swiper-container", {
      loop: true,
      // slidesPerView: 1.5,
      // spaceBetween: 12,
      // pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      // },
      // navigation: {
      //   nextEl: ".swiper-button-next",
      //   prevEl: ".swiper-button-prev",
      // },
      autoplay: {
        delay: 2000, // 3초마다 슬라이드 전환
        disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
          centeredSlides: true,
          // spaceBetween: 0,
        },
        400: {
          slidesPerView: 1.4,
          spaceBetween: 12,
        },

        500: {
          slidesPerView: 1.8,
          spaceBetween: 12,
        },
        600: {
          slidesPerView: 2.2,
          spaceBetween: 12,
        },
      },
    });
  }, [Stores.find().fetch()]);

  // isLoading 상태 관리 개선
  useEffect(() => {
    const checkDataLoading = () => {
      if (stores.length > 0 && payments.length > 0) {
        setIsLoading(false);
      }
    };

    checkDataLoading();
  }, [stores, payments]);

  // if (isLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="order-container">
        <div className="recent-orders-box">
          <div className="recent-orders-list">
            <div className="text_title_s primary">최근 주문내역</div>

            {payments.length === 0 ? (
              <div className="text_body_m">최근 주문 내역이 없습니다.</div>
            ) : (
              payments.map((payment, index) => {
                // store 선언
                const store = Stores.findOne({ _id: payment.store_id });

                // product 선언 (optional)
                const product = Products.findOne({
                  _id: payment.payItems[0]?.product_id,
                });

                return (
                  <div
                    key={payment._id}
                    className="card-container"
                    onClick={() => flipCard(index)}
                  >
                    <div
                      className={`card ${flipped[index] ? "is-flipped" : ""}`}
                    >
                      <div className="card-front">
                        <div className="orderls-store-card">
                          <div className="orderls-store-card-header">
                            <div className="orderls-store-info">
                              <div className="orderls-store-thumbnail">
                                <img
                                  src={
                                    store
                                      ? `/stores/${store.storeUrlName}_logo.png`
                                      : "/stores/default_logo.png"
                                  }
                                  alt={`${store?.storeName || "기본 로고"}`}
                                  onError={(e) => {
                                    e.target.src = "/stores/default_logo.png";
                                  }}
                                />
                              </div>
                              <div className="orderls-store-details">
                                <div className="text_body_xs">
                                  {Orders.findOne({ _id: payment.order_id })
                                    ?.orderType || "알 수 없음"}
                                </div>
                                <div className="text_title_m">
                                  {store?.storeName || "알 수 없는 가게"}
                                </div>
                                <div className="text_body_l">
                                  {product?.productName || "알 수 없는 상품"}{" "}
                                  {payment.payItems.length > 1
                                    ? `외 ${payment.payItems.length - 1}개`
                                    : ""}{" "}
                                  {payment.totalSum.toLocaleString()}원
                                </div>
                                <div className="text_body_xs">
                                  {payment.paymentDate
                                    .toLocaleDateString()
                                    .slice(0, -1)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="orderls-card-front-button-action">
                            <div className="orderls-card-front-pickup">
                              {payment.status === "대기" && (
                                <div className="text_title_xs point_red">
                                  상품 준비중
                                </div>
                              )}
                            </div>

                            <div>
                              {payment.status === "완료" &&
                              payment.status !== "취소" &&
                              !Reviews.findOne({ payment_id: payment._id }) ? (
                                <div className="orderls-card-front-pickup">
                                  <div className="text_title_xs primary">
                                    픽업완료
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            <div className="btn-small-outline">주문 상세</div>
                            <div>
                              <Link
                                to={`/customers/storeDetail/${
                                  store?.storeUrlName || ""
                                }`}
                              >
                                <div className="btn-small-outline">
                                  가게 상세
                                </div>
                              </Link>
                            </div>

                            <div>
                              {payment.status === "완료" &&
                              payment.status !== "취소" &&
                              !Reviews.findOne({ payment_id: payment._id }) ? (
                                <div className="orderls-card-front-pickup">
                                  <Link
                                    to={`/customers/storereview/${store?.storeUrlName}`}
                                    state={{ payment_id: payment._id }}
                                  >
                                    <div className="btn-small">리뷰 쓰기</div>
                                  </Link>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-back">
                        <div className="order-details-item">
                          <div className="text_title_s text_align_center">
                            주문 상세 내역
                          </div>
                          <div className="order-details-item-sc">
                            {payment.payItems.map((item, index) => {
                              const product = Products.findOne({
                                _id: item.product_id,
                              });
                              return (
                                <div key={index}>
                                  <div className="text_body_l">
                                    {product
                                      ? product.productName
                                      : "알 수 없는 상품"}{" "}
                                    {item.quantity}개
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text_body_xs text_align_center">
                            주문번호: {payment._id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {payments.length === 0 ? (
              <div></div>
            ) : (
              <Link to="/customers/myorders">
                <button className="read-more-button">
                  전체 주문 내역 보기
                </button>
              </Link>
            )}
          </div>

          {Stores.findOne({ storeLLM: { $ne: null } }) && (
            <div>
              <div className="flex flex-row gap-1 mt-6 items-center">
                <img
                  src="/icons/openai-secondary.svg"
                  alt="openAI"
                  className="w-5 h-5"
                />
                <div className="text-[18px] font-semibold leading-[100%] text-[#025f66]">
                  AI 리뷰 분석으로 찾은 추천 가게
                </div>
                <div className="relative group inline-block">
                  <i className="fa-solid fa-question-circle h-5 text-gray-300 text-xs cursor-pointer"></i>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-48 bg-[#00A9B5] text-white text-xs rounded py-1 px-2 group-hover:block">
                    인공지능 <span className="font-semibold">GPT-4</span>로
                    리뷰를 분석해 가게를 추천해드립니다.
                  </div>
                </div>
              </div>

              {/* swiper */}
              <div className="overflow-hidden p-4 relative">
                <div className="swiper-container">
                  <div className="swiper-wrapper">
                    {Stores.find()
                      .fetch()
                      .map(
                        (store) =>
                          store.storeLLM && (
                            <div
                              key={store._id}
                              className="swiper-slide ml-2" // 슬라이드에 너비를 설정
                              onClick={() =>
                                navigate(
                                  `/customers/order/${store.storeUrlName}`
                                )
                              }
                            >
                              <div
                                className="flex-shrink-0 w-[240px] h-[140px] shadow-md rounded-lg px-5 py-3 cursor-pointer flex flex-col items-center justify-center mx-2"
                                style={{ backgroundColor: getRandomColor() }}
                              >
                                <div className="flex justify-center items-center mb-1">
                                  <img
                                    src="/icons/logo-sq-white.svg"
                                    className="w-6 h-6"
                                    alt="store logo"
                                  />
                                </div>
                                <div className="text-white font-normal leading-[1.5] text-center">
                                  <span className="text-2xl font-sans">
                                    {store.storeLLM.slice(0, 1)}
                                  </span>
                                  {store.storeLLM.length > 60
                                    ? `${store.storeLLM.slice(1, 60)}...`
                                    : store.storeLLM.slice(1)}
                                </div>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="mystore-store orderonly">
              <div className="title_all">주변 가게 리스트</div>
              {Stores.find({ _id: { $nin: excludedIds } })
                .fetch()
                .map((store) => (
                  <div key={store._id}>
                    <div className="store-section-fill order bg">
                      <div className="flex flex-row gap-2 justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <div className="text_title_m">{store.storeName}</div>
                          <div className="text_body_s">
                            {store.storeInformation}
                          </div>
                          <div className="text_body_l">
                            {store.storePhoneNumber}
                          </div>
                          <div className="text_body_l">
                            {store.storeAddress}
                          </div>
                        </div>
                        <div className="order-logos">
                          <img
                            src={
                              store
                                ? getPublicStoreLogoPath(store.storeUrlName)
                                : "/stores/default_logo.png"
                            }
                            alt={`${store?.storeName || "기본 로고"}`}
                            onError={(e) => {
                              e.target.src = "/stores/default_logo.png";
                            }}
                          />
                        </div>
                      </div>

                      <div className="text-sm  text-center">
                        스탬프{" "}
                        <span className="font-semibold primary">
                          {store.maxStamp}
                        </span>
                        개를 모으면
                        <br />
                        <span className="font-semibold primary">
                          {store.couponInformation}
                        </span>
                        쿠폰으로 사용할 수 있어요!
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
                          <button className="btn-secondary">주문하기</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
