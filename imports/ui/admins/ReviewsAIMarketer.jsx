import React, { useState } from "react";
import { Admins, Stores } from "/imports/api/collections";
import Modal from "../Modal.jsx";

export default () => {
  const user = Meteor.user();
  const storeId = Admins.findOne({ user_id: user._id }).store_id;
  const [storeLLM, setStoreLLM] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerateStoreLLM = () => {
    setIsLoading(true);
    setStoreLLM("고객에게 최선을 다하는 서비스!");
    setIsLoading(false);

    // Meteor.call("generateStoreLLM", storeId, (error, result) => {
    //   if (error) {
    //     console.error("Error storeLLM:", error.reason);
    //   } else {
    //     setStoreLLM(result);
    //   }
    //   setIsLoading(false);
    // });
  };

  const handleApplyStoreLLM = () => {
    Meteor.call("updateStoreLLM", storeId, storeLLM, (error, result) => {
      if (error) {
        console.error("Error updating promo text:", error.reason);
      } else {
        setMessage("홍보 문구가 성공적으로 적용되었습니다!");
        setIsModalOpen(true);
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* 모바일 섹션 */}
      <div className="md:hidden space-y-6">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">LLM Ad Generator</h1>
          <div className="w-full max-w-[600px] aspect-[16/9] bg-gray-500 mx-auto rounded-lg">
            <video
              src="/video/cutie.mp4"
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <h3 className="text-xl font-semibold text-purple-600">
            "최첨단 LLM(대규모 언어 모델) 기술로 당신의 가게를 돋보이게
            만드세요!"
          </h3>
          <h3 className="text-lg text-gray-700">
            고객 리뷰를 바탕으로 AI가 자동으로 효과적인 홍보문구를 생성합니다.
          </h3>
        </div>

        {/* 특징 설명 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
              가게의 강점을 강조하는 맞춤형 프로모션 문구 제공
            </li>
            <li className="flex items-center">
              <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
              감성 분석과 문맥 이해를 통한 자연스러운 텍스트 작성
            </li>
            <li className="flex items-center">
              <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
              한 번의 클릭으로 빠르고 손쉽게 생성 가능
            </li>
            <li className="flex items-center">
              <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
              브랜드 이미지에 맞는 일관된 톤과 스타일 유지
            </li>
          </ul>
        </div>

        {/* 예시 출력 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          {Stores.findOne({ _id: storeId }).storeLLM ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-purple-600">
                현재 사용중인 홍보 문구
              </span>
              <p className="text-gray-700 text-lg font-medium leading-relaxed text-center">
                {Stores.findOne({ _id: storeId }).storeLLM}
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-purple-600">
                예시 홍보 문구
              </span>
              <p className="text-gray-500 text-lg italic text-center leading-relaxed">
                "커피가 맛있는 카페, 조용한 분위기에 마음이 따뜻해지는 서비스"
              </p>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="text-center">
          <button
            className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateStoreLLM}
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </button>
        </div>

        {/* AI 생성 결과 출력 */}
        {(isLoading || storeLLM) && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              AI가 생성한 홍보문구
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center text-gray-500">
                  <svg
                    className="animate-spin mb-3 h-8 w-8 text-purple-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  홍보문구를 생성하고 있습니다...
                </div>
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {storeLLM}
                </p>
              )}
            </div>
            {!isLoading && storeLLM && (
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(storeLLM);
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  복사하기
                </button>
                <button
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  onClick={handleApplyStoreLLM}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  적용하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 데스크탑 섹션 */}
      <div className="hidden md:flex flex-col space-y-6">
        {/* 헤더 섹션 */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">LLM Ad Generator</h1>
          <h3 className="text-xl font-semibold text-purple-600">
            "최첨단 LLM(대규모 언어 모델) 기술로 당신의 가게를 돋보이게
            만드세요!"
          </h3>
          <h3 className="text-lg text-gray-700">
            고객 리뷰를 바탕으로 AI가 자동으로 효과적인 홍보문구를 생성합니다.
          </h3>
        </div>

        <div className="flex gap-4 justify-between">
          {/* 왼쪽: 이미지 */}
          <div className="w-1/2">
            <div className="w-full max-w-[600px] aspect-[16/9] bg-gray-500 rounded-lg">
              <video
                src="/video/cutie.mp4"
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          {/* 오른쪽: 특징 설명 */}
          <div className="w-1/2 flex flex-col justify-between">
            <div className="bg-gray-50 h-[230px] p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li>
                  <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
                  가게의 강점을 강조하는 맞춤형 프로모션 문구 제공
                </li>
                <li>
                  <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
                  감성 분석과 문맥 이해를 통한 자연스러운 텍스트 작성
                </li>
                <li>
                  <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
                  한 번의 클릭으로 빠르고 손쉽게 생성 가능
                </li>
                <li>
                  <i className="fa-solid fa-check w-5 h-5 text-purple-500 mr-2"></i>
                  브랜드 이미지에 맞는 일관된 톤과 스타일 유지
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 예시 출력 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
          {Stores.findOne({ _id: storeId }).storeLLM ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-purple-600">
                현재 사용중인 홍보 문구
              </span>
              <p className="text-gray-700 text-lg font-medium leading-relaxed text-center">
                {Stores.findOne({ _id: storeId }).storeLLM}
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-purple-600">
                예시 홍보 문구
              </span>
              <p className="text-gray-500 text-lg italic text-center leading-relaxed">
                "커피가 맛있는 카페, 조용한 분위기에 마음이 따뜻해지는 서비스"
              </p>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="text-center mt-4">
          <button
            className="w-full bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateStoreLLM}
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "생성하기"}
          </button>
        </div>

        {/* AI 생성 결과 출력 */}
        {(isLoading || storeLLM) && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              AI가 생성한 홍보문구
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center text-gray-500">
                  <svg
                    className="animate-spin mb-3 h-8 w-8 text-purple-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  홍보문구를 생성하고 있습니다...
                </div>
              ) : (
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {storeLLM}
                </p>
              )}
            </div>
            {!isLoading && storeLLM && (
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  onClick={() => {
                    navigator.clipboard.writeText(storeLLM);
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  복사하기
                </button>
                <button
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  onClick={handleApplyStoreLLM}
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  적용하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} message={message} onClose={closeModal} />
    </div>
  );
};
