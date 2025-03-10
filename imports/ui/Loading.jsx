// Loading.jsx
import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "./loading.json"; // 애니메이션 JSON 파일 경로

const Loading = () => {
  const defaultOptions = {
    loop: true, // 애니메이션 반복
    autoplay: true, // 자동으로 애니메이션 시작
    animationData: loadingAnimation, // 애니메이션 파일
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice" // 비율 유지
    }
  };

  return (
    <div className="loading-container">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default Loading;
