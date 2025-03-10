import React, { useState } from "react";

const StarRating = () => {
  const [rating, setRating] = useState(0); // 현재 선택된 평점

  // 별을 클릭했을 때 호출되는 함수
  const handleStarClick = (index) => {
    setRating(index + 1); // index는 0부터 시작하므로 +1
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>평점을 선택해주세요</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => handleStarClick(index)}
            style={{
              cursor: "pointer",
              fontSize: "30px",
              color: index < rating ? "gold" : "gray", // 조건부 색상
            }}
          >
            ★
          </span>
        ))}
      </div>
      <p style={{ marginTop: "10px", fontSize: "20px" }}>
        {rating > 0 ? `${rating}점` : "평점을 선택해주세요"}
      </p>
    </div>
  );
};

export default StarRating;
