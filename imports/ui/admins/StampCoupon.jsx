import React, { useState } from "react";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import { Link } from "react-router-dom";
import Nav from "./Nav.jsx";
import { Admins, UserStores } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import CheckboxList from "./CheckboxList.jsx";
import { StampControl } from "./StampPlus.jsx";
import { CouponControl } from "./ServiceCouponPlus.jsx";
import { Circles } from "react-loader-spinner";
import StampCouponSidebar from "./StampCouponSidebar.jsx";
import StampCouponSidebarRow from "./StampCouponSidebarRow.jsx";
import Loading from "../Loading.jsx";

export default () => {
  const user = Meteor.user();
  const storeId = Admins.findOne({ user_id: user._id })?.store_id;
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedNonMembers, setSelectedNonMembers] = useState([]);
  const [selectAllMembers, setSelectAllMembers] = useState(false);
  const [selectAllNonMembers, setSelectAllNonMembers] = useState(false);
  const [stampCount, setStampCount] = useState(1);
  const [couponCount, setCouponCount] = useState(1);
  const [reason, setReason] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  const handleIncrement = (setCount, count) => setCount(count + 1);
  const handleDecrement = (setCount, count) =>
    setCount(count > 1 ? count - 1 : 1);

  const members = Meteor.users
    .find(
      {
        _id: {
          $in: UserStores.find({ store_id: storeId })
            .fetch()
            .map((record) => record.user_id),
        },
        "profile.userGrade": "회원",
      },
      { sort: { "profile.createdAt": -1 } }
    )
    .fetch();

  const nonMembers = Meteor.users
    .find(
      {
        _id: {
          $in: UserStores.find({ store_id: storeId })
            .fetch()
            .map((record) => record.user_id),
        },
        "profile.userGrade": "비회원",
      },
      { sort: { "profile.createdAt": -1 } }
    )
    .fetch();

  const handleSelectAll = (isMember) => {
    if (isMember) {
      setSelectAllMembers(!selectAllMembers);
      setSelectedMembers(!selectAllMembers ? members.map((u) => u._id) : []);
    } else {
      setSelectAllNonMembers(!selectAllNonMembers);
      setSelectedNonMembers(
        !selectAllNonMembers ? nonMembers.map((u) => u._id) : []
      );
    }
  };

  const handleSelectUser = (id, isMember) => {
    if (isMember) {
      setSelectedMembers((prev) =>
        prev.includes(id)
          ? prev.filter((userId) => userId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedNonMembers((prev) =>
        prev.includes(id)
          ? prev.filter((userId) => userId !== id)
          : [...prev, id]
      );
    }
  };

  // 공통 submit 함수: API 호출 처리
  const submitAction = (methodName, successMessage, params, count) => {
    setIsLoading(true);
    Meteor.call(methodName, ...params, (error) => {
      setIsLoading(false);
      setModalMessage(
        error
          ? `${successMessage} 지급 중 오류가 발생했습니다: ` + error.message
          : `${successMessage} ${count}개가 지급되었습니다.`
      );
      setIsModalOpen(true);
    });
  };

  const handleStampSubmit = () => {
    const selectedUsers = [...selectedMembers, ...selectedNonMembers];
    submitAction(
      "users.addStamps",
      "스탬프",
      [storeId, selectedUsers, stampCount],
      stampCount
    );
    setSelectedMembers([]);
    setSelectedNonMembers([]);
    setSelectAllMembers(false);
    setSelectAllNonMembers(false);
    setStampCount(1);
  };

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    const selectedUsers = [...selectedMembers, ...selectedNonMembers];
    submitAction(
      "users.addCoupon",
      "쿠폰",
      [storeId, selectedUsers, couponCount, reason],
      couponCount
    );
    setSelectedMembers([]);
    setSelectedNonMembers([]);
    setSelectAllMembers(false);
    setSelectAllNonMembers(false);
    setCouponCount(1);
    setReason("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

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
              스탬프 및 쿠폰 관리
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              회원 및 비회원에게 스탬프와 쿠폰을 발급하거나 QR 코드를 통해
              관리할 수 있습니다. 발급 사유 입력, 개수 조정, 전체 선택 등 다양한
              기능을 제공합니다.
            </p>

            {/* 컨텐츠 박스 */}
            <div className="bg-white p-6 grid grid-cols-1 gap-6 rounded-lg">
              {/* 상단: 스탬프 지급 및 쿠폰 발급 */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* 스탬프 지급 */}
                <div className="w-full md:w-1/2 md:max-w-[600px] bg-white rounded-lg border border-[#00838C] p-6 shadow-md">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    스탬프 지급
                  </h2>

                  <div className="flex justify-center">
                    <div className="quantity-control flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleDecrement(setStampCount, stampCount)
                        }
                        className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="text-lg font-semibold">
                        {stampCount}
                      </span>
                      <button
                        onClick={() =>
                          handleIncrement(setStampCount, stampCount)
                        }
                        className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleStampSubmit}
                    className="w-full mt-4 bg-[#025F66] hover:bg-[#01474C] text-white font-medium py-2 px-4 rounded transition duration-200"
                  >
                    스탬프 지급
                  </button>
                </div>

                {/* 쿠폰 발급 */}
                <div className="w-full md:w-1/2 md:max-w-[600px] bg-white rounded-lg border border-[#00838C] p-6 shadow-md">
                  <h2 className="text-lg font-semibold mb-4 text-center">
                    쿠폰 발급
                  </h2>
                  <div className="flex justify-center">
                    <CouponControl
                      couponCount={couponCount}
                      handleIncrement={() =>
                        handleIncrement(setCouponCount, couponCount)
                      }
                      handleDecrement={() =>
                        handleDecrement(setCouponCount, couponCount)
                      }
                    />
                  </div>
                  <form onSubmit={handleCouponSubmit} className="mt-4">
                    <input
                      type="text"
                      placeholder="발급 사유 입력"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="w-full mt-4 bg-[#025F66] hover:bg-[#01474C] text-white font-medium py-2 px-4 rounded transition duration-200"
                    >
                      쿠폰 발급
                    </button>
                  </form>
                </div>
              </div>

              {/* 하단: 회원 목록 및 비회원 목록 */}
              <div className="grid grid-cols-1 gap-6">
                <CheckboxList
                  title="회원 목록"
                  users={members}
                  selectedUsers={selectedMembers}
                  onSelectUser={(id) => handleSelectUser(id, true)}
                  onSelectAll={() => handleSelectAll(true)}
                  isSelectAll={selectAllMembers}
                  className="bg-white rounded-lg shadow py-4"
                />

                <CheckboxList
                  title="비회원 목록"
                  users={nonMembers}
                  selectedUsers={selectedNonMembers}
                  onSelectUser={(id) => handleSelectUser(id, false)}
                  onSelectAll={() => handleSelectAll(false)}
                  isSelectAll={selectAllNonMembers}
                  className="bg-white rounded-lg shadow py-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </>
  );
};
