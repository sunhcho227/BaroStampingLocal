import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Admins } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import Modal from "../Modal.jsx";
import StampCouponSidebar from "./StampCouponSidebar.jsx";
import StampCouponSidebarRow from "./StampCouponSidebarRow.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅

// 스탬프 증가/감소 버튼 컴포넌트
export const StampControl = ({
  stampCount,
  handleIncrement,
  handleDecrement,
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={handleDecrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-minus"></i>
    </button>
    <input
      type="number"
      value={stampCount}
      readOnly
      className="h-10 w-20 text-center items-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00838C]"
    />
    <button
      onClick={handleIncrement}
      className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
    >
      <i className="fas fa-plus"></i>
    </button>
  </div>
);

const StampPlus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.user_id;
  const [stampCount, setStampCount] = useState(1);
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

  const handleIncrement = () => setStampCount((prev) => prev + 1);
  const handleDecrement = () =>
    setStampCount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleStampSubmit = () => {
    Meteor.call("addStampsbyCamera", storeId, userId, stampCount, (error) => {
      if (error) {
        setMessage("스탬프 지급에 실패했습니다: " + error.message);
      } else {
        setMessage(`스탬프 ${stampCount}개가 ${username}에게 지급되었습니다.`);
      }
      setIsModalOpen(true);
    });
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
            <div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 헤드섹션 */}
            <h1 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-3xl">
              스탬프 QR 발급
            </h1>
            <p className="mt-2 text-center text-sm text-gray-500 mb-6">
              수량을 설정한후 스탬프 지급버튼을 눌러주세요
            </p>

                {username ? (
                  <div className="bg-white p-10 rounded-lg shadow-md max-w-md mx-auto">
                    <p className="text-lg font-semibold text-gray-700 mb-4 text-center">
                      {username}에게 스탬프 지급
                    </p>

                    <div className="flex justify-center mb-6">
                      <StampControl
                        stampCount={stampCount}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                      />
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleStampSubmit}
                        className="w-full py-2 px-4 bg-[#00838C] text-white font-semibold rounded-md hover:bg-[#006B6F] transition-colors duration-200"
                      >
                        스탬프 지급
                      </button>
                    </div>
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
      </div>
    </>
  );
};

export default StampPlus;
