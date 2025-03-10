import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Stores, Products, Orders } from "/imports/api/collections";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Modal from "../Modal.jsx";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import KakaoMap from "/imports/ui/KakaoMap";

export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.order_id;
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = Orders.findOne({ _id: orderId });
      setOrder(orderData);
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (!order) {
    return (
      <div>
        <Nav />
        <p>로딩 중...</p>
      </div>
    );
  }

  const store = Stores.findOne({ _id: order.store_id });
  const storeName = store?.storeName;

  const orderItems = order.orderItems.map((item) => {
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
    };
  });

  let totalSum = 0;
  for (const item of orderItems) {
    totalSum += item.quantity * item.price;
  }

  const handlePayment = () => {
    Meteor.call(
      "addPayment",
      order.user_id,
      order.store_id,
      orderId,
      orderItems,
      totalSum,
      (err, result) => {
        if (err) {
          console.error("결제 처리 중 오류 발생: ", err.reason);
          setMessage("결제 처리에 실패했습니다. 다시 시도해주세요.");
          setIsModalOpen(true);
        } else {
          setMessage(result);
          setIsModalOpen(true);
        }
      }
    );
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/customers/order");
  };

  const pageTitle = "결제하기";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="order-page-container">
        <div className="order-info-box">
          <div className="text_title_m primary">주문 상품정보</div>

          {orderItems.map((item, index) => (
            <div key={index}>
              <div className="cart-product-list">
                <div className="cart-product-item">
                  <div className="cart-product-details">
                    <div className="cart-product-count">
                      <div className="text_body_xl">
                        {Products.findOne({ _id: item.product_id }).productName}
                      </div>
                      <div className="text_title_s primary">
                        {item.quantity}개
                      </div>
                    </div>
                    <div className="text_title_s">
                      {(item.quantity * item.price).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="total-amount-container">
            <div className="total-amount">
              <div className="text_body_l">총 금액</div>
              <div className="amount-container">
                <div className="amount-value">{totalSum.toLocaleString()}</div>
                <div className="text_body_l">원</div>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={handlePayment} className="btn-secondary">
                결제 하기
              </button>
            </div>
          </div>
        </div>

        {/* 가게정보 */}
        {/* <div className="store-info-box">
          <div className="text_title_l">{storeName}</div>
          <div className="text_body_m">
            전화번호: {store.storePhoneNumber}
            <br />
            주소: {store.storeAddress}
          </div>
          <div className="store-image-placeholder">
            <KakaoMap
              center={{ lat: store?.storeLatitude, lng: store?.storeLongitude }}
              markerText={store ? store.storeName : "여기입니다!"}
            />
          </div>
        </div> */}
      </div>
      <Modal
        isOpen={isModalOpen}
        message={message}
        onClose={handleModalClose}
      />
    </>
  );
};
