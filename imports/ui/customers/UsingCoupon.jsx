import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Coupons, Stores } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import { QRCodeCanvas } from "qrcode.react";
import "/imports/ui/lib/utils.js";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Modal from "../Modal.jsx";
import Header from "./Header.jsx";
import KakaoMap from "/imports/ui/KakaoMap";
import "../styles/user_main.css";
import "../styles/user_layout.css";

export default () => {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const coupon = Coupons.findOne({ _id: couponId });
  const store = Stores.findOne({ _id: coupon.store_id });
  const [showModal, setShowModal] = useState(false);

  // 쿠폰 타입에 따라 한글로 변환
  const couponTypeLabel =
    coupon?.couponType === "통상" ? "스탬프 적립 보상 쿠폰" : "서비스 쿠폰";

  // useTracker 선언
  useTracker(() => {
    Stores.find().fetch();
    Coupons.find().fetch();
  });

  // 쿠폰 유효기간
  const expirationDate = new Date(coupon.createdAt).addDays(30);

  // couponUsage가 true로 변경되면 모달 표시
  useEffect(() => {
    if (coupon && coupon.couponUsage) {
      setShowModal(true);
    }
  }, [coupon]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/customers");
  };

  // qr 정보
  const qrData = JSON.stringify({ type: "useCoupon", coupon_id: coupon?._id });
  const qrSize = 160;

  const pageTitle = "쿠폰 사용하기";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="usingcoupon-page-container">
        {/* Header Section */}
        <div className="coupon-header">
          <div className="coupon-card">
            <div className="coupon-qr-img">
              <QRCodeCanvas value={qrData} size={qrSize} />
            </div>
            <div className="text_body_l font_black_light">
              카운터에 이 화면을 제시해주세요
            </div>
            <div className="coupon-details">
              <div className="coupon-detail-item">
                <div className="text_title_xs">상품명</div>
                <div className="text_body_l">{store.couponInformation}</div>
              </div>
              <div className="coupon-detail-item">
                <div className="text_title_xs">쿠폰종류</div>
                <div className="text_body_l"> {couponTypeLabel}</div>
              </div>
              <div className="coupon-detail-item">
                <div className="text_title_xs">사용처</div>
                <div className="text_body_l">{store.storeName}</div>
              </div>
              <div className="coupon-detail-item">
                <div className="text_title_xs">유효기간</div>
                <div className="text_body_l">
                  ~ {expirationDate.toLocaleDateString().slice(0, -1)}
                </div>
              </div>
              <div className="coupon-detail-item">
                <div className="text_title_xs">쿠폰번호</div>
                <div className="text_body_l">
                  {Coupons.findOne({ _id: couponId })._id}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 사용방법 */}
        <div className="coupon-usage">
          <div className="text_title_s">사용 방법</div>
          <div className="text_body_xl">
            매장에서 상품으로 교환할 수 있습니다.
          </div>
          <div className="coupon-qr">
            <div className="coupon-qr-icon">
              <img src="/icons/myqr_white.svg" alt="QR" />
            </div>
            <div className="text_body_l primary">
              선물함의 QR을 제시해 사용할 수 있어요.
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="coupon-store-info usingcoupon">
          <div className="text_title_m">{store.storeName}</div>
          <div className="text_body_m">
            전화번호 : {store.storePhoneNumber}
            <br />
            주소 : {store.storeAddress}
          </div>
          <div className="coupon-store-map-placeholder">
            <KakaoMap
              center={{ lat: store?.storeLatitude, lng: store?.storeLongitude }}
              markerText={store ? store.storeName : "여기입니다!"}
            />
          </div>
        </div>

        {/* 사용시 주의사항 */}
        <div className="coupon-conditions">
          <div className="text_title_s">사용시 주의사항</div>
          <div className="coupon-condition">
            <div className="text_title_xs">쿠폰 사용 제한</div>
            <div className="text_body_xs">
              각 쿠폰은 특정 가게 또는 제품에만 유효하며, 다른 가게나 상품에
              적용되지 않습니다. 쿠폰 사용 시 반드시 사용 조건을 확인하시고,
              조건에 맞는 가게나 상품에서 사용해 주시기 바랍니다.
            </div>
          </div>
          <div className="coupon-condition">
            <div className="text_title_xs">중복 사용 금지</div>
            <div className="text_body_xs">
              하나의 거래에 대해 동일한 쿠폰을 중복 사용할 수 없습니다. 또한,
              다른 쿠폰과의 결합 사용이 제한될 수 있으므로 쿠폰 사용 전에 해당
              사항을 확인해 주시기 바랍니다.
            </div>
          </div>
          <div className="coupon-condition">
            <div className="text_title_xs">불법 거래 금지</div>
            <div className="text_body_xs">
              쿠폰은 특정 기간 동안 사용 가능하며, 사용 가능한 가게와 상품에
              대한 제약이 있을 수 있습니다. 각 쿠폰에 명시된 사용 조건을 반드시
              확인 후 사용해 주세요. 조건에 맞지 않는 상품에 대해 쿠폰을
              사용하려 할 경우, 쿠폰이 적용되지 않거나 취소될 수 있습니다.
            </div>
          </div>
        </div>
        <div className="coupon-conditions">
          <div className="text_title_s">거래 조건에 관한 정보</div>
          <div className="coupon-condition">
            <div className="text_title_xs">쿠폰의 사용 조건</div>
            <div className="text_body_xs">
              쿠폰은 특정 기간 동안 사용 가능하며, 사용 가능한 가게와 상품에
              대한 제약이 있을 수 있습니다. 각 쿠폰에 명시된 사용 조건을 반드시
              확인 후 사용해 주세요. 조건에 맞지 않는 상품에 대해 쿠폰을
              사용하려 할 경우, 쿠폰이 적용되지 않거나 취소될 수 있습니다.
            </div>
          </div>
          <div className="coupon-condition">
            <div className="text_title_xs">환불 및 교환</div>
            <div className="text_body_xs">
              쿠폰으로 구매한 상품의 교환 및 환불은 구매한 가게의 정책에
              따릅니다. 가게의 교환/환불 정책을 먼저 확인하시고, 정책에 맞는
              방식으로 진행해 주세요. 쿠폰 사용 시에는 쿠폰 금액을 제외한 차액만
              환불될 수 있습니다.
            </div>
          </div>
          <div className="coupon-condition">
            <div className="text_title_xs">상품 품질 보증</div>
            <div className="text_body_xs">
              쿠폰을 사용하여 구매한 상품에 대한 품질 보증은 구매한 가게에서
              책임지며, 상품에 대한 하자나 문제 발생 시, 가게의 A/S 정책을
              따릅니다. 쿠폰 자체에 대한 품질 보증은 제공되지 않으며, 쿠폰에
              대한 모든 책임은 가게에서 지지 않습니다.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
