import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "/imports/ui/assets/loading-animation.json"; // 애니메이션 JSON 파일 경로

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true, // 애니메이션 반복
    autoplay: true, // 자동으로 애니메이션 시작
    animationData: loadingAnimation, // 애니메이션 파일
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // 비율 유지
    },
  };

  return (
    <div className="loading-container-sc flex flex-col gap-3">
      <Lottie options={defaultOptions} height={200} width={200} />
      <p className="text-center text-bold text-gray-900">
        AI 로봇이 창의력 회로를 풀가동하고 있어요! ⚙️🖌️ <br />
        조금만 기다리면 멋진 이미지가 나올 거예요!”
      </p>
    </div>
  );
};

export default LoadingAnimation;
