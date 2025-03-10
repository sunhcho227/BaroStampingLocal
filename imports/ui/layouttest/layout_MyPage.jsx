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
      <div className="mypage-container">

      <div className="mypage-top">
      <div className="profile-header">
        <div className="text_title_m">
          <span className="primary">정원</span>님의 마이 프로필</div>
        <button className="edit-nickname-btn">프로필 수정</button>
        </div>

 <div className="profile-image-placeholder"></div>

 <div className="profile-details">
        <div className="profile-stats">
          <div className="stat-item">
            <div>
            <img src="/icons/star_stamp.svg" alt="누적스탬프" />
            </div>
            <span className="text_body_xl">123</span>
          </div>
          <div className="stat-item">
          <div>
            <img src="/icons/star_review.svg" alt="리뷰" />
            </div>
            <span className="text_body_xl">123</span>
          </div>
          <div className="stat-item">
          <div>
            <img src="/icons/star_store.svg" alt="적립중인가게" />
            </div>
            <span className="text_body_xl">123</span>
          </div>
        </div>



        <div className="profile-info">
          <div className="info-row">
            <div className="text_title_xs"># 아이디</div>
            <div className="text_body_l">jungwon</div>
          </div>
          <div className="info-row">
            <div className="text_title_xs"># 닉네임</div>
            <div className="text_body_l">정원</div>
          </div>
          <div className="info-row">
            <div className="text_title_xs"># 전화번호</div>
            <div className="text_body_l">010-4444-4444</div>
          </div>
          <div className="info-row">
            <div className="text_title_xs"># 이메일</div>
            <div className="text_body_l">jungwon@mail.com</div>
          </div>
        </div>
        </div>
      </div>


      <div className="coupon-status-container">
      <div className="status-card">
        <div className="status-count">
          <span className="status-number">3</span>
          <span className="text_title_m">개</span>
        </div>
        <div className="text_body_xl">사용 가능한 쿠폰</div>
      </div>

      <div className="status-card">
        <div className="status-count">
          <span className="status-number">3</span>
          <span className="text_title_m">개</span>
        </div>
        <div className="text_body_xl">적립 중인 가게</div>
      </div>
    </div>




    <div className="myreviews-box">
    <div className="title_all">마이 리뷰</div>
      <div className="reviews-header">

      </div>

      <div className="reviews-list">

        <div className="review-item">
        <div className="review-header">
          <div className="user-info">
              <div className="user-avatar"></div>
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
          <div className="review-actions">
            <button className="edit-nickname-btn">수정</button>
            <button className="edit-nickname-disable">
              삭제
              </button>
          </div>
        </div>

        
        <div className="review-item">
        <div className="review-header">
          <div className="user-info">
              <div className="user-avatar"></div>
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
          <div className="review-actions">
            <button className="edit-nickname-btn">수정</button>
            <button className="edit-nickname-disable">
              삭제
              </button>
          </div>
        </div>

      </div>
      <button className="read-more-button">
          더보기
          {/* <img src="/icons/arrow_bottom.svg" /> */}
        </button>
    </div>







    </div>
    </>
  );
};
