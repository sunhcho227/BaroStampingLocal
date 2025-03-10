import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Admins, Stores, Products } from "/imports/api/collections";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav.jsx";
import Modal from "../Modal.jsx";

export default () => {
  const user = Meteor.user();
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [navigateToQR, setNavigateToQR] = useState(false);
  const [savedQuantity, setSavedQuantity] = useState(0);
  const [paymentId, setPaymentId] = useState(null);

  const admin = Admins.findOne({ user_id: user._id });
  const store = Stores.findOne({ _id: admin?.store_id });
  const products = Products.find({ store_id: store?._id }).fetch();

  useTracker(() => {
    Admins.find().fetch();
    Stores.find().fetch();
    Products.find().fetch();
  });

  const addProductToOrder = (product) => {
    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product_id === product._id
      );

      if (existingItem) {
        // 이미 존재하는 상품이라면 수량 +1
        return prevItems.map((item) =>
          item.product_id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 새로운 상품이라면 초기 수량 1로 추가
      return [
        ...prevItems,
        {
          product_id: product._id,
          quantity: 1,
          price: product.productPrice,
        },
      ];
    });
  };

  const updateQuantity = (productId, delta) => {
    setOrderItems((prevItems) =>
      prevItems
        .map((item) =>
          item.product_id === productId
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromOrder = (productId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const totalSum = orderItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.price),
    0
  );

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleOrderSubmit = () => {
    setSavedQuantity(totalQuantity);
    Meteor.call(
      "orderPOS",
      user._id,
      store._id,
      orderItems,
      totalSum,
      (err, orderId) => {
        if (err) {
          console.error("주문 처리 중 오류 발생: ", err.reason);
          setMessage("주문에 실패했습니다. 다시 시도해주세요.");
          setIsModalOpen(true);
          setNavigateToQR(false);
        } else {
          Meteor.call(
            "paymentPOS",
            user._id,
            store._id,
            orderId,
            orderItems,
            totalSum,
            (payErr, payResult) => {
              if (payErr) {
                console.error("결제 처리 중 오류 발생: ", payErr.reason);
                setMessage("결제에 실패했습니다. 다시 시도해주세요.");
                setIsModalOpen(true);
                setNavigateToQR(false);
              } else {
                console.log("결제 성공:", payResult);
                setPaymentId(payResult);
                localStorage.setItem(
                  "paymentData",
                  JSON.stringify({
                    payment_id: payResult,
                    stamp_count: totalQuantity,
                  })
                );
                setMessage("주문과 결제가 성공적으로 완료되었습니다!");
                setIsModalOpen(true);
                setOrderItems([]);
                setNavigateToQR(true);
              }
            }
          );
        }
      }
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (navigateToQR) {
      navigate("/admins");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-[#414B55]">
        <Nav />

        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl flex-col md:flex-row font-bold text-white bg-[#414B55] px-8 py-4 w-full">
            BARO POS 시스템
            <button
              className="px-2 ml-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#00838C] hover:bg-[#006d75]"
              onClick={() => window.open("/admins/POSAddStamp", "_blank")}
            >
              고객제공용 QR화면
            </button>
          </h1>
          <p className="text-sm text-white bg-[#414B55] px-8 pb-4 w-full">
            상품을 선택해 주문을 생성하고, 결제까지 한 번에 처리할 수 있습니다.
            스탬프와 쿠폰 발급을 QR 코드로 연동해 고객 리워드를 간편하게
            관리하세요.
          </p>

          <div className="flex flex-col md:flex-row">
            {/* 주문 목록 */}
            <div className="w-full md:w-2/5 bg-white p-6 border border-[#D2D5DA]">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                주문 목록
              </h2>
              <hr className="my-3 border-t-2 border-gray-400" />
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="p-3 flex flex-col md:flex-row justify-between items-center bg-gray-50 gap-1"
                    >
                      {/* 수량컨트롤 */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, -1)}
                          className="w-5 h-5 md: w-6 h-6 md: h-4 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="text-gray-800 font-medium">
                          {item.quantity}개
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, 1)}
                          className="w-5 h-5 md: w-6 h-6 md: h-4 border-2 border-[#00838C] text-[#00838C] rounded-full bg-white hover:bg-[#00838C] hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      {/* 상품명 */}
                      <div className="text-lg font-medium text-gray-800">
                        {Products.findOne({ _id: item.product_id }).productName}
                      </div>

                      {/* 가격 */}
                      <div className="flex items-center gap-1">
                        <div className="text-gray-800 font-semibold text-right">
                          {Number(item.quantity * item.price).toLocaleString()}
                          원
                        </div>
                        <button
                          onClick={() => removeFromOrder(item.product_id)}
                          className="w-5 h-5 border-2 border-red-500 text-red-500 rounded-lg bg-white hover:bg-red-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
                        >
                          <i className="fas fa-times text-sm"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4">
                  <button
                    onClick={handleOrderSubmit}
                    className="w-full bg-[#00A9B5] text-white py-4 px-4 rounded-lg hover:bg-[#00838C] transition-colors duration-200 flex flex-col items-center gap-2"
                  >
                    <div className="text-lg font-medium">
                      총 금액: {totalSum.toLocaleString()}원
                    </div>
                    <div className="text-sm opacity-90">
                      총 갯수: {totalQuantity}개
                    </div>
                    <div className="mt-2 text-sm font-medium">주문 접수</div>
                  </button>
                </div>
              </div>
            </div>

            {/* 상품 목록 */}
            <div className="w-full md:w-3/5 bg-[#D2D5DA] p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                상품 목록
              </h2>
              <hr className="my-3 border-t-2 border-gray-400" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addProductToOrder(product)}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="text-lg font-medium text-gray-800 truncate w-full text-center">
                      {product.productName}
                    </div>
                    <div className="text-gray-600 mt-1">
                      {Number(product.productPrice).toLocaleString()}원
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} message={message} onClose={closeModal} />
      </div>
    </>
  );
};
