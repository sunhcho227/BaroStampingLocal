import React, { useState, useEffect, useCallback } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Reviews,
  Stores,
  Coupons,
  Stamps,
  UserNotifications,
  Payments,
} from "/imports/api/collections";
import Modal from "../Modal.jsx";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import Tooltip from "../customers/Tooltip.jsx";
import Loading from "../Loading.jsx";
import ReadMoreButton from "/imports/ui/customers/ReadMoreButton.jsx";

export default () => {
  const user = useTracker(() => Meteor.user(), []);
  const navigate = useNavigate();
  const [reviewDisplayCount, setReviewDisplayCount] = useState(2);

  // useTracker 선언
  const reviews = useTracker(
    () => Reviews.find({ user_id: user?._id }).fetch(),
    [user]
  );
  const stores = useTracker(() => Stores.find().fetch(), []);
  const coupons = useTracker(
    () => Coupons.find({ user_id: user?._id }).fetch(),
    [user]
  );
  const stamps = useTracker(
    () => Stamps.find({ user_id: user?._id }).fetch(),
    [user]
  );

  // 비회원 접근 제한
  if (user?.profile?.userGrade === "비회원") {
    useEffect(() => {
      navigate("/customers/joinus");
    }, [user, navigate]);
  }

  // 누적 스탬프 갯수
  const notifications = UserNotifications.find({ user_id: user._id }).fetch();

  let stampTotalNumbers = 0;

  notifications.forEach((notification) => {
    stampTotalNumbers += notification.typeId.length;
  });

  // 스탬프가 있거나 쿠폰이 있는 가게
  const myAllStores1 = Stamps.find({ user_id: user._id }).fetch();
  const myAllStores2 = Coupons.find({ user_id: user._id }).fetch();
  const storeIdsFromStamps = myAllStores1.map((stamp) => stamp.store_id);
  const storeIdsFromCoupons = myAllStores2.map((coupon) => coupon.store_id);
  const allStoreIds = [
    ...new Set([...storeIdsFromStamps, ...storeIdsFromCoupons]),
  ];

  // 스탬프 발급중인 가게
  const myStampStores = Stamps.find({ user_id: user._id }).fetch();
  const myStampStoresIds = myStampStores.map((stamp) => stamp.store_id);
  const myAllStampStores = [...new Set([...myStampStoresIds])];

  // 리뷰 삭제
  const handleRemove = (myreview_id) => {
    Meteor.call("reviews.remove", myreview_id, (error) => {
      if (error) {
        console.error("리뷰 삭제 실패");
      } else {
        setMessage("리뷰 삭제 성공!");
        setIsModalOpen(true);
      }
    });
  };

  // const [isLoading, setIsLoading] = useState(true);
  // const [blobInfo, setBlobInfo] = useState(null);
  // const [storeBlobs, setStoreBlobs] = useState({});

  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;

  // const fetchBlobs = async () => {
  //   setIsLoading(true);
  //   try {
  //     const result = await new Promise((resolve, reject) => {
  //       Meteor.call("azureBlob.getBlobs", user._id, (err, res) => {
  //         if (err) reject(err);
  //         else resolve(res);
  //       });
  //     });
  //     setBlobInfo(result);
  //   } catch (error) {
  //     console.error("Blob 데이터를 가져오는 데 실패했습니다:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchBlobs();
  // }, []);

  const handleLoadMoreReview = () => setReviewDisplayCount((prev) => prev + 2);

  const pageTitle = "마이페이지";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="mypage-container">
        <Link to="/customers/EditProfileImage">
          <div className="ai-image-notice flex items-center gap-4 flex-wrap p-3 bg-[#F3FBDF] rounded-lg">
            <img
              src="/icons/openai.svg"
              alt="openAI"
              className="w-6 h-6 flex-shrink-0"
            />
            <div>
              <span className="text_body_l block font-semibold">DALL-E</span>
              <div className="text_body_xs">
                생성형 AI를 이용해 나만의 멋진 프로필 사진을 만들어 보세요!{" "}
                <u>이미지 생성하기✨</u>
              </div>
            </div>
          </div>
        </Link>

        <div className="mypage-top">
          <div className="profile-header flex flex-wrap justify-between items-center gap-4 py-2">
            <div className="text_title_m">
              <span className="primary">
                {user?.profile?.nickname || "GUEST"}
              </span>
              님의 마이 프로필
            </div>

            <div className="profile-header-button flex flex-wrap gap-2">
              <Link to="/customers/EditProfileImage">
                <div className="profile-header-button-openai flex items-center gap-2">
                  <div className="profile-header-icon">
                    <img
                      src="/icons/openai-secondary.svg"
                      alt="openAI"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="btn-small">프로필 사진 수정</div>
                </div>
              </Link>

              <Link to="/customers/editprofile">
                <div className="btn-small">프로필 수정</div>
              </Link>
            </div>
          </div>
          <div className="profile-image-placeholder">
            <img src="/images/placeholderimg.png" />
          </div>
          <div className="profile-details">
            <div className="profile-stats">
              <div className="stat-item">
                <div>
                  <Tooltip content={`누적 스탬프 ${stampTotalNumbers || 0}개`}>
                    <img src="/icons/star_stamp.svg" alt="누적스탬프" />
                  </Tooltip>
                </div>
                <span className="text_body_xl">{stampTotalNumbers || 0}</span>
              </div>
              <div className="stat-item">
                <div>
                  <Tooltip
                    content={`내가 쓴 리뷰 ${
                      Reviews.find({ user_id: user._id }).count() || 0
                    }개`}
                  >
                    <img src="/icons/star_review.svg" alt="리뷰" />
                  </Tooltip>
                </div>
                <span className="text_body_xl">
                  {Reviews.find({ user_id: user._id }).count() || 0}
                </span>
              </div>
              <div className="stat-item">
                <div>
                  <Tooltip
                    content={`이용중인 가게 ${
                      Stores.find({ _id: { $in: allStoreIds } }).count() || 0
                    }개`}
                  >
                    <img src="/icons/star_store.svg" alt="이용중인가게" />
                  </Tooltip>
                </div>
                <span className="text_body_xl">
                  {Stores.find({ _id: { $in: allStoreIds } }).count() || 0}
                </span>
              </div>

              <div className="stat-item">
                <div>
                  <Tooltip
                    content={`주문내역 ${
                      Payments.find({ user_id: user._id }).count() || 0
                    }개`}
                  >
                    <img src="/icons/list_black.svg" alt="주문내역" />
                  </Tooltip>
                </div>
                <span className="text_body_xl">
                  {Payments.find({ user_id: user._id }).count() || 0}
                </span>
              </div>
            </div>

            <div className="profile-info">
              <div className="info-row">
                <div className="text_title_xs"># 아이디</div>
                <div className="text_body_l">{user.username || "GUEST"}</div>
              </div>
              <div className="info-row">
                <div className="text_title_xs"># 닉네임</div>
                <div className="text_body_l">
                  {user.profile?.nickname || "등록된 닉네임이 없습니다"}
                </div>
              </div>
              <div className="info-row">
                <div className="text_title_xs"># 전화번호</div>
                <div className="text_body_l">
                  {user.profile?.phoneNumber || "등록된 전화번호가 없습니다"}
                </div>
              </div>
              <div className="info-row">
                <div className="text_title_xs"># 이메일</div>
                <div className="text_body_l">
                  {user.profile?.email || "등록된 이메일이 없습니다"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="coupon-status-container">
          <Link to="/customers/mycoupons" className="link-control">
            <div className="status-card-control">
              <div className="status-card">
                <div className="status-count">
                  <span className="status-number">
                    {Coupons.find({
                      user_id: user._id,
                      couponUsage: false,
                    }).fetch().length || 0}
                  </span>
                  <span className="text_title_m">개</span>
                </div>

                <div className="text_body_xl text_align_center">쿠폰 내역</div>
                <div className="status-row">
                  <div className="text_body_s primary">자세히 보기</div>
                  <img src="/icons/arrow-right-secondary.svg" alt="뒤로가기" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/customers/mystores" className="link-control">
            <div className="status-card-control link-control">
              <div className="status-card">
                <div className="status-count">
                  <span className="status-number">
                    {Stores.find({ _id: { $in: myAllStampStores } }).fetch()
                      .length || 0}
                  </span>
                  <span className="text_title_m">개</span>
                </div>
                <div className="text_body_xl text_align_center">
                  마이 스토어
                </div>
                <div className="status-row">
                  <div className="text_body_s primary">자세히 보기</div>
                  <img src="/icons/arrow-right-secondary.svg" alt="뒤로가기" />
                </div>
              </div>
            </div>
          </Link>

          <Link to="/customers/myorders" className="link-control">
            <div className="status-card-control link-control">
              <div className="status-card">
                <div className="status-count">
                  <span className="status-number">
                    {Payments.find({ user_id: user._id }).count() || 0}
                  </span>
                  <span className="text_title_m">개</span>
                </div>
                <div className="text_body_xl text_align_center">주문 내역</div>
                <div className="status-row">
                  <div className="text_body_s primary">자세히 보기</div>
                  <img src="/icons/arrow-right-secondary.svg" alt="뒤로가기" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="myreviews-box">
          <div className="title_all">마이 리뷰</div>
          <div className="reviews-header"></div>

          <div className="reviews-list">
            {Reviews.find({ user_id: user._id }).fetch().length === 0 ? (
              <p className="text_body_l">리뷰를 남겨보세요.</p>
            ) : (
              Reviews.find({ user_id: user._id }, { sort: { createdAt: -1 } })
                .fetch()
                .slice(0, reviewDisplayCount)
                .map((myreview) => {
                  return (
                    <div key={myreview._id}>
                      <div className="review-item">
                        <div className="review-header">
                          <div className="user-info">
                            <div className="user-avatar">
                              <img
                                src="/images/placeholderimg.png"
                                alt="기본 이미지"
                              />
                            </div>
                            <div className="user-details">
                              <div className="text_title_xs">
                                {Stores?.findOne({ _id: myreview?.store_id })
                                  ?.storeName || "알수 없는 가게"}{" "}
                                리뷰
                              </div>
                              <div className="flex flex-col gap-1 items-start">
                                <div className="user-rating">
                                  {/* 별 개수만큼 렌더링 */}
                                  {[...Array(myreview.rating)].map(
                                    (_, index) => (
                                      <img
                                        key={index}
                                        src="/icons/star.svg"
                                        alt={`별점 ${index + 1}`}
                                      />
                                    )
                                  )}
                                </div>
                                <div className="text_body_xs">
                                  {myreview.createdAt
                                    ?.toLocaleDateString()
                                    .slice(0, -1)}{" "}
                                  작성
                                  {myreview.updatedAt && (
                                    <span className="ml-2 text-xs text-gray-400">
                                      (수정됨)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text_body_m">
                          {myreview.reviewContents}
                        </div>
                        <div className="review-actions">
                          <Link
                            to="/customers/editreview"
                            state={{ myreview_id: myreview._id }}
                          >
                            <div className="btn-small">수정</div>
                          </Link>
                          <div
                            className="btn-small-sc"
                            onClick={() => handleRemove(myreview._id)}
                          >
                            삭제
                          </div>
                        </div>
                      </div>
                      {myreview.aiReview && (
                        <div className="mt-4 text-right">
                          <div className="inline-block bg-green-50 rounded-lg px-4 py-3 max-w-[80%]">
                            <div className="text-sm font-bold text-green-800 mb-1">
                              {Stores?.findOne({ _id: myreview.store_id })
                                ?.storeName || "알 수 없는 가게"}
                              의 답변
                              <img
                                src={
                                  Stores.findOne({ _id: myreview.store_id })
                                    ?.storeUrlName
                                    ? getPublicStoreLogoPath(
                                        Stores.findOne({
                                          _id: myreview.store_id,
                                        }).storeUrlName
                                      )
                                    : "/stores/default_logo.png"
                                }
                                alt="스토어 로고"
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
                              {myreview.aiReview}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            )}
            {Reviews.find({ user_id: user._id }).fetch().length > 1 && (
              <ReadMoreButton
                onClick={handleLoadMoreReview}
                text="내리뷰 더보기"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
