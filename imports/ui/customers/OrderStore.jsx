import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Stores, Products, Orders } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import { Random } from "meteor/random";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import KakaoMap from "/imports/ui/KakaoMap";

export default () => {
  const { storeUrlName } = useParams();
  const navigate = useNavigate();
  const store = useTracker(() => {
    return Stores.findOne({ storeUrlName });
  });

  const [quantities, setQuantities] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const user = Meteor.user();

  useEffect(() => {
    let currentUsername = Meteor.user()?.username;
    if (!currentUsername) {
      currentUsername = "Guest_" + Random.id();

      setUsername(currentUsername);

      Meteor.call("addUserforCart", currentUsername, (error, result) => {
        if (error) {
          console.error("최초 접근 유저 주문시 계정 생성 오류:", error);
        } else {
          console.log("최초 접근 유저 주문시 계정 생성 잘 됨");

          if (!Meteor.user()) {
            Meteor.loginWithPassword(currentUsername, "1234", (err) => {
              if (err) {
                console.error("자동 로그인 실패:", err);
              } else {
                console.log("로그인 성공");
              }
            });
          }
        }
      });
    }
  }, []);

  const handleIncrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) - 1, 1),
    }));
  };

  const handleInputChange = (productId, value) => {
    const numericValue = Math.max(Number(value), 1);
    setQuantities((prev) => ({
      ...prev,
      [productId]: numericValue,
    }));
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCartAdd = () => {
    if (selectedProducts.length === 0) {
      setMessage("상품을 선택해 주세요");
      setIsModalOpen(true);
      return;
    } else {
      const selectedArr = selectedProducts.map((productId) => {
        const product = Products.findOne({ _id: productId });
        return {
          product_id: productId,
          quantity: quantities[productId] || 1,
          price: product?.productPrice || 0,
        };
      });

      Meteor.call(
        "addCarts",
        user._id,
        store._id,
        selectedArr,
        (err, result) => {
          if (err) {
            console.error("장바구니에 담는 중 에러 발생: ", err.reason);
          } else {
            if (result !== undefined) {
              setMessage(result);
              setIsModalOpen(true);
            } else {
              navigate("/customers/cart");
            }
          }
        }
      );
    }
  };

  if (!store) {
    return <p className="text_body_l">매장을 찾을 수 없습니다.</p>;
  }

  let totalSum = 0;
  selectedProducts.forEach((productId) => {
    const product = Products.findOne({ _id: productId });
    if (product) {
      totalSum += (quantities[productId] || 1) * product.productPrice;
    }
  });

  const handlePayment = () => {
    const orderId = Random.id();
    const payItems = selectedProducts.map((productId) => {
      const product = Products.findOne({ _id: productId });
      return {
        product_id: productId,
        quantity: quantities[productId] || 1,
        price: product?.productPrice || 0,
      };
    });

    Meteor.call(
      "addPayment",
      user._id,
      store._id,
      orderId,
      payItems,
      totalSum,
      (error, result) => {
        if (error) {
          console.error("결제 처리 중 오류 발생: ", error.reason);
          setMessage("결제 처리에 실패했습니다. 다시 시도해주세요.");
          setIsModalOpen(true);
        } else {
          setMessage(result);
          setIsModalOpen(true);
          navigate("/customers/order");
        }
      }
    );
  };

  const handleModalClose = () => {
    if (selectedProducts.length === 0) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(false);
      navigate("/customers/cart");
    }
  };

  const pageTitle = "상품 담기";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="order-page-container-sc">
        <div className="store-info-box">
          <div className="text_title_l">{store.storeName}</div>
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
        </div>

        <div className="order-info-box">
          <div className="text_title_m primary">주문 하기</div>
          {Products.find({ store_id: store._id })
            .fetch()
            .map((product) => {
              const quantity = quantities[product._id] || 1;
              const isSelected = selectedProducts.includes(product._id);
              return (
                <div key={product._id} className="product-item">
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(product._id)}
                        className="h-5 w-5 mr-1 rounded-md text-[#00A9B5] focus:ring-2 focus:ring-[#00A9B5]"
                      />
                      {/* <span className="product-checkbox"></span> */}
                    </label>
                  </div>
                  <div className="product-details">
                    <div className="product-info">
                      <div className="text_body_l">{product.productName}</div>
                      <div className="text_body_l">
                        {product.productPrice.toLocaleString()}원
                      </div>
                    </div>
                    <div className="product-quantity">
                      <div
                        className="quantity-control-icon"
                        onClick={() => handleDecrement(product._id)}
                      >
                        <img src="/icons/minus.svg" alt="minus" />
                      </div>
                      <div className="quantity-value">{quantity}</div>
                      <div
                        className="quantity-control-icon"
                        onClick={() => handleIncrement(product._id)}
                      >
                        <img src="/icons/plus.svg" alt="plus" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="total-amount-container">
            <div className="total-amount">
              <div className="text_body_l">총 금액</div>
              <div className="amount-container">
                <div className="amount-value">{totalSum.toLocaleString()}</div>
                <div className="text_body_l">원</div>
              </div>
            </div>

            <div className="action-buttons">
              {selectedProducts.length === 0 ? (
                <button
                  className="btn-secondary"
                  onClick={handleCartAdd}
                  disabled={true}
                >
                  상품을 선택해주세요
                </button>
              ) : (
                <button className="btn-secondary" onClick={handleCartAdd}>
                  장바구니 담기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        message={message}
        onClose={handleModalClose}
      />
    </>
  );
};
