import React from "react";
import { Meteor } from "meteor/meteor";
import { Admins, Stores } from "/imports/api/collections";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const adminData = Admins.findOne({ user_id: user?._id });
  const storeId = adminData?.store_id;
  const storeUrlName = Stores.findOne({ _id: storeId })?.storeUrlName;

  // 이미지 경로 생성 함수
  const getImagePath = (storeUrlName, type) => {
    const typeMapping = {
      main: "main",
      sub: "sub",
      logo: "logo",
      "normal-coupon": "coupon",
      "service-coupon": "servicecoupon",
    };
    const imageType = typeMapping[type];
    if (!storeUrlName || !imageType) return null;

    // 서브 이미지의 경우 여러 개 처리
    if (type === "sub") {
      return Array.from({ length: 4 }, (_, i) =>
        `/stores/${storeUrlName}_sub${i + 1}.png`
      );
    }

    return `/stores/${storeUrlName}_${imageType}.png`;
  };

  // 이미지 렌더링 함수
  const renderImagesByType = (type, title) => {
    const imagePaths = getImagePath(storeUrlName, type);

    if (!imagePaths) {
      return (
        <div>
          <h2>{title}</h2>
          <p className="text-gray-500">{`${title}가 없습니다.`}</p>
        </div>
      );
    }

    const imageArray = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

    return (
      <div>
        <h2>{title}</h2>
        <div className="flex flex-wrap gap-4">
          {imageArray.map((path, index) => (
            <div key={index} className="relative group">
              <img
                src={path}
                alt={`${title} ${index + 1}`}
                className="w-[100px] h-[100px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/stores/default_image.png"; // 기본 이미지 경로
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!storeId || !storeUrlName) {
    return <p className="text-gray-500">스토어 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-4 p-4 overflow-x-auto">
      {renderImagesByType("main", "메인 이미지")}
      {renderImagesByType("sub", "서브 이미지")}
      {renderImagesByType("logo", "로고")}
      {renderImagesByType("normal-coupon", "통상 쿠폰")}
      {renderImagesByType("service-coupon", "서비스 쿠폰")}
    </div>
  );
};
