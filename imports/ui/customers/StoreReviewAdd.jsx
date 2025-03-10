import React, { useEffect, useState } from "react";
import Nav from "./Nav.jsx";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Stores, Reviews, Payments } from "/imports/api/collections";
import { useTracker } from "meteor/react-meteor-data";
import Modal from "../Modal.jsx";
import Header from "/imports/ui/customers/Header.jsx";

const StarRating = ({ onRatingChange }) => {
  const [rating, setRating] = useState(5);

  const handleStarClick = (index) => {
    const newRating = index + 1; // index는 0부터 시작하므로 +1
    setRating(newRating);
    onRatingChange(newRating); // 부모 컴포넌트로 선택된 평점 전달
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => handleStarClick(index)}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              color: index < rating ? "gold" : "gray", // 조건부 색상
            }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

const StoreReviewAdd = () => {
  const user = Meteor.user();
  const navigate = useNavigate();
  const location = useLocation();
  const paymentId = location.state?.payment_id;
  const payment = Payments.findOne({ _id: paymentId });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewContents, setReviewContents] = useState("");
  const [rating, setRating] = useState(5); // 별점 초기값 (기본 5점)
  const { storeUrlName } = useParams();
  const store = Stores.findOne({ storeUrlName });

  useTracker(() => {
    Stores.find().fetch();
    Reviews.find().fetch();
    Payments.find().fetch();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    Meteor.call(
      "reviews.add",
      user._id,
      store._id,
      payment._id,
      reviewContents,
      rating,
      (error, result) => {
        if (error) {
          console.error("리뷰 저장 중 오류가 발생했습니다. ", error.reason);
        } else {
          console.log(result);
          setMessage("리뷰가 성공적으로 저장되었습니다");
          setIsModalOpen(true);
        }
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/customers/order");
  };

  const pageTitle = "리뷰 작성";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <div>
      <Header pageTitle={pageTitle} />
      <Nav />

      <form onSubmit={handleSubmit} className="editreview-container">
        <div className="text_title_m primary">리뷰내용</div>
        <div className="custom-textarea-container">
          <textarea
            id="reviewContents"
            value={reviewContents}
            onChange={(e) => setReviewContents(e.target.value)}
            required
            className="custom-textarea"
            placeholder="리뷰를 작성해 주세요"
          ></textarea>
        </div>
        <div className="reviewrating">
          <div className="text_body_l">평점을 선택해주세요</div>
          <div className="reviewrating-star">
            {" "}
            <StarRating onRatingChange={setRating} /> {/* 별점 컴포넌트 */}
          </div>
        </div>
        <button type="submit" className="btn-secondary">
          리뷰 등록하기
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        message={message}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default StoreReviewAdd;
