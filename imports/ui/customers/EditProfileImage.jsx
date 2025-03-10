import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import Nav from "./Nav.jsx";
import Header from "./Header.jsx";
import "../styles/user_main.css";
import "../styles/user_layout.css";
import DalleClicked from "./DalleClicked.jsx";
import DalleInput from "./DalleInput.jsx";

export default () => {
  const user = Meteor.user();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 탭 관리
  const [activeTab, setActiveTab] = useState("clicked");

  const pageTitle = "생성형 AI DALL-E로 프로필 만들기";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="coupon-page-container sh">
        <div className="coupon-navigation">
          <div
            className={`nav-item ${activeTab === "clicked" ? "active" : ""}`}
            onClick={() => setActiveTab("clicked")}
          >
            <div className="text_title_m">선택해서 만들기</div>
          </div>

          <div
            className={`nav-item ${activeTab === "input" ? "active" : ""}`}
            onClick={() => setActiveTab("input")}
          >
            <div className="text_title_m">문구 입력하기</div>
          </div>
        </div>

        {/* 탭 내용 */}
        {activeTab === "clicked" && (
          <div>
            <DalleClicked />
          </div>
        )}

        {activeTab === "input" && (
          <div>
            <DalleInput />
          </div>
        )}
      </div>
    </>
  );
};
