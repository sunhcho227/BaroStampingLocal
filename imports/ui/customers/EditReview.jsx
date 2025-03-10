import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Reviews } from "/imports/api/collections";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Modal from "../Modal.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const location = useLocation();
  const navigate = useNavigate();
  const reviewId = location.state?.myreview_id;

  const [reviewContents, setReviewContents] = useState("");
  const [rating, setRating] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (reviewId) {
      const review = Reviews.findOne({ _id: reviewId });
      if (review) {
        setReviewContents(review.reviewContents || "");
        setRating(review.rating || "");
      }
    }
  }, [reviewId]);

  const handleEditSave = (e) => {
    e.preventDefault();

    Meteor.call(
      "reviews.update",
      reviewId,
      reviewContents,
      rating,
      (error, result) => {
        if (error) {
          console.error("리뷰 업데이트 실패:", error.reason);
        } else {
          setMessage("리뷰 업데이트 성공!", result);
          setIsModalOpen(true);
        }
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/customers/mypage");
  };

  const pageTitle = "리뷰 수정";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <div>
      <Header pageTitle={pageTitle} />
      <Nav />

      <form onSubmit={handleEditSave} className="editreview-container">
        <div className="text_title_m primary">리뷰내용 수정하기</div>
        <div
          id="reviewContents"
          type="text"
          value={reviewContents}
          onChange={(e) => setReviewContents(e.target.value)}
          required
          className="custom-textarea-container"
        >
          <textarea
            id="reviewContents"
            type="text"
            value={reviewContents}
            onChange={(e) => setReviewContents(e.target.value)}
            required
            className="custom-textarea"
            placeholder="리뷰를 작성해 주세요"
          ></textarea>
        </div>
        <div className="reviewrating-edit">
          <div className="text_body_l reviewrating-text">평점 수정</div>
          <div className="custom-inputbox-container">
            {" "}
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="custom-inputbox"
            />
          </div>
        </div>
        <button className="btn-secondary">리뷰 수정하기</button>
      </form>

      <Modal
        isOpen={isModalOpen}
        message={message}
        onClose={handleModalClose}
      />
    </div>
  );
};
