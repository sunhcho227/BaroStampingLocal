// Nav.jsx
import React from "react";
import { Link } from "react-router-dom";

export default () => {
  return (
    <>
      <header>
        <nav>
          <ol>
            <Link to="/customers/mypage/myProfile">
              <div>내 프로필</div>
            </Link>
            <Link to="/customers/mystores">
              <div>내 스토어</div>
            </Link>
            <Link to="/customers/mycoupons">
              <div>내 쿠폰</div>
            </Link>
            <Link to="/customers/mystamps">
              <div>내 스탬프</div>
            </Link>
            <Link to="/customers/myreview">
              <div>내 리뷰</div>
            </Link>
          </ol>
        </nav>
      </header>
    </>
  );
};
