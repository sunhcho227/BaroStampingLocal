import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
import { Stores, Reviews, UserStores } from "/imports/api/collections";
import ReadMoreButton from "/imports/ui/customers/ReadMoreButton.jsx";
import Loading from "../Loading.jsx";

export default () => {
  const { storeUrlName } = useParams();
  const store = Stores.findOne({ storeUrlName });
  const [reviewDisplayCount, setReviewDisplayCount] = useState(2);

  const [isLoading, setIsLoading] = useState(true);
  const [storeBlobs, setStoreBlobs] = useState({});
  const [profileImgs, setProfileImgs] = useState({});

  // 퍼블릭 이미지
  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;

  const fetchUserProfileImg = (userId) => {
    Meteor.call("azureBlob.getBlobs", userId, (err, result) => {
      if (err) {
        console.error(`프로필 이미지 가져오기 실패 (userId: ${userId})`, err);
      } else if (result?.length) {
        setProfileImgs((prev) => ({
          ...prev,
          [userId]: result[0].url, // 첫 번째 블롭 URL을 사용
        }));
      }
    });
  };

  const fetchStoreBlobs = async (storeIds) => {
    setIsLoading(true);

    try {
      const promises = storeIds.map(
        (storeId) => new Promise((resolve, reject) => {})
      );

      const results = await Promise.all(promises);

      const newStoreBlobs = results.reduce((acc, { storeId, url }) => {
        acc[storeId] = url;
        return acc;
      }, {});

      setStoreBlobs((prev) => ({ ...prev, ...newStoreBlobs }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // useTracker 선언
  useTracker(() => {
    Reviews.find().fetch();
  });

  useEffect(() => {
    const storeIds = Reviews.find().map((review) => review.store_id);
    const uniqueStoreIds = [...new Set(storeIds)];

    if (uniqueStoreIds.length > 0) {
      fetchStoreBlobs(uniqueStoreIds);
    }
  }, [Reviews]);

  // 리뷰 데이터 가져오기
  const reviews = useTracker(() =>
    Reviews.find({ store_id: store._id }, { sort: { createdAt: -1 } }).fetch()
  );

  useEffect(() => {
    reviews.forEach((review) => {
      if (!profileImgs[review.user_id]) {
        fetchUserProfileImg(review.user_id);
      }
    });
  }, [reviews]);

  const handleLoadMoreReview = () => setReviewDisplayCount((prev) => prev + 2);

  return (
    <>
      <div className="reviews-container">
        {Reviews.find({ store_id: store._id }, { sort: { createdAt: -1 } })
          .fetch()
          .slice(0, reviewDisplayCount)
          .map((review) => {
            const profileImgUrl = profileImgs[review.user_id];
            return (
              <div className="review-card" key={review._id}>
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      {profileImgUrl ? (
                        <img
                          src={profileImgUrl}
                          alt="프로필 이미지"
                          onClick={() => window.open(profileImgUrl, "_blank")}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src="/images/placeholderimg.png"
                          alt="기본 프로필 이미지"
                        />
                      )}
                    </div>

                    <div className="user-details">
                      <div className="text_title_xs">
                        {
                          Meteor.users.findOne({ _id: review.user_id }).profile
                            .nickname
                        }
                      </div>
                      <div className="user-rating">
                        {/* 별 개수만큼 렌더링 */}
                        {[...Array(review.rating)].map((_, index) => (
                          <img
                            key={index}
                            src="/icons/star.svg"
                            alt={`별점 ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text_body_xs">
                    {review.createdAt.toLocaleDateString()}
                    {review.updatedAt && (
                      <span className="ml-2 text-xs text-gray-400">
                        (수정됨)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text_body_m">{review.reviewContents}</div>
                {review.aiReview && (
                  <div className="mt-4 text-right">
                    <div className="inline-block bg-green-50 rounded-lg px-4 py-3 max-w-[80%]">
                      <div className="text-sm font-bold text-green-800 mb-1">
                        {Stores.findOne({ _id: review.store_id }).storeName}의
                        답변
                        <img
                          src={
                            store
                              ? getPublicStoreLogoPath(store.storeUrlName)
                              : "/stores/default_logo.png"
                          }
                          alt={`${store?.storeName || "기본 로고"}`}
                          style={{
                            width: "35px",
                            height: "35px",
                            borderRadius: "50%",
                            marginLeft: "8px",
                            display: "inline-block",
                          }}
                          onError={(e) => {
                            e.target.src = "/stores/default_logo.png";
                          }}
                        />
                      </div>

                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {review.aiReview}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        <ReadMoreButton onClick={handleLoadMoreReview} text="가게리뷰 더보기" />
      </div>
    </>
  );
};
