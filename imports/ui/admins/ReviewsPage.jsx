import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Admins, Stores, Reviews } from "/imports/api/collections";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import Nav from "./Nav.jsx";

const ReviewsPage = () => {
  const user = Meteor.user();
  const storeId = Admins.findOne({ user_id: user._id }).store_id;
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5; // 한 페이지당 보여줄 리뷰 수 증가

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const reviews = useTracker(() => {
    return Reviews.find(
      { store_id: storeId },
      {
        skip: (currentPage - 1) * reviewsPerPage,
        limit: reviewsPerPage,
        sort: { createdAt: -1 }, // 최신순 정렬
      }
    ).fetch();
  });

  const totalReviews = useTracker(() =>
    Reviews.find({ store_id: storeId }).count()
  );

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  // 별점 렌더링 함수
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">가게 리뷰 목록</h1>
            <p className="mt-2 text-sm text-gray-600">
              총 {totalReviews}개의 리뷰가 있습니다
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      {Meteor.users.findOne({ _id: review.user_id })?.profile
                        ?.nickname || "Guest!"}
                      {renderStars(review.rating)}
                      <p className="text-sm text-gray-500">
                        작성일: {review.createdAt.toLocaleDateString()}
                        {review.updatedAt && (
                          <span className="ml-2 text-xs text-gray-400">
                            (수정됨)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {review.reviewContents}
                  </p>
                  {review.aiReview && (
                    <div className="mt-4 text-right">
                      <div className="inline-block bg-blue-50 rounded-lg px-4 py-3 max-w-[80%]">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          사장님 답변
                        </p>
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {review.aiReview}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 페이지네이션 */}
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-md text-sm font-medium
                    ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  이전
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-md text-sm font-medium
                    ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
