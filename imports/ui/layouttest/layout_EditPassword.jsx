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

      <div className="profile-edit-container">
        <div className="profile-header">
          <div className="text_title_m primary">비밀 번호 수정</div>

        </div>
        <div className="profile-details">
        <div className="profile-field">
            <div className="text_title_xs profile_keyarea">현재 비밀번호</div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                placeholder="현재 비밀번호를 입력해주세요"
              />
            </div>
          </div>
          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">전화번호</div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                placeholder="새 비밀번호를 입력해주세요"
              />
            </div>
          </div>
          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">이메일</div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                placeholder="새 비밀번호를 다시 입력해주세요"
              />
            </div>
          </div>

          
        </div>

        <div className="profile-btn-actions">
            <button className="btn-primary-outline">취소</button>
            <button className="btn-primary">비밀번호 저장</button>
          </div>


      </div>
    </>
  );
};
