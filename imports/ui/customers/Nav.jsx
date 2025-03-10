import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import {
  Stores,
  Coupons,
  Stamps,
  UserNotifications,
} from "/imports/api/collections";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Modal";
import "../styles_components/user_nav.css";

export default () => {
  const user = useTracker(() => Meteor.user(), []);
  const notifications = useTracker(() => {
    if (user) {
      return UserNotifications.find({
        user_id: user._id,
        isRead: false,
      }).fetch();
    }
    return [];
  }, [user]);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [notificationId, setNotificationId] = useState(null);
  const navigate = useNavigate();

  // 알림 처리
  useEffect(() => {
    if (notifications.length > 0 && !notificationId) {
      const notification = notifications[0];
      setNotificationId(notification._id);

      const handleServiceCoupon = () => {
        const coupon = Coupons.findOne({ _id: notification.typeId?.[0] });
        const store = Stores.findOne({ _id: coupon?.store_id });
        const expirationDate = new Date(coupon?.createdAt).addDays(30);
        setModalMessage(
          <div>
            <div className="modal-message-all">
              <div className="modal-title">
                <div className="text_body_xl primary">
                  🎉{store?.storeName || "알 수 없음"}에서🎉
                </div>
                <div className="text_title_s primary">
                  {store?.couponInformation || "알 수 없음"}서비스 쿠폰을{" "}
                  {notification.typeId?.length || 0}개 발급해 드렸습니다!
                </div>
              </div>

              <div className="text_body_m">
                {coupon?.couponMemo || "메모 없음"} <br />
                유효기간 : {expirationDate.toLocaleDateString()}
              </div>
              <div className="modal-date-number">
                <div className="text_body_xl primary">
                  지금 쿠폰함에서 확인해보세요!
                </div>
              </div>
            </div>
          </div>
        );
      };

      const handleCouponUsage = () => {
        const coupon = Coupons.findOne({ _id: notification.typeId?.[0] });
        const store = Stores.findOne({ _id: coupon?.store_id });
        setModalMessage(
          <div className="modal-message-all">
            <div className="text_title_l primary">쿠폰 사용알림</div>
            <div className="text_body_m">
              {store?.storeName || "알 수 없음"}에서{" "}
              {store?.couponInformation || "알 수 없음"} 서비스 쿠폰이 사용처리
              되었습니다
            </div>
            <div className="modal-date-number">
              <div className="text_body_l">
                쿠폰번호 : {coupon?._id || "알 수 없음"}
              </div>
              <div className="text_body_l">
                사용날짜 :{" "}
                {notification?.createdAt.toLocaleString() || "알 수 없음"}
              </div>
            </div>
          </div>
        );
      };

      const handleStampIssuance = () => {
        const stamp = Stamps.findOne({ _id: notification.typeId?.[0] });
        const store = Stores.findOne({ _id: stamp?.store_id });
        setModalMessage(
          <div>
            <div className="modal-message-all">
              <div className="text_title_l primary">스탬프 발급 알림</div>
              <div className="text_body_m">
                {store?.storeName || "알 수 없음"}에서{" "}
                {notification.typeId?.length || 0}개의 스탬프가 발급되었습니다.
              </div>
              <div className="modal-date-number">
                <div className="text_body_l">
                  발급날짜 :{" "}
                  {notification?.createdAt.toLocaleString() || "알 수 없음"}
                </div>
              </div>
            </div>
          </div>
        );
      };

      if (notification?.notificationType === "service coupon 발급") {
        handleServiceCoupon();
      } else if (notification.notificationType === "coupon 사용") {
        handleCouponUsage();
      } else if (notification.notificationType === "stamp 발급") {
        handleStampIssuance();
      }

      setShowModal(true);
    }
  }, [notifications, notificationId]);

  // 모달 닫기 및 알림 읽음 처리
  const handleModalClose = () => {
    if (notificationId) {
      Meteor.call("userNotifications.markAsRead", notificationId, (error) => {
        if (error) {
          console.error("알림 읽음 처리 실패:", error);
        } else {
          const notification = UserNotifications.findOne(notificationId);
          setNotificationId(null);
          setShowModal(false);
          setModalMessage("");

          if (notification?.notificationType === "coupon 사용") {
            navigate("/customers");
          }
        }
      });
    }
  };

  return (
    <div className="user-nav-container">
      <Link to="/customers">
        <div className="user-navi-item">
          <div className="nav-icon">
            <img src="/icons/home.svg" alt="홈" />
          </div>
          <div className="nav-label">홈</div>
        </div>
      </Link>
      <Link to="/customers/order">
        <div className="user-navi-item">
          <div className="nav-icon">
            <img src="/icons/store.svg" alt="주문하기" />
          </div>
          <div className="nav-label">Baro주문</div>
        </div>
      </Link>
      <Link to="/customers/mycouponstamp">
        <div className="user-navi-item">
          <div className="nav-icon">
            <img src="/icons/coupon.svg" alt="쿠폰/스탬프" />
          </div>
          <div className="nav-label">쿠폰/스탬프</div>
        </div>
      </Link>
      <Link to="/customers/mypage">
        <div className="user-navi-item">
          <div className="nav-icon">
            <img src="/icons/user.svg" alt="마이페이지" />
          </div>
          <div className="nav-label">마이페이지</div>
        </div>
      </Link>
      <Modal
        isOpen={showModal}
        message={modalMessage}
        onClose={handleModalClose}
      />
    </div>
  );
};
