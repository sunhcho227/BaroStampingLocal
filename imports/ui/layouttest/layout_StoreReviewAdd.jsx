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
      
      <div className="editreview-container">
        <div className="text_title_m primary">리뷰내용</div>
        <div className="custom-textarea-container">
          <textarea
            className="custom-textarea"
            placeholder="리뷰를 작성해 주세요"
          ></textarea>
        </div>
        <div className="reviewrating">
          <div className="text_body_l">평점을 선택해주세요</div>
          <div className="reviewrating-star">별별별별별</div>
        </div>
        <button className="btn-secondary">리뷰 등록하기</button>
      </div>
    </>
  );
};
