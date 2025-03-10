import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Admins } from "/imports/api/collections";
import StoreImageMain from "./StoreImageMain";
import StoreImageSub from "./StoreImageSub";
import StoreImageNormalCoupon from "./StoreImageNormalCoupon";
import StoreImageServiceCoupon from "./StoreImageServiceCoupon";
import StoreImageUsedCoupon from "./StoreImageUsedCoupon";
import StoreImageLogo from "./StoreImageLogo.jsx";
import StoreImageOther from "./StoreImageOther"; // 추가된 컴포넌트
import Nav from "./Nav.jsx";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";

export default () => {
  const [activeComponent, setActiveComponent] = useState("main"); // 기본적으로 "main" 컴포넌트를 활성화

  // 각 버튼을 클릭할 때마다 보여줄 컴포넌트를 설정하는 함수
  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  return (
    <>
      <Nav />

      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:min-h-screen">
          {/* 마이샵사이드바 */}
          {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}

          {/* 페이지 본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            <div className="max-w-7xl mx-auto">
              {/* 헤더 섹션 */}
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                스토어 이미지 관리
              </h1>
              <p className="mt-2 text-sm text-gray-500 mb-6">
                메인 이미지와 서브 이미지를 등록하거나 수정할 수 있습니다.
                이미지를 선택한 후 저장 버튼을 눌러주세요
              </p>

              {/* 이미지 섹션들 */}
              <div className="space-y-8">
                {/* 메인 이미지 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    메인 이미지
                  </h2>
                  <StoreImageMain />
                </div>

                {/* 서브 이미지 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    서브 이미지
                  </h2>
                  <StoreImageSub />
                </div>

                {/* 로고 이미지 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    로고 이미지
                  </h2>
                  <StoreImageLogo />
                </div>

                {/* 쿠폰 이미지 섹션 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    쿠폰 이미지
                  </h2>
                  <div className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        일반 쿠폰
                      </h3>
                      <StoreImageNormalCoupon />
                    </div>

                    <div className="pb-6">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        서비스 쿠폰
                      </h3>
                      <StoreImageServiceCoupon />
                    </div>

                    {/* <div>
                      <h3 className="text-lg font-medium text-gray-700 mb-4">
                        사용된 쿠폰
                      </h3>
                      <StoreImageUsedCoupon />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
