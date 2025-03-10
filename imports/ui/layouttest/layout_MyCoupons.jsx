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

      <div className="coupon-page-container">
        <div className="coupon-navigation">
          <div className="nav-item active">
            <div className="text_title_m">
              사용 가능 <span className="text_title_m primary">999</span>개
            </div>
          </div>
          <div className="nav-item">
            <div className="text_title_m">사용 불가</div>
          </div>
        </div>



        <div className="coupon-section-container">


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
      </div>








      <div className="coupon-page-container">
        <div className="coupon-navigation">
          <div className="nav-item">
            <div className="text_title_m">
              사용 가능
            </div>
          </div>
          <div className="nav-item  active">
          <div className="text_title_m">
              사용 불가 <span className="text_title_m primary">999</span>개
            </div>
          </div>
        </div>



        <div className="coupon-section-container">


        <div className="coupon-box">
            <div className="coupon-img"></div>
            <div className="coupon-list-item">
              <div className="coupon-text">
                <div className="text_title_s">펌펌 카페</div>
                <div className="text_body_m">
                  <div>폼폼이 생일 기념 서비스</div>
                  <div>폼폼모카 쿠폰</div>
                </div>
              </div>
              <div className="coupon-date">
                <div className="text_body_m">사용 날짜</div>
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
                  <div>폼폼이 생일 기념 서비스</div>
                  <div>폼폼이 음료 쿠폰</div>
                </div>
              </div>
              <div className="coupon-date">
                <div className="text_body_m">사용 날짜</div>
                <div className="text_body_m">~ 2099. 99. 99</div>
              </div>
            </div>
          </div>

          <button className="read-more-button">
            더보기
            <div className="arrow-icon"></div>
          </button>
        </div>
      </div>
    </>
  );
};
