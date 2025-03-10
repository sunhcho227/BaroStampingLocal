import React, { useState } from "react";

export default () => {
  const [couponCode, setCouponCode] = useState(""); // 입력된 쿠폰 코드
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지

  const handleCouponSubmit = () => {
    // 쿠폰 번호 유효성 검사
    if (couponCode.length !== 2000 || !/^[a-zA-Z0-9]+$/.test(couponCode)) {
      setErrorMessage("올바른 쿠폰번호를 입력해주세요.");
    } else {
      setErrorMessage(""); // 에러 메시지 초기화
      alert("쿠폰이 사용되었습니다!"); // 성공적인 처리
    }
  };

  return (
    <>
      <div className="codeip-container">
        <div className="text_title_s primary">쿠폰번호 16자리를 입력하세요</div>

        <div className="custom-inputbox-container">
          <input
            className="custom-inputbox"
            type="text"
            placeholder="쿠폰번호 16자리를 입력해주세요."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)} // 입력값 업데이트
          />
        </div>

        <div className="btn-primary" onClick={handleCouponSubmit}>
          쿠폰 사용하기
        </div>

        {errorMessage && ( // 에러 메시지 표시
          <div className="text_body_l point_red">{errorMessage}</div>
        )}

        <div className="codeip-info">
          <div className="text_title_xs">코드 등록 안내</div>
          <div className="text_body_m font_black_light">
            매장에서 받은 16자리 코드를 입력하세요
            <br />
            코드는 1회용으로 단 한번만 사용됩니다
            <br />
            사용되었거나 입력이 틀린 경우 등록되지 않습니다
            <br />
            코드는 경우에 따라 16자리가 아닐 수도 있습니다
          </div>
        </div>
      </div>
    </>
  );
};
