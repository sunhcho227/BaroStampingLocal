import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Admins, Stores } from "/imports/api/collections";

export default () => {
  const [paymentId, setPaymentId] = useState(null);
  const [count, setCount] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);
  const user = Meteor.user();
  const admin = Admins.findOne({ user_id: user._id });
  const store = Stores.findOne({ _id: admin?.store_id });

  useEffect(() => {
    const checkStorageChange = () => {
      const data = localStorage.getItem("paymentData");
      console.log("[checkStorageChange] localStorage checked:", data); // 콘솔 로그 추가
      if (data) {
        const { payment_id, stamp_count } = JSON.parse(data);

        // 기존 상태와 비교해 변경되었는지 확인
        if (payment_id !== paymentId || stamp_count !== count) {
          console.log("[checkStorageChange] Change detected:", {
            payment_id,
            stamp_count,
          }); // 변경 감지 로그
          setPaymentId(payment_id);
          setCount(stamp_count);
          setShowQR(true);
          setRemainingTime(10); // 타이머 초기화
        }
      }
    };

    // 1초마다 localStorage 확인
    const intervalId = setInterval(checkStorageChange, 1000);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 정리
  }, [paymentId, count]);

  useEffect(() => {
    let countdown;
    if (showQR) {
      countdown = setInterval(() => {
        setRemainingTime((prevTime) => {
          console.log("[QR Timer] Remaining time:", prevTime); // 타이머 상태 로그
          if (prevTime <= 1) {
            clearInterval(countdown);
            setShowQR(false); // QR 숨기기
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown); // 컴포넌트 언마운트 시 정리
  }, [showQR]);

  const stampQR = JSON.stringify({
    type: "getStamp",
    storeId: store._id,
    stampCount: count,
    paymentId: paymentId,
  });

  const stampUrl = `http://bstamp.shop/customers/joinStampIng?data=${encodeURIComponent(
    stampQR
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="bg-white rounded-lg shadow-md p-6 h-screen flex items-center justify-center">
          {showQR && paymentId ? (
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                스탬프 지급 화면
              </h1>
              <div className="flex justify-center items-center mb-6">
                <QRCodeCanvas
                  value={stampUrl}
                  size={160}
                  className="p-2 bg-white rounded-lg"
                />
              </div>
              <p className="text-center text-gray-700 mb-6">
                QR코드 스캔 시 {count}개의 스탬프가 적립됩니다.
              </p>
              <p className="text-center text-gray-500">
                QR코드는 {remainingTime}초 후에 사라집니다.
              </p>
            </div>
          ) : (
            <div>
              <div className="w-fullaspect-[3/2] bg-gray-500 text-white flex justify-center items-center mb-10">
                <video
                  src="/video/qr_loading.mp4"
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
              <div className="text-xl mt-3 text-center">번거로운 종이 쿠폰은 이제 그만.</div>
              <div className="text-xl text-center">스마트한 스탬핑을 경험해 보세요.</div>
              <div className="text-2xl mt-3 font-bold text-center text-gray-600">쉽고 빠른 전자 스탬프 서비스</div>
              <div className="text-center justify-center items-center">
                <img
                  src="/icons/baro_logo.svg"
                  alt="Baro"
                  className="mx-auto w-auto h-6 mt-3"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
