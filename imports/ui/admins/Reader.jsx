import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
// import Nav from "./Nav.jsx";

const Reader = ({ type: propType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const qrCodeRef = useRef(null);

  // Link로 전달된 state와 props에서 type을 가져옴
  const type = location.state?.type || propType;

  useEffect(() => {
    if (!qrCodeRef.current) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "uqr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        console.log("QR 코드 스캔 성공:", decodedText);

        try {
          // URL 형식인지 먼저 확인
          if (decodedText.includes("?data=")) {
            const url = new URL(decodedText);
            const data = url.searchParams.get("data");
            if (data) {
              const parsedData = JSON.parse(decodeURIComponent(data));
              handleParsedData(parsedData);
            }
          } else {
            // URL이 아닌 경우 JSON으로 파싱 시도
            const parsedData = JSON.parse(decodedText);
            handleParsedData(parsedData);
          }
        } catch (err) {
          console.error("QR 데이터 파싱 오류:", err.reason);
        }
      },
      (error) => {
        console.error("QR 코드 인식 오류:", error.reason);
      }
    );

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [type, navigate]);

  const handleParsedData = (parsedData) => {
    const { user_id, storeId, coupon_id, stampCount, storeUrlName } =
      parsedData;

    switch (type) {
      case "stampplus":
        console.log(`스탬프 적립 처리: User ID - ${user_id}`);
        navigate("/admins/stampplus", { state: parsedData });
        break;

      case "couponuse":
        console.log(
          `쿠폰 사용 처리: User ID - ${user_id}, Coupon ID - ${coupon_id}`
        );
        navigate("/admins/couponuse", { state: parsedData });
        break;

      case "serviceCouponPlus":
        console.log(`쿠폰 발급: User ID - ${user_id}`);
        navigate("/admins/serviceCouponPlus", { state: parsedData });
        break;

      case "order":
        console.log(`주문 처리: Store URL Name - ${storeUrlName}`);
        navigate(`/customers/order/${storeUrlName}`);
        break;

      case "getStamp":
        console.log(
          `스탬프 적립 처리: Store ID - ${storeId}, Stamps - ${stampCount}`
        );
        navigate("/customers/joinStampIng", { state: parsedData });
        break;

      case "useCoupon":
        console.log(`쿠폰 사용 처리: Coupon ID - ${coupon_id}`);
        navigate("/admins/couponuse", { state: parsedData });
        break;

      default:
        console.log(`스탬프 적립 처리: User ID - ${user_id}`);
        navigate(
          `/customers/joinStampIng?data=${encodeURIComponent(
            JSON.stringify(parsedData)
          )}`
        );
    }
  };

  return (
    <div>
      <div className="w-full mx-auto px-4 py-8">
        <h3 className="text_body_l text-center mb-2">
          QR 코드를 스캔해주세요
        </h3>

        <div>
          <div
            id="uqr-reader"
            ref={qrCodeRef}
            className="w-full mx-auto"

          />
        </div>
      </div>
    </div>
  );
};

export default Reader;
