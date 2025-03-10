import React, { useEffect, useState } from "react";
import { Coupons, Stores } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Header from "/imports/ui/customers/Header.jsx";
import CouponCard from "./couponCard";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default ({ unusedDisplayCount, handleLoadMoreUnused, user }) => {
  return (
    <div className="couponavailable-container">
      <div className="coupon-section-container mycoupons-sc">
        {Coupons.find({ couponUsage: false, user_id: user._id }).fetch()
          .length > 0 ? (
          Coupons.find(
            { couponUsage: false, user_id: user._id },
            { sort: { createdAt: -1 } }
          )
            .fetch()
            .slice(0, unusedDisplayCount)
            .map((coupon) => {
              const store = Stores.findOne({ _id: coupon.store_id });

              return (
                <CouponCard key={coupon._id} coupon={coupon} store={store} />
              );
            })
        ) : (
          <p className="text_body_l">사용 가능한 쿠폰이 없습니다.</p>
        )}

        {Coupons.find({ couponUsage: false, user_id: user._id }).fetch()
          .length > unusedDisplayCount && (
          <button onClick={handleLoadMoreUnused} className="read-more-button">
            더보기
          </button>
        )}
      </div>
    </div>
  );
};
