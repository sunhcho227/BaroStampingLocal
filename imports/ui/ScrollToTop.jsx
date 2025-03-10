// ScrollToTop.jsx
// 스크롤 최상단으로 이동 컴포넌트
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 최상단으로
  }, [location]); // location이 변경될 때마다 실행

  return null;
};

export default ScrollToTop;
