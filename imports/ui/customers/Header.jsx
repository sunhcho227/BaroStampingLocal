import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles_components/header.css";

export default (props) => {
  const { pageTitle } = props;
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="header-container">
      <div className="header-title-wrapper">
        {/* 뒤로가기 아이콘 조건부 렌더링 및 클릭 핸들러 추가 */}
        {/* {pageTitle !== "홈" && (
          <div className="icon-wrapper" onClick={() => navigate(-1)}>
            <div className="icon">
              <img src="/icons/arrow_left.svg" alt="뒤로가기" />
            </div>
          </div>
        )} */}
        <div className="icon-wrapper" onClick={() => navigate(-1)}>
          <div className="icon">
            <img src="/icons/arrow_left.svg" alt="뒤로가기" />
          </div>
        </div>
        <div className="header-title">{pageTitle}</div>
      </div>
      <div className="header-icons">
        {/* <div className="icon-wrapper">
          <div className="icon">
            <img src="/icons/notification.svg" alt="알림" />
          </div>
        </div> */}
        <Link to="/customers/cart" className="link-control">
          <div className="icon-wrapper">
            <div className="icon">
              <img src="/icons/cart.svg" alt="카트" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
