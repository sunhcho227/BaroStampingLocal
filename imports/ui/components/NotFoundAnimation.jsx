import React from "react";
import Lottie from "react-lottie";
import NotFoundAnimationData from "/imports/ui/assets/NotFoundAnimation.json"; // 변수명 변경

const NotFoundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NotFoundAnimationData, // 수정된 변수명 사용
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Lottie options={defaultOptions} height={400} width={400} />
  );
};

export default NotFoundAnimation;
