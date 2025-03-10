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
      <div className="order-page-container">
        <div className="store-info-box">
          <div className="text_title_l">세나카페</div>
          <div className="text_body_m">
            전화번호: 010-5555-5555
            <br />
            주소: 서울특별시 광진구 자양로 23-15 1층 세나카페
          </div>
          <div className="store-image-placeholder"></div>
        </div>

        <div className="order-info-box">
          <div className="text_title_m primary">주문 상품정보</div>

          <div className="cart-product-list">
            <div className="cart-product-item">
              <div className="cart-product-details">
                <div className="cart-product-info">
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
          </div>

          <div className="cart-product-list">
            <div className="cart-product-item">
              <div className="cart-product-details">
                <div className="cart-product-info">
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
              <button className="btn-secondary">결제 하기</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
