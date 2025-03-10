import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Admins, Stores } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import Nav from "./Nav.jsx";
import { PencilIcon } from "@heroicons/react/24/outline";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";

export default () => {
  const user = useTracker(() => Meteor.user(), []);
  const navigate = useNavigate();
  useTracker(() => {
    Admins.find().fetch();
    Stores.find().fetch();
  });

  const [storeInformation, setStoreInformation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  const currentStoreInfo = Stores.findOne({
    _id: Admins.findOne({ user_id: user._id })?.store_id,
  })?.storeInformation;

  const handleSubmit = (e) => {
    e.preventDefault();
    Meteor.call(
      "storeInformation.update",
      Admins.findOne({ user_id: user._id }).store_id,
      storeInformation,
      (error, result) => {
        if (error) {
          setMessage("저장 중 오류가 발생했습니다: " + error.message);
        } else {
          setMessage("가게 설명이 성공적으로 변경되었습니다.");
          setStoreInformation("");
        }
        setIsModalOpen(true);
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/admins/myshop");
  };

  return (
    <>
      <Nav />
      <div className="w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:min-h-screen">

          {/* 마이샵사이드바 */}
          {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}

          {/* 페이지 본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            {/* 헤드섹션 */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              가게 설명 수정
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              현재 등록된 가게 설명을 확인하고, 새로운 설명으로 업데이트할 수
              있습니다. 원하는 내용을 입력한 후 "수정하기" 버튼을 눌러주세요.
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* 현재 가게 설명 섹션 */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  현재 가게 설명
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                  {currentStoreInfo || "등록된 가게 설명이 없습니다."}
                </div>
              </div>

              {/* 수정 폼 섹션 */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                  <label
                    htmlFor="storeInformation"
                    className="text-lg font-semibold text-gray-900 mb-2"
                  >
                    새로운 가게 설명
                  </label>
                  <div className="relative">
                    <textarea
                      id="storeInformation"
                      name="storeInformation"
                      value={storeInformation}
                      onChange={(e) => setStoreInformation(e.target.value)}
                      required
                      rows="4"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00A9B5] focus:ring-[#00A9B5] sm:text-sm resize-none placeholder-gray-400"
                      placeholder="가게 설명을 입력해주세요..."
                    />

                    <div className="absolute bottom-2 right-2 flex items-center pr-3 pointer-events-none">
                      <PencilIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admins/myshop")}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                  >
                    수정하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          message={message}
          onClose={handleModalClose}
        />
      </div>
    </>
  );
};
