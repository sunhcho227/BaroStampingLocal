import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Reviews, Stores, Coupons, Stamps } from "/imports/api/collections";
import { useTracker } from "meteor/react-meteor-data";
import Nav from "/imports/ui/customers/Nav.jsx";
import Modal from "../Modal.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const [reviews, setReviews] = useState({}); // 가게별 리뷰 내용 상태
  const [ratings, setRatings] = useState({}); // 가게별 레이팅 상태
  const [editingStates, setEditingStates] = useState({}); // 리뷰별 수정 상태 관리

  const allReview = Reviews.find().fetch();
  const myReview = Reviews.find(
    { user_id: user._id },
    { sort: { createdAt: -1 } }
  ).fetch();

  useTracker(() => {
    Stores.find().fetch();
  });

  const handleSave = (store_id) => {
    const obj = {
      user_id: user._id,
      store_id: store_id,
      reviewContents: reviews[store_id],
      rating: parseInt(ratings[store_id], 10),
    };

    Meteor.call("reviews.add", obj, (err, result) => {
      if (err) {
        console.log("review add 실패:", err);
      } else {
        console.log("성공");
        setReviews((prev) => ({ ...prev, [store_id]: "" })); // 입력 초기화
        setRatings((prev) => ({ ...prev, [store_id]: "" }));
      }
    });
  };

  const handleEditSave = (review) => {
    Meteor.call(
      "reviews.update",
      {
        _id: review._id,
        reviewContents: reviews[review._id] || review.reviewContents,
        rating: ratings[review._id] || review.rating,
      },
      (err) => {
        if (err) {
          console.log("리뷰 업데이트 실패:", err);
        } else {
          console.log("리뷰 업데이트 성공!");
          setEditingStates((prev) => ({ ...prev, [review._id]: false })); // 수정 모드 종료
        }
      }
    );
  };

  const handleRemove = (aa) => {
    Meteor.call("reviews.remove", aa, (err) => {
      if (err) {
        console.log("리뷰 삭제 실패");
      } else {
        console.log("리뷰 삭제 성공!");
        alert("삭제 완료");
      }
    });
  };

  const toggleEditMode = (reviewId) => {
    setEditingStates((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId], // 수정 모드 상태를 토글
    }));
  };

  const handleEditChange = (reviewId, field, value) => {
    if (field === "content") {
      setReviews((prev) => ({
        ...prev,
        [reviewId]: value,
      }));
    } else if (field === "rating") {
      setRatings((prev) => ({
        ...prev,
        [reviewId]: value,
      }));
    }
  };

  const pageTitle = "마이 리뷰";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <div>
      <Header pageTitle={pageTitle}/>
      <Nav />
      <h1>마이 리뷰 화면 입니다</h1>
      <h3>{user.profile.nickname}님 환영합니다</h3>
      <hr />

      <h1>내 모든 리뷰</h1>
      {myReview.length === 0 ? (
        <p>리뷰를 남겨보세요.</p>
      ) : (
        myReview.map((myreview) => (
          <div key={myreview._id}>
            {editingStates[myreview._id] ? (
              <div>
                <input
                  type="text"
                  value={
                    reviews[myreview._id] !== undefined
                      ? reviews[myreview._id]
                      : myreview.reviewContents
                  }
                  onChange={(e) =>
                    handleEditChange(myreview._id, "content", e.target.value)
                  }
                  placeholder="리뷰 내용을 수정하세요."
                />
                <input
                  type="number"
                  value={
                    ratings[myreview._id] !== undefined
                      ? ratings[myreview._id]
                      : myreview.rating
                  }
                  onChange={(e) =>
                    handleEditChange(myreview._id, "rating", e.target.value)
                  }
                  placeholder="평점을 수정하세요."
                />
                <button onClick={() => handleEditSave(myreview)}>수정</button>
                <button onClick={() => toggleEditMode(myreview._id)}>
                  취소
                </button>
              </div>
            ) : (
              <div>
                <div>
                  {
                    Stores.findOne({
                      _id: Reviews.findOne({ user_id: user._id }).store_id,
                    }).storeName
                  }
                </div>
                <div>리뷰 내용: {myreview.reviewContents}</div>
                <div>평점: {myreview.rating}</div>
                <div>작성일: {myreview.createdAt?.toLocaleString()}</div>
                <button onClick={() => handleRemove(myreview._id)}>삭제</button>
                <button onClick={() => toggleEditMode(myreview._id)}>
                  수정
                </button>
              </div>
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
};
