import React from "react";
import { Meteor } from "meteor/meteor";
import { Admins, Stores } from "/imports/api/collections";

const StoreImageUsedCoupon = () => {
  const user = Meteor.user();
  const adminData = Admins.findOne({ user_id: user?._id });
  const storeId = adminData?.store_id;
  const storeUrlName = Stores.findOne({ _id: storeId })?.storeUrlName;

  // 퍼블릭 이미지 경로 생성 함수
  const getImagePath = (storeUrlName, type) => {
    if (!storeUrlName || !type) return `/stores/default_${type}.png`;
    return `/stores/${storeUrlName}_${type}.png`;
  };

  if (!storeUrlName) {
    return <p className="text-gray-500">스토어 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="space-y-4">
      {/* 파일 업로드 섹션 - 비활성화 */}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          disabled
          className="block w-full text-sm text-gray-500 rounded-md border border-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:rounded-r-none file:border file:border-gray-300
            file:text-sm file:font-semibold
            file:bg-gray-200 file:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
        />
        <button
          disabled
          className="w-32 h-full px-4 py-2 bg-gray-300 text-gray-500 font-semibold rounded-md
            cursor-not-allowed"
        >
          업로드
        </button>
      </div>

      {/* 이미지 미리보기 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="relative group">
          <img
            src={getImagePath(storeUrlName, "used-coupon")}
            alt={`사용쿠폰 이미지`}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = `/stores/default_used-coupon.png`; // 기본 이미지로 대체
            }}
          />
        </div>
      </div>

      {/* 상태 메시지 */}
      <div className="mt-4 p-4 rounded-md bg-gray-100 text-gray-500 font-semibold border border-gray-300">
        업로드 및 삭제 기능이 비활성화되었습니다.
      </div>
    </div>
  );
};

export default StoreImageUsedCoupon;
