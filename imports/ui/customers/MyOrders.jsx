// MyOrders.jsx
import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import {
  Stores,
  Payments,
  Reviews,
  Products,
  Orders,
} from "/imports/api/collections";
import { Link } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();

  // 더보기 버튼 추가
  const [orderDisplayCount, setOrderDisplayCount] = useState(5);

  const handleOrderDisplayCount = () =>
    setOrderDisplayCount((prev) => prev + 5);

  // 가게 로고 상태 관리
  const [storeLogos, setStoreLogos] = useState({});

  // Tracker로 데이터 구독
  useTracker(() => {
    Stores.find().fetch();
    Payments.find().fetch();
    Products.find().fetch();
    Reviews.find().fetch();
  });

  const pageTitle = "내 주문 내역";
  document.title = `Stamping - ${pageTitle}`;

  // 카드 뒤집기 상태 관리
  const payments = Payments.find(
    { user_id: user._id },
    { sort: { paymentDate: -1 } }
  )
    .fetch()
    .slice(0, orderDisplayCount);

  const [flipped, setFlipped] = useState(payments.map(() => false));

  const flipCard = (index) => {
    setFlipped((prevState) =>
      prevState.map((isFlipped, i) => (i === index ? !isFlipped : isFlipped))
    );
  };


  // 퍼블릭 로고 경로 생성 함수
  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="order-container">
        <div className="recent-orders-box">
          <div className="recent-orders-list">
            <div className="text_title_s primary">전체 주문내역</div>

            {payments.length === 0 ? (
              <div className="text_body_m">최근 주문 내역이 없습니다.</div>
            ) : (
              payments.map((payment, index) => {
                const store = Stores.findOne({ _id: payment.store_id });
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
                                      ? getPublicStoreLogoPath(
                                          store.storeUrlName
                                        )
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
                                    .orderType || "알수없음"}
                                </div>
                                <div
                                  className="text_title_m"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {Stores.findOne({ _id: payment.store_id })
                                    ?.storeName || "알 수 없는 가게"}
                                </div>
                                <div className="text_body_l">
                                  {Products.findOne({
                                    _id: payment.payItems[0]?.product_id,
                                  })?.productName || "알 수 없는 상품"}{" "}
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
                              {payment.status === "완료" && (
                                <div className="orderls-card-front-pickup">
                                  <div className="text_title_xs primary">
                                    픽업완료
                                  </div>
                                </div>
                              )}
                            </div>

                            <div>
                              {payment.status === "취소" && (
                                <div>결제 취소됨</div>
                              )}
                            </div>

                            <div className="btn-small-outline">주문 상세</div>
                            <div>
                              <Link
                                to={`/customers/storeDetail/${
                                  Stores.findOne({ _id: payment.store_id })
                                    ?.storeUrlName || ""
                                }`}
                              >
                                <div className="btn-small-outline">
                                  가게 상세
                                </div>
                              </Link>
                            </div>
                            {/* 리뷰쓰기 버튼 */}
                            <div>
                              {payment.status === "완료" &&
                              !Reviews.findOne({ payment_id: payment._id }) ? (
                                <div className="orderls-card-front-pickup">
                                  <Link
                                    to={`/customers/storereview/${
                                      Stores.findOne({ _id: payment.store_id })
                                        .storeUrlName
                                    }`}
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

            {Payments.find(
              { user_id: user._id },
              { sort: { paymentDate: -1 } }
            ).fetch().length > orderDisplayCount && (
              <button
                onClick={handleOrderDisplayCount}
                className="read-more-button"
              >
                주문 내역 더보기
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
