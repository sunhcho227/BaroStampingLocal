// Coupons.jsx
import React, { useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Coupons, Stores } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export default () => {
  const user = useTracker(() => Meteor.user());
  const userId = user?._id;

  // 현재 사용자에 대한 쿠폰 정보 가져오기
  const { unusedCoupons, usedCoupons } = useTracker(() => {
    if (!userId) return { unusedCoupons: [], usedCoupons: [] };
    
    const unusedCoupons = Coupons.find({ user_id: userId, couponUsage: false }).fetch();
    const usedCoupons = Coupons.find({ user_id: userId, couponUsage: true }).fetch();
    return { unusedCoupons, usedCoupons };
  }, [userId]);

  // 표시할 쿠폰 개수를 관리하는 상태 변수 (초기값 3개)
  const [unusedDisplayCount, setUnusedDisplayCount] = useState(3);
  const [usedDisplayCount, setUsedDisplayCount] = useState(3);

  // 더보기 버튼 클릭 시 표시할 쿠폰 개수 증가
  const handleLoadMoreUnused = () => {
    setUnusedDisplayCount(unusedDisplayCount + 3); // 3개씩 더 표시
  };

  const handleLoadMoreUsed = () => {
    setUsedDisplayCount(usedDisplayCount + 3); // 3개씩 더 표시
  };

  const pageTitle = "쿠폰";
  document.title = `Stamping - ${pageTitle}`;
  
  return (
    <div>
      <h1>쿠폰 화면입니다.</h1>
      <Header pageTitle={pageTitle}/>
      <Nav />

      {/* userGrade가 "비회원"일 경우에만 회원가입 유도 메시지 표시 */}
      {user?.profile?.userGrade === "비회원" && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          비회원이시군요! 회원가입 후 다양한 혜택을 받아보세요.
        </div>
      )}
      <hr />

      {/* 사용 가능한 쿠폰 섹션 */}
      <section>
        <h3>사용 가능한 쿠폰 : {unusedCoupons.length}개</h3>
        {unusedCoupons.length > 0 ? (
          unusedCoupons.slice(0, unusedDisplayCount).map((coupon) => {
            const store = Stores.findOne({ _id: coupon.store_id });
            const expirationDate = new Date(coupon.createdAt).addDays(30);

            return (
              <div key={coupon._id} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    width: "100px",
                    height: "50px",
                    backgroundColor: "gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {coupon.couponType === "서비스" ? "서비스 쿠폰" : "통상 쿠폰"}
                </div>
                <div>{coupon._id}</div>
                <p>쿠폰 종류: {coupon.couponMemo || `스탬프 적립 쿠폰`}</p>
                <p>가게 이름: {store?.storeName || "가게 정보 없음"}</p>
                <p>유효기간: ~{expirationDate.toLocaleDateString()}</p>
                <Link to={`/customers/usingCoupon/${coupon._id}`}>
                  <button>쿠폰 사용</button>
                </Link>
              </div>
            );
          })
        ) : (
          <p>사용 가능한 쿠폰이 없습니다.</p>
        )}

        {/* "더보기" 버튼, 남은 쿠폰이 있으면 표시 */}
        {unusedCoupons.length > unusedDisplayCount && (
          <button onClick={handleLoadMoreUnused}>더보기</button>
        )}
      </section>

      <hr />

      {/* 사용된 쿠폰 섹션 */}
      <section>
        <h3>사용된 쿠폰 (couponUsage가 T인거)</h3>
        {usedCoupons.length > 0 ? (
          usedCoupons.slice(0, usedDisplayCount).map((coupon) => {
            const store = Stores.findOne({ _id: coupon.store_id });
            const usedAtDate = new Date(coupon.usedAt);

            return (
              <div key={coupon._id} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    width: "100px",
                    height: "50px",
                    backgroundColor: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  {coupon.couponType === "서비스" ? "서비스 쿠폰" : "통상 쿠폰"}
                </div>
                <div>{coupon._id}</div>
                <p>가게 이름: {store?.storeName || "가게 정보 없음"}</p>
                <p>사용된 날짜: {usedAtDate.toLocaleDateString()}</p>
              </div>
            );
          })
        ) : (
          <p>사용된 쿠폰이 없습니다.</p>
        )}

        {/* "더보기" 버튼, 남은 쿠폰이 있으면 표시 */}
        {usedCoupons.length > usedDisplayCount && (
          <button onClick={handleLoadMoreUsed}>더보기</button>
        )}
      </section>
    </div>
  );
};
