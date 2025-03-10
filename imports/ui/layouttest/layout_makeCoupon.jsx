import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Stores } from "/imports/api/collections";
import { Meteor } from "meteor/meteor";
import { Link } from "react-router-dom";
import Modal from "../Modal.jsx";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = useTracker(() => Meteor.user());
  const navigate = useNavigate();

  const location = useLocation();
  const storeId = location.state?.storeId;
  const store = Stores.findOne({ _id: storeId });

  const [stampCount, setStampCount] = useState(0);
  const [couponCount, setCouponCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const calculateRemainingStamps = () => {
    const requiredStamps = couponCount * store?.maxStamp;
    return Math.max(stampCount - requiredStamps, 0); // 남는 스탬프는 0 이하로 떨어지지 않도록 처리
  };
  

  // 비회원이면 회원가입 유도
  // 고객님과 함께한 N일째
  const myFirstDay = new Date().diffInDays(new Date(user.profile.createdAt)) + 1;

  // 비회원 접근 제한
  if (user?.profile?.userGrade === "비회원") {
  return (
  <div>
    <Nav />
    <div>고객님과의 소중한 인연을 이어온지 {myFirstDay}일째..</div>
    <div>이제는 가입할 때가 되었습니다!!</div>
    <div>어서 오세요!!!</div>
    <Link to="/customers/register">
          <button>3초면 당신도 회원!</button>
    </Link>
  </div>
  );
}

  // 스탬프 개수 가져오기
  useEffect(() => {
    if (user && storeId) {
      Meteor.call("userStampCount", user._id, storeId, (err, rslt) => {
        if (err) {
          console.error("user stamp count 도중 err 발생:", err.reason);
        } else {
          setStampCount(rslt);
        }
      });
    }
  }, [user, storeId]); // 종속성 배열 추가: user 또는 storeId 변경 시 실행

  const maxCoupons = Math.floor(stampCount / store?.maxStamp);

  const incrementCouponCount = () => {
    setCouponCount((prevCount) => Math.min(prevCount + 1, maxCoupons));
  };

  const decrementCouponCount = () => {
    setCouponCount((prevCount) => Math.max(prevCount - 1, 1));
  };

  const handleInputChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), maxCoupons));
    setCouponCount(value);
  };

  const insertCoupon = () => {
    const requiredStamps = couponCount * store?.maxStamp;

    Meteor.call(
      "makeCoupon",
      user._id,
      storeId,
      requiredStamps,
      couponCount,
      (err, result) => {
        if (err) {
          console.error("쿠폰 생성 도중 에러 발생:", err.reason);
        } else {
          setModalMessage(
            `${store?.storeName}에서 쿠폰 ${couponCount}개를 생성완료했습니다.`
          );
          setIsModalOpen(true);
        }
      }
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/customers/coupons");
  };

  const pageTitle = "쿠폰 교환하기";
  document.title = `Stamping - ${pageTitle}`;
  return (
    <>
      <Header pageTitle={pageTitle}/>
      <Nav />
      <div className="makecoupon-container">


      <div className="makecoupon-header">
        <div className="title_all">{store?.storeName} - 쿠폰 교환</div>
        <div className="makecoupon-stamp-info">
          <div className="makecoupon-current-stamp">
            <span className="text_body_xl">현재 보유 스탬프{" "}</span>
            <span className="text_title_s primary">{stampCount}</span>
            <span className="text_body_xl">개</span>
          </div>
          <div className="coupon-usage-info">
            <span className="text_title_xs primary">스탬프 {store?.maxStamp}개</span>
            <span className="text_body_m">를 사용하여 </span>
            <span className="text_title_xs primary">{store?.couponInformation}</span>
            <span className="text_body_m"> 서비스 쿠폰을 발급받으실 수 있습니다.</span>
          </div>
        </div>
      </div>





      <div className="makecoupon-selection">
        <div className="placeholder-box" />
        <div className="makecoupon-quantity-selector">
          <div className="text_title_xs">교환할 쿠폰 수량 선택</div>

          <div className="product-quantity">
                <div onClick={decrementCouponCount} className="quantity-control-icon">
                  <img src="/icons/minus.svg" alt="minus" />
                </div>
                <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                      type="number"
          value={couponCount}
          onChange={handleInputChange}
          min="1"
          max={maxCoupons}
              />
            </div>
                <div onClick={incrementCouponCount} className="quantity-control-icon">
                  <img src="/icons/plus.svg" alt="plus" />
                </div>
              </div>


        </div>
        <button className="btn-primary">쿠폰으로 교환하기</button>


        <div className="remaining-stamp-info">
          <div className="text_body_l">교환 후 남는 스탬프 : {calculateRemainingStamps()}개</div>
          <div className="text_body_xs">선택한 쿠폰 수에 따라 남는 스탬프가 계산됩니다.</div>
        </div>
      </div>



      <div className="makecoupon-footer">
      <div className="text_title_xs font_black_light">추가 정보 및 유의사항</div>
          <div className="text_body_s font_black_light">
            - 발급된 쿠폰은 30일 내에 사용해야 합니다.
            <br />
            - 교환된 쿠폰은 취소 및 환불이 불가능합니다.
            <br />
            - 스탬프 부족 시 쿠폰 교환이 불가능합니다.
            <br />
            - 발급된 쿠폰은 세나카페 전 지점에서 사용 가능합니다.
            <br />
            - 스탬프는 교환 후 다시 복구되지 않습니다.
          </div>
      </div>
    </div>
    <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
    </>
  );
};
