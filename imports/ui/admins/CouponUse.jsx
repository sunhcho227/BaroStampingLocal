import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import Nav from "./Nav.jsx";
import Modal from "../Modal.jsx";
import { Coupons, Admins, Stores } from "/imports/api/collections";
import StampCouponSidebar from "./StampCouponSidebar.jsx";
import StampCouponSidebarRow from "./StampCouponSidebarRow.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅

const CouponUse = () => {
  const admin = Meteor.user();
  const location = useLocation();
  const navigate = useNavigate();
  const couponId = location.state?.coupon_id;
  const coupon = Coupons.findOne({ _id: couponId });
  const storeId = Admins.findOne({ user_id: admin._id })?.store_id;
  const storeUrlName = Stores.findOne({ _id: storeId })?.storeUrlName;

  const couponType =
    coupon?.couponType === "서비스" ? "servicecoupon" : "coupon";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // 쿠폰 이미지 경로 생성
  const getCouponImagePath = (storeId, couponType) => {
    if (!storeId || !couponType) return "/stores/default_coupon.png";
    return `/stores/${storeUrlName}_${couponType}.png`;
  };

  const handleUseCoupon = () => {
    if (couponId) {
      Meteor.call("users.useCoupon", admin._id, couponId, (error, result) => {
        if (error) {
          setModalMessage("쿠폰 사용에 실패했습니다: " + error.reason);
        } else if (result) {
          setModalMessage(result);
        }
        setIsModalOpen(true);
      });
    } else {
      setModalMessage("쿠폰 ID를 찾을 수 없습니다.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (!modalMessage.includes("실패")) {
      navigate("/admins/StampCoupon");
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  return (
    <>
      <Nav />

      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:min-h-screen">
          {/* 사이드바 */}
          {isMobile ? <StampCouponSidebarRow /> : <StampCouponSidebar />}

          {/* 페이지본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* 헤드섹션 */}
              <h1 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-3xl">
                쿠폰 사용 처리
              </h1>
              <p className="mt-2 text-center text-sm text-gray-500 mb-6">
                쿠폰 사용 처리 버튼을 누르면 고객님의 쿠폰이 사용처리 됩니다
              </p>

              <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    <img
                      src={getCouponImagePath(storeId, couponType)}
                      alt="Coupon"
                      className="w-40 h-40 object-cover rounded-md shadow-sm"
                      onError={(e) => {
                        e.target.src = "/stores/default_coupon.png"; // 기본 이미지로 대체
                      }}
                    />
                  </div>
                </div>

                <div className=" text-gray-700 mb-4 text-center">
                  {
                    Meteor.users.findOne({ _id: coupon.user_id })?.profile
                      .nickname
                  }
                  님의
                  <br />
                  <span className="font-semibold">
                    {coupon.couponType === "서비스"
                      ? "서비스쿠폰"
                      : "스탬프 적립 쿠폰"}
                  </span>{" "}
                  <br />
                  쿠폰번호{" "}
                  <span className=" text-[#00838C]">{couponId}</span>를
                  <br />
                  사용 처리합니다.
                </div>

                <button
                  onClick={handleUseCoupon}
                  className="w-full py-2 px-4 bg-[#00838C] text-white font-semibold rounded-md hover:bg-[#006B6F] transition-colors duration-200"
                >
                  쿠폰 사용 처리
                </button>
              </div>

              <Modal
                isOpen={isModalOpen}
                message={modalMessage}
                onClose={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponUse;
