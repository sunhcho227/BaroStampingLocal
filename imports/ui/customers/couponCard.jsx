import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CouponCard = ({ coupon, store }) => {
  const [imageUrl, setImageUrl] = useState(null);

  const getCouponImagePath = (storeUrlName, couponType) => {
    const typeMapping = {
      "통상": "coupon",
      "서비스": "servicecoupon",
    };
    const imageType = typeMapping[couponType?.trim()] || "default";
    return `/stores/${storeUrlName}_${imageType}.png`;
  };
  
  useEffect(() => {
    if (store?.storeUrlName && coupon.couponType) {
      const imagePath = getCouponImagePath(store.storeUrlName, coupon.couponType);
      setImageUrl(imagePath);
    }
  }, [store?.storeUrlName, coupon.couponType]);


  // 쿠폰 타입을 메타태그 형식으로 변환
  const getMetaType = (type) => {
    const typeMapping = {
      "통상": "normal-coupon",
      "서비스": "service-coupon",
    };
    const trimmedType = type?.trim(); // 공백 제거
    const metaType = typeMapping[trimmedType];

    if (!metaType) {
      console.warn(`매핑되지 않은 쿠폰 타입: "${type}"`);
    }

    return metaType || null; // 매핑되지 않으면 null 반환
  };

  const expirationDate = new Date(coupon.createdAt).addDays(30);

  return (
    <div className="mysc-coupon-card" key={coupon._id}>
      <div className="mysc-coupon-header">
        <div className="mysc-coupon-details">
          <div className="text_title_m">{store?.storeName || "가게 정보 없음"}</div>
          <div className="mysc-coupon-info">
            <div className="text_body_l">
              {store?.couponInformation || "쿠폰 정보 없음"}
            </div>
            <div className="text_body_l">{coupon.couponMemo || `스탬프 적립 쿠폰`}</div>
            <div className="text_body_xs word-break">쿠폰번호 : {coupon._id}</div>
            <div className="text_body_xs">
              발급날짜 : {coupon.createdAt.toLocaleDateString().slice(0, -1)}
            </div>
            <div className="text_body_xs">
              유효기간 : ~ {expirationDate.toLocaleDateString().slice(0, -1)}
            </div>
          </div>
        </div>
        <div className="mysc-store-couponimg">
        {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${coupon.couponType} 이미지`}
              onError={(e) => {
                e.target.src = "/stores/default_coupon.png"; // 기본 이미지
              }}
            />
          ) : (
            <div className="mysc-store-couponimg"></div>
          )}
        </div>
      </div>
      <div className="coupon-buttons">
        <Link to={`/customers/StoreDetail/${store?.storeUrlName}`}>
          <button className="btn-secondary-outline">가게 상세 보기</button>
        </Link>
        <Link to={`/customers/usingCoupon/${coupon._id}`}>
          <button className="btn-secondary">쿠폰 사용하기</button>
        </Link>
      </div>
    </div>
  );
};

export default CouponCard;
