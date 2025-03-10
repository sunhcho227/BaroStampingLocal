import React from "react";
import { Coupons, Stores } from "/imports/api/collections";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default ({ usedDisplayCount, handleLoadMoreUsed, user }) => {
  const getPublicStoreLogoPath = (storeUrlName) =>
    `/stores/${storeUrlName}_logo.png`;

  

  return (
    <div className="couponused-container">
      <div className="coupon-section-container mycoupons-sc">
        {Coupons.find({ couponUsage: true, user_id: user._id }).fetch().length >
        0 ? (
          Coupons.find({ couponUsage: true, user_id: user._id })
            .fetch()
            .slice(0, usedDisplayCount)
            .map((coupon) => {
              const store = Stores.findOne({ _id: coupon.store_id });
              return (
                <div className="mysc-coupon-card used" key={coupon._id}>
                  <div className="mysc-coupon-header">
                    <div className="mysc-coupon-details">
                      <div className="text_title_m">
                        {store?.storeName || "가게 정보 없음"}
                      </div>
                      <div className="mysc-coupon-info">
                        <div className="text_body_l">
                          {store?.couponInformation || "쿠폰 정보 없음"}
                        </div>
                        <div className="text_body_l">
                          {coupon.couponMemo || `스탬프 적립 쿠폰`}
                        </div>
                        <div className="text_body_xs">
                          쿠폰번호 : {coupon._id}
                        </div>
                        <div className="text_body_xs">
                          발급날짜 :{" "}
                          {coupon.createdAt.toLocaleDateString().slice(0, -1)}
                        </div>
                      </div>
                    </div>
                    <div className="mysc-store-logo">
                      <img
                        src={
                          store
                            ? getPublicStoreLogoPath(store.storeUrlName)
                            : "/stores/default_logo.png"
                        }
                        alt={`${store?.storeName || "가게"} 로고`}
                        onError={(e) => {
                          e.target.src = "/stores/default_logo.png"; // 기본 로고 경로
                        }}
                      />
                    </div>
                  </div>
                  <div className="text_body_l">
                    {coupon.usedAt?.toLocaleDateString().slice(0, -1) ||
                      "사용 기록 없음"}{" "}
                    {coupon.usedAt?.toLocaleTimeString() || "사용 기록 없음"}{" "}
                    사용
                  </div>
                </div>
              );
            })
        ) : (
          <p className="text_body_l">사용된 쿠폰이 없습니다.</p>
        )}

        {Coupons.find({ couponUsage: true, user_id: user._id }).fetch().length >
          usedDisplayCount && (
          <button onClick={handleLoadMoreUsed} className="read-more-button">
            더보기
          </button>
        )}
      </div>
    </div>
  );
};
