import React from "react";
// import Lottie from "react-lottie";
// import animation404 from "/public/animations/404.json";
import NotFoundAnimation from '/imports/ui/components/NotFoundAnimation.jsx';

export default () => {


  return (
    <div>
      {" "}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-[#00838C]">페이지를 찾을 수가 없습니다</p>
          {/* <h1 className="mt-4 text-balance text-xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            페이지를 찾을 수 없습니다
          </h1> */}
          <NotFoundAnimation/ >
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            주소를 다시 확인해주세요!
          </p>

          {/* <div className="w-72 h-72 mx-auto mb-6">
            <Lottie options={defaultOptions} animationData={animation404} loop={true} />
          </div> */}

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
            >
              홈으로 돌아가기기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
