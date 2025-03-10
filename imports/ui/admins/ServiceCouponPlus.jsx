import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useLocation, useNavigate } from "react-router-dom";
import { Admins } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import Modal from "../Modal.jsx";
import StampCouponSidebar from "./StampCouponSidebar.jsx";
import StampCouponSidebarRow from "./StampCouponSidebarRow.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅

// 쿠폰 증가/감소 버튼 컴포넌트
export const CouponControl = ({
  couponCount,
  handleIncrement,
  handleDecrement,
}) => (
  <div className="quantity-control">
    <button
      onClick={handleDecrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-minus"></i>
    </button>
    <span className="text-lg font-semibold">{couponCount}</span>
    <button
      onClick={handleIncrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-plus"></i>
    </button>
  </div>
);

const CouponPlus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.user_id;
  const [couponCount, setCouponCount] = useState(1);
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { storeId, username, loading } = useTracker(() => {
    const currentUser = Meteor.user();
    const loading = !currentUser;

    if (!currentUser) {
      return { loading, storeId: null, username: null };
    }

    const adminRecord = Admins.findOne({ user_id: currentUser._id });
    const storeId = adminRecord ? adminRecord.store_id : null;
    const user = Meteor.users.findOne({ _id: userId });
    const username = user ? user.username : null;

    return { storeId, username, loading };
  }, [userId]);

  if (loading) return <p>로딩 중입니다...</p>;

  const handleIncrement = () => setCouponCount((prev) => prev + 1);
  const handleDecrement = () =>
    setCouponCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleCouponSubmit = (event) => {
    event.preventDefault();

    Meteor.call(
      "addCouponbyCamera",
      storeId,
      userId,
      couponCount,
      reason,
      (error) => {
        if (error) {
          setMessage("쿠폰 발급에 실패했습니다: " + error.message);
        } else {
          setMessage(`쿠폰 ${couponCount}개가 ${username}에게 발급되었습니다.`);
        }
        setIsModalOpen(true);
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/admins/StampCoupon");
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
              쿠폰 발급
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500 mb-6">
              수량설정과 발급메세지를 작성한 후 스탬프 지급버튼을 눌러주세요
            </p>

              {username ? (
                <div className="bg-white p-10 rounded-lg shadow-md max-w-md mx-auto">
                  <p className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    {username}에게 쿠폰 발급
                  </p>

                  <div className="flex justify-center mb-6">
                    <CouponControl
                      couponCount={couponCount}
                      handleIncrement={handleIncrement}
                      handleDecrement={handleDecrement}
                    />
                  </div>

                  <form onSubmit={handleCouponSubmit} className="space-y-6">
                    <div>
                      <input
                        type="text"
                        placeholder="발급 사유 입력"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm resize-none placeholder-gray-400"
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#00838C] text-white font-semibold rounded-md hover:bg-[#006B6F] transition-colors duration-200"
                      >
                        쿠폰 발급
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  사용자 정보를 찾을 수 없습니다.
                </p>
              )}

              {/* 모달 컴포넌트 */}
              <Modal
                isOpen={isModalOpen}
                message={message}
                onClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPlus;
