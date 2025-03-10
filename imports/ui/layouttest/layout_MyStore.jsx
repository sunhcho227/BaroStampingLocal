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

      <div className="mystore-container">
        <div className="coupon-section-container">
          <div className="title_all">사용 가능한 쿠폰 3개</div>

          <div className="coupon-box">
            <div className="coupon-img"></div>
            <div className="coupon-list-item">
              <div className="coupon-text">
                <div className="text_title_s">폼폼 카페</div>
                <div className="text_body_m">
                  <div>폼폼 기념 서비스</div>
                  <div>폼폼리카노 쿠폰</div>
                </div>
              </div>
              <div className="coupon-date">
                <div className="text_body_m">유효기간</div>
                <div className="text_body_m">~ 2099. 99. 99</div>
              </div>
            </div>
          </div>

          <div className="coupon-box">
            <div className="coupon-img"></div>
            <div className="coupon-list-item">
              <div className="coupon-text">
                <div className="text_title_s">폼폼 카페</div>
                <div className="text_body_m">
                  <div>폼폼 기념 서비스</div>
                  <div>폼폼리카노 쿠폰</div>
                </div>
              </div>
              <div className="coupon-date">
                <div className="text_body_m">유효기간</div>
                <div className="text_body_m">~ 2099. 99. 99</div>
              </div>
            </div>
          </div>

          <button className="read-more-button">
            더보기
            <div className="arrow-icon"></div>
          </button>
        </div>

        <div className="mystore-store">
          <div className="title_all">스탬프 적립중인 가게 3개</div>

          <div className="store-section">
            <div className="text_title_s">폼폼 카페</div>
            <div className="bar-section">
              <div className="bar-img"></div>
              <div className="bar-text">
                <span className="text_title_xs primary">3</span>
                <span className="text_title_xs">/</span>
                <span className="text_title_xs">12</span>
              </div>
            </div>
            <div className="text_body_s">
              스탬프 보상을 달성하여{" "}
              <span className="text_title_xs primary">폼폼푸린 굿즈</span>
              으로 바꿀 수 있어요!
            </div>
            <div className="coupon-buttons">
              <button className="btn-secondary-outline">
                가게 자세히 보기
              </button>
              <button className="btn-secondary">쿠폰 발급 받기</button>
            </div>
          </div>

          <div className="store-section">
            <div className="text_title_s">포챠코 카페</div>
            <div className="bar-section">
              <div className="bar-img"></div>
              <div className="bar-text">
                <span className="text_title_xs primary">3</span>
                <span className="text_title_xs">/</span>
                <span className="text_title_xs">22</span>
              </div>
            </div>
            <div className="text_body_s">
              12개를 모으면{" "}
              <span className="text_title_xs primary">
                포챠코 요술봉 교환권
              </span>
              으로 사용할 수 있어요!
            </div>
            <button className="btn-secondary-outline btn-fill">
              가게 자세히 보기
            </button>
          </div>
          <button className="read-more-button">
            더보기
            <div className="arrow-icon"></div>
          </button>
        </div>

        <div>
          <div className="mystore-store">
            <div className="title_all">자주가는 가게 리스트</div>

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
              <button className="btn-secondary-outline btn-fill">
                가게 자세히 보기
              </button>
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
              <button className="btn-secondary-outline btn-fill">
                가게 자세히 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
