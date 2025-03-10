import React from "react";
import PropTypes from "prop-types";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";



const ReadMoreButton = ({ onClick, text = "더보기", className = "" }) => {
  return (
    <button onClick={onClick} className={`read-more-button ${className}`}>
      {text}
    </button>
  );
};

ReadMoreButton.propTypes = {
  onClick: PropTypes.func.isRequired, // 클릭 이벤트 핸들러
  text: PropTypes.string,             // 버튼 텍스트
  className: PropTypes.string         // 추가 스타일 클래스
};

export default ReadMoreButton;
