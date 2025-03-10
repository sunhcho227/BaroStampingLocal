// UserDetail.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import Nav from "./Nav.jsx";
import { Meteor } from "meteor/meteor";
import { Stamps, Admins, Coupons, Stores } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Modal from "../Modal.jsx";

const UserDetail = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputCount, setInputCount] = useState(1);

  // 고객ID 정의
  const userDetail = useTracker(() => {
    return userId ? Meteor.users.findOne(userId) : null;
  }, [userId]);

  // 가게 ID 정의
  const storeId = useTracker(() => {
    const currentUserId = Meteor.userId();
    const adminRecord = Admins.findOne({ user_id: currentUserId });
    return adminRecord ? adminRecord.store_id : null;
  }, []);

  const normalCoupons = useTracker(() => {
    return Coupons.find({
      store_id: storeId,
      user_id: userId,
      couponType: "통상",
      couponUsage: false,
    }).fetch();
  }, [userId]);

  const serviceCoupons = useTracker(() => {
    return Coupons.find({
      store_id: storeId,
      user_id: userId,
      couponType: "서비스",
      couponUsage: false,
    }).fetch();
  }, [userId]);

  const usedCoupons = useTracker(() => {
    return Coupons.find({
      store_id: storeId,
      user_id: userId,
      couponUsage: true,
    }).fetch();
  }, [userId]);

  const stampCount = useTracker(() => {
    if (!storeId || !userId) return 0;
    const stampRecords = Stamps.find({
      user_id: userDetail?._id,
      store_id: storeId,
    }).fetch();
    return stampRecords.length;
  }, [userId, storeId]);

  // 스탬프 지급용 버튼
  const handleDecrement = () => {
    setInputCount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setInputCount((prev) => prev + 1);
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value, 10);
    setInputCount(value > 0 ? value : 1);
  };

  // 스탬프 지급 처리시 확인용 모달
  const handleGiveStamp = () => {
    if (storeId && userId) {
      Meteor.call("addStampsbyCamera", storeId, userId, inputCount, (error) => {
        if (error) {
          setModalMessage("스탬프 지급 중 오류가 발생했습니다.");
        } else {
          setModalMessage(`${inputCount}개의 스탬프가 지급되었습니다.`);
          setInputCount(1);
        }
        setIsModalOpen(true);
      });
    } else {
      setModalMessage("스탬프 지급에 필요한 정보가 부족합니다.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!userId || !userDetail) {
    return <div>유저 정보를 불러올 수 없습니다.</div>;
  }

  // 유져 프로필 사진 가지고 오기
  const [isLoading, setIsLoading] = useState(true);
  const [profileImg, setProfileImg] = useState([]);
  const [normalCouponImages, setNormalCouponImages] = useState([]);
  const [serviceCouponImages, setServiceCouponImages] = useState([]);

  const fetchBlobs = () => {
    setIsLoading(true);

    Meteor.call("azureBlob.getBlobs", userDetail._id, (err, result) => {
      if (err) {
        console.error(err, "Blob 데이터를 가져오는 데 실패했습니다.");
      } else {
        setProfileImg(result);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (userDetail && userDetail._id && storeId) {
      fetchBlobs();
    }
  }, [userDetail]);

  // storeUrlName 가져오기
  const storeUrlName = Stores.findOne({ _id: storeId })?.storeUrlName;

  const getImagePath = (storeUrlName, type) => {
    if (!storeUrlName || !type) return `/stores/placeholderimg.png`;
    return `/stores/${storeUrlName}_${type}.png`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 유저 정보 섹션 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            유저 정보
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            <div>
              {isLoading ? (
                <p>Image Loading...</p>
              ) : profileImg && profileImg.length > 0 ? (
                profileImg.map((blob, index) => (
                  <div
                    key={index}
                    className="w-full md:w-[100px] aspect-[3/2] bg-[#04BECC] mb-1"
                  >
                    <img
                      src={blob.url}
                      alt={`이미지 ${index + 1}`}
                      onClick={() => window.open(blob.url, "_blank")}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full md:w-[100px] aspect-[3/2] md:h-[100px] bg-[#04BECC] mb-1">
                  <img src="/images/placeholderimg.png" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 gap-x-20">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">아이디:</span>
                <span className="font-medium">{userDetail.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">닉네임:</span>
                <span className="font-medium">
                  {userDetail.profile.nickname}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">이메일:</span>
                <span className="font-medium">
                  {userDetail.profile.email || "이메일 정보 없음"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">연락처:</span>
                <span className="font-medium">
                  {userDetail.profile.phoneNumber || "연락처 정보 없음"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">등급:</span>
                <span className="font-medium">
                  {userDetail.profile.userGrade}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">현재 스탬프:</span>
                <span className="font-medium">{stampCount}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* 스탬프 지급 섹션 */}
        <div className="flex flex-col bg-white shadow rounded-lg p-6 gap-3 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 text-center md:text-left ">
            스탬프 지급
          </h4>
          <div className="flex items-center text-center justify-center md:justify-start space-x-4">
            <button
              onClick={handleDecrement}
              className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              <i className="fas fa-minus"></i>
            </button>
            <input
              type="number"
              value={inputCount}
              onChange={handleInputChange}
              min="1"
              className="w-20 text-center border-gray-300 rounded-md focus:ring-[#00A9B5] focus:border-[#00A9B5]"
            />
            <button
              onClick={handleIncrement}
              className="w-7 h-7 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <button
            onClick={handleGiveStamp}
            className="w-full md:w-auto md:max-w-[200px] bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
          >
            스탬프 지급
          </button>
        </div>

        {/* 서비스 쿠폰 지급 섹션 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col gap-4">
          <h4 className="text-lg font-semibold text-gray-900 text-center md:text-left">
            서비스 쿠폰 지급
          </h4>
          <Link
            to="/admins/serviceCouponPlus"
            state={{ user_id: userDetail._id }}
          >
            <button className="w-full md:w-auto bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
              서비스 쿠폰 지급 바로 가기
            </button>
          </Link>
        </div>

        {/* 쿠폰 목록 섹션 */}
        <div className="space-y-8">
          {/* 통상 쿠폰 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userDetail.profile.nickname}고객님의 통상 쿠폰 현황
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalCoupons.length > 0 ? (
                normalCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">
                      {isLoading ? (
                        <p className="text-gray-500 text-center">
                          이미지를 불러오는 중...
                        </p>
                      ) : (
                        <div className="flex justify-center mb-4">
                          <img
                            src={getImagePath(storeUrlName, "coupon")}
                            alt="통상 쿠폰 이미지"
                            onError={(e) =>
                              (e.target.src = `/stores/placeholderimg.png`)
                            }
                            className="w-40 h-40 object-cover rounded-md shadow-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="text-black font-bold pb-2 px-4 rounded-t-lg text-center mb-3 border-b border-gray-300">
                      통상 쿠폰
                    </div>

                    <div className="text-sm text-center text-gray-600 mb-1">
                      쿠폰번호 : {coupon._id}
                    </div>
                    <p className="text-center text-sm text-gray-600 mb-1">
                      발급날짜 :{" "}
                      {new Date(coupon.createdAt)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                    <p className="text-center text-sm text-gray-600 mb-3">
                      유효기간 :{" "}
                      {new Date(coupon.createdAt)
                        .addDays(30)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                    <Link
                      to="/admins/couponuse"
                      state={{ coupon_id: coupon._id }}
                    >
                      <button className="w-full bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                        쿠폰 사용 처리
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">통상 쿠폰이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 서비스 쿠폰 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userDetail.profile.nickname}고객님의 서비스 쿠폰 현황
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCoupons.length > 0 ? (
                serviceCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4">
                      {isLoading ? (
                        <p className="text-gray-500 text-center">
                          이미지를 불러오는 중...
                        </p>
                      ) : (
                        <div className="flex justify-center mb-4">
                          <img
                            src={getImagePath(storeUrlName, "servicecoupon")}
                            alt="서비스 쿠폰 이미지"
                            onError={(e) =>
                              (e.target.src = `/stores/placeholderimg.png`)
                            }
                            className="w-40 h-40 object-cover rounded-md shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-black font-bold pb-2 px-4 rounded-t-lg text-center mb-3 border-b border-gray-300">
                      서비스 쿠폰
                    </div>
                    <div className="text-sm text-center text-gray-600 mb-1">
                      쿠폰번호 : {coupon._id}
                    </div>
                    <p className="text-center text-sm text-gray-600 mb-1">
                      발급날짜:{" "}
                      {new Date(coupon.createdAt)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                    <p className="text-center text-sm text-gray-600 mb-3">
                      유효기간:{" "}
                      {new Date(coupon.createdAt)
                        .addDays(30)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                    <Link
                      to="/admins/couponuse"
                      state={{ coupon_id: coupon._id }}
                    >
                      <button className="w-full bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors">
                        쿠폰 사용 처리
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">서비스 쿠폰이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 사용 완료 쿠폰 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {userDetail.profile.nickname}고객님의 사용 완료된 쿠폰 현황
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usedCoupons.length > 0 ? (
                usedCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="text-black font-bold pb-2 px-4 rounded-t-lg text-l text-center mb-3 border-b border-gray-300">
                      사용 완료 쿠폰
                    </div>
                    <div className="text-center text-gray-600 mb-2">
                      쿠폰타입 :{" "}
                      {coupon.couponType === "서비스"
                        ? "서비스쿠폰"
                        : "스탬프 적립 쿠폰"}
                    </div>
                    {coupon.couponMemo && (
                      <div className="text-center text-gray-600 mb-2">
                        쿠폰메세지 : {coupon.couponMemo}
                      </div>
                    )}
                    <div className="text-sm text-center text-gray-600 mb-1 border-t border-gray-300 pt-2">
                      쿠폰번호 : {coupon._id}
                    </div>
                    <p className="text-center text-sm text-gray-600 mb-1">
                      발급날짜:{" "}
                      {new Date(coupon.usedAt)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                    <p className="text-center text-sm text-gray-600">
                      사용날짜:{" "}
                      {new Date(coupon.createdAt)
                        .toLocaleDateString()
                        .slice(0, -1)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">사용 완료된 쿠폰이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
    </div>
  );
};

export default UserDetail;
