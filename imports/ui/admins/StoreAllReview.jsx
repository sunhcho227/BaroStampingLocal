import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import Nav from "./Nav.jsx";
import ReviewsPage from "./ReviewsPage.jsx";
import ReviewsAIManager from "./ReviewsAIManager.jsx";
import ReviewsAIMarketer from "./ReviewsAIMarketer.jsx";
import Loading from "../Loading.jsx";

export default () => {
  const [activeTab, setActiveTab] = useState("ReviewsAIManager");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Nav />
      <div className="flex flex-col gap-0">
        <div className="bg-[#ECFAFE] w-full mt-[2px] mb-8 flex justify-center mx-auto">
          <div className="flex flex-col md:flex-row w-full max-w-[800px] justify-center gap-6 py-4 px-6">
            {/* 로고 자리 */}
            <div className="flex flex-row md:flex-col justify-center items-center gap-2 min-w-[150px]">
              {/* OpenAI 로고 */}
              <img
                src="/images/OpenAI_Logo.svg"
                alt="OpenAI Logo"
                className="h-8 w-auto"
              />
              {/* Azure 로고 */}
              <img
                src="/images/microsoft-azure-logo.svg"
                alt="Azure Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* 설명 섹션 */}
            <div className="flex flex-col gap-2 justify-between text-sm text-gray-800">
              <div>
                <span className="font-semibold text-[#007FFF]">OpenAI</span>의{" "}
                <span className="font-semibold">GPT</span> 기반{" "}
                <span className="font-semibold">LLM(Large Language Model)</span>
                과 <span className="font-semibold">자연어 처리 (NLP) 기술</span>
                이 결합된 혁신적 솔루션으로,{" "}
                <span className="font-semibold">
                  스트레스 없는 스마트한 고객 커뮤니케이션을
                </span>{" "}
                경험해보세요!
              </div>

              <div>
                OpenAI의 서비스는
                <span className="font-semibold text-[#007FFF]"> Azure</span>의
                안전하고 확장 가능한 클라우드 인프라를 통해 제공됩니다.
              </div>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex mx-auto rounded-full p-1 text-center text-sm font-semibold ring-1 ring-inset ring-gray-200 my-5">
          <button
            onClick={() => setActiveTab("ReviewsAIManager")}
            className={`w-[140px] px-4 py-2 cursor-pointer rounded-full transition-colors duration-200 
      ${
        activeTab === "ReviewsAIManager"
          ? "bg-[#00838C] text-white"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
          >
            AI 댓글
          </button>
          <button
            onClick={() => setActiveTab("ReviewsAIMarketer")}
            className={`w-[140px] px-4 py-2 cursor-pointer rounded-full transition-colors duration-200 
      ${
        activeTab === "ReviewsAIMarketer"
          ? "bg-[#00838C] text-white"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
          >
            AI 카피라이터
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        <div>
          <div></div>
          {activeTab === "ReviewsAIManager" && <ReviewsAIManager />}
          {activeTab === "ReviewsAIMarketer" && <ReviewsAIMarketer />}
        </div>

        {/* ReviewsPage 콘텐츠 */}
        <div>
          <ReviewsPage />
        </div>
      </div>
    </>
  );
};
