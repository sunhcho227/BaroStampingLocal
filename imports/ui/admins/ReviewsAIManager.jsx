import React, { useState } from "react";
import { Admins, Reviews } from "/imports/api/collections";
import Modal from "../Modal.jsx";

export default () => {
  const user = Meteor.user();
  const storeId = Admins.findOne({ user_id: user._id }).store_id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReviewLLM = () => {
    const reviews = Reviews.find({ store_id: storeId, aiReview: null }).fetch();
    const reply =
      "저희 매장을 이용해 주셔서 감사합니다. 앞으로 더 좋은 서비스를 제공하도록 최선을 다하겠습니다.";

    for (const review of reviews) {
      Reviews.update({ _id: review._id }, { $set: { aiReview: reply } });
    }

    setMessage("리뷰가 작성되었습니다.");
    setIsModalOpen(true);

    // setIsLoading(true);
    // Meteor.call("generateReviewLLM", storeId, (error, result) => {
    //   console.log("generateReviewLLM", result);
    //   if (error) {
    //     console.error("Error generating review LLM:", error.reason);
    //   } else {
    //     console.log("Review LLM generated successfully:", result);
    //     setMessage(result);
    //     setIsModalOpen(true);
    //   }
    //   setIsLoading(false);
    // });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* 모바일 섹션 */}
        <div className="md:hidden space-y-6">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">AI 댓글 생성</h1>
            <div className="w-full max-w-[600px] aspect-[16/9] bg-gray-500 mx-auto rounded-lg">
              <video
                src="/video/typing.mp4"
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-600">
              "고객과의 소통을 AI로 더욱 스마트하게!"
            </h3>
            <h3 className="text-lg text-gray-700">
              AI 기술을 활용해 고객 리뷰에 적합한 맞춤형 댓글을 제공합니다.
            </h3>
          </div>

          {/* 특징 설명 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                긍정적, 중립적, 부정적 리뷰에 맞는 댓글 작성
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                고객의 감정을 이해하고 진정성 있는 피드백 제공
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                시간을 절약하면서도 프로페셔널한 응답 가능
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                AI 기반 자동화로 일관된 품질 유지
              </li>
              <li className="flex items-center">
                <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                사용자 맞춤형 답변 생성
              </li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="text-center">
            <button
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateReviewLLM}
              disabled={isLoading}
            >
              {isLoading ? "답변 생성 중..." : "AI 답글 생성"}
            </button>
          </div>
        </div>

        {/* 데스크탑 섹션 */}
        <div className="flex flex-col hidden md:block">
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
            AI 댓글 생성
          </h1>
          <h3 className="text-xl text-center font-semibold text-blue-600 mb-4">
            "고객과의 소통을 AI로 더욱 스마트하게!"
          </h3>
          <h3 className="text-lg text-center text-gray-700 mb-3">
            AI 기술을 활용해 고객 리뷰에 적합한 맞춤형 댓글을 제공합니다.
          </h3>
          <div className="flex  justify-between gap-4">
            {/* 왼쪽: 헤더 및 이미지 */}
            <div className="w-1/2  flex flex-col items-center">
              <div className="w-full h-[230px] max-w-[600px] aspect-[16/9] bg-gray-500 rounded-lg">
                <video
                  src="/video/typing.mp4"
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* 오른쪽: 설명 및 특징 */}
            <div className="w-1/2 h-full flex flex-col ">
              <div className="bg-gray-50 h-[230px] p-6 rounded-lg">
                <ul className="space-y-3 h-full text-gray-600">
                  <li>
                    <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                    긍정적, 중립적, 부정적 리뷰에 맞는 댓글 작성
                  </li>
                  <li>
                    <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                    고객의 감정을 이해하고 진정성 있는 피드백 제공
                  </li>
                  <li>
                    <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                    시간을 절약하면서도 프로페셔널한 응답 가능
                  </li>
                  <li>
                    <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                    AI 기반 자동화로 일관된 품질 유지
                  </li>
                  <li>
                    <i className="fa-solid fa-check w-5 h-5 text-green-500 mr-2"></i>
                    사용자 맞춤형 답변 생성
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="text-center mt-4">
            <button
              className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGenerateReviewLLM}
              disabled={isLoading}
            >
              {isLoading ? "답변 생성 중..." : "AI 답글 생성"}
            </button>
          </div>
        </div>

        <Modal isOpen={isModalOpen} message={message} onClose={closeModal} />
      </div>
    </>
  );
};
