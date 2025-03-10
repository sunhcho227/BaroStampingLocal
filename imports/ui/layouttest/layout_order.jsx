import React, { useState, useEffect } from "react";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  return (
    <>
      <Nav />
      <Header />

      <div className="order-container">
        <div className="recent-orders-box">
          <div className="recent-orders-list">
            <div className="text_title_s primary">최근 주문내역</div>
            <div className="order-card">
              <div className="order-info">
                <div className="order-thumbnail"></div>
                <div className="order-details">
                  <div className="text_title_s">세나 카페</div>
                  <div className="order-meta">
                    <div className="text_body_l">
                      폼폼푸린 굿즈 외 4개 99,999원
                    </div>
                    <div className="text_body_xs">2024. 11. 12 주문</div>
                  </div>
                </div>
              </div>
              <button className="btn-primary">리뷰 쓰기111</button>
            </div>
          </div>
          <button className="btn-read-more">
            전체 주문 내역 보기
            <div className="arrow-icon"></div>
          </button>
        </div>

        <div>
          <div className="mystore-store">
            <div className="title_all">주변 가게 리스트</div>

            <div className="store-section-fill">
              <div className="text_title_s">포챠코 카페</div>
              <div className="text_body_m">
                010-5555-5555 <br />
                서울특별시 광진구 자양로 23-15 1층
              </div>
              <div className="text_body_s">
                스탬프 12개를 모으면{" "}
                <span className="text_title_xs primary">
                  포챠코 요술봉 교환권
                </span>
                으로 사용할 수 있어요!
              </div>
              <div className="coupon-buttons">
                <button className="btn-secondary-outline">
                  가게 자세히 보기
                </button>
                <button className="btn-secondary">주문하기</button>
              </div>
            </div>

            <div className="store-section-fill">
              <div className="text_title_s">포챠코 카페</div>
              <div className="text_body_m">
                010-5555-5555 <br />
                서울특별시 광진구 자양로 23-15 1층
              </div>
              <div className="text_body_s">
                스탬프 12개를 모으면{" "}
                <span className="text_title_xs primary">
                  포챠코 요술봉 교환권
                </span>
                으로 사용할 수 있어요!
              </div>
              <div className="coupon-buttons">
                <button className="btn-secondary-outline">
                  가게 자세히 보기
                </button>
                <button className="btn-secondary">주문하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
