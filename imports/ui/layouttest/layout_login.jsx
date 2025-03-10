import React, { useEffect, useState } from "react";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  return (
    <>
      <div className="login-page-container">
        <div className="background-overlay"></div>
        <div className="login-box">
          <div className="logo-box">
          <img src="/icons/logo.svg" alt="전자 스탬프 서비스 스탬핑" />
          </div>

          <div className="form-container">
            <div className="custom-inputbox-container">
              <input className="custom-inputbox"
              placeholder="아이디를 입력해주세요" />
            </div>

            <div className="custom-inputbox-container">
              <input className="custom-inputbox"
              placeholder="비밀번호를 입력해주세요" />
            </div>

            <div className="button-container">
              <div className="login-button">
                <span className="button-text">로그인</span>
              </div>
            </div>
            <div className="join-box">
              <div className="join">
                <span className="text_title_xs join_text_color">회원가입</span>
                <div className="separator"></div>
                <span className="text_body_l join_text_color">아이디 찾기</span>
                <div className="separator"></div>
                <span className="text_body_l join_text_color">
                  비밀번호 찾기
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
