import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import { useNavigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import Nav from "./Nav.jsx";
import StampCouponSidebar from "./StampCouponSidebar.jsx";
import StampCouponSidebarRow from "./StampCouponSidebarRow.jsx";

const ReaderAdmin = ({ type: propType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const qrCodeRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  // Link로 전달된 state와 props에서 type을 가져옴
  const type = location.state?.type || propType;

  useEffect(() => {
    if (!qrCodeRef.current) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
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

  // 서브타이틀을 반환
  const getSubtitle = () => {
    switch (type) {
      case "stampplus":
        return "스탬프 QR 발급";
      case "serviceCouponPlus":
        return "쿠폰 QR 발급";
      case "couponuse":
        return "쿠폰 QR 사용";
      default:
        return "QR 코드 스캔";
    }
  };

  return (
    <>
      <Nav />

      <div className="w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:min-h-screen">

{/* 사이드바: 데스크탑은 StampCouponSidebar, 모바일은 StampCouponSidebarRow */}
           {isMobile ? <StampCouponSidebarRow /> : <StampCouponSidebar />}

          {/* 페이지본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            {/* 헤드섹션 */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              QR 코드를 스캔해주세요
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              카메라사용 권한을 승인해주셔야 합니다.
            </p>

            <div className="w-full">
              <h2 className="text-xl font-semibold text-white mt-2 mb-2 text-center bg-[#00838C] py-2 rounded-t-md">
                {getSubtitle()}
              </h2>

              {/* reader control */}
              <div
                id="qr-reader"
                ref={qrCodeRef}
                className="flex flex-col bg-white p-6 gap-6 rounded-b-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReaderAdmin;
