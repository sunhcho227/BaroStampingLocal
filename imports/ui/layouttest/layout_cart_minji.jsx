import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Products, Carts, Stores } from "/imports/api/collections";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const store = Stores.findOne({ storeUrlName: "senaCafe" });
  const cartInfo = Carts.findOne({ user_id: user?._id });

  useEffect(() => {
    if (user?._id) {
      fetchCartData();
    }
  }, [user?._id]);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartData, quantities]);

  const fetchCartData = () => {
    setIsLoading(true);
    Meteor.call("getCarts", user._id, (err, result) => {
      if (err) {
        console.error("장바구니 데이터를 가져오는 중 오류 발생: ", err.reason);
      } else {
        setCartData(result);
        const initialQuantities = {};
        result.forEach((item) => {
          initialQuantities[item.product_id] = item.totalQuantity;
        });
        setQuantities(initialQuantities);
      }
      setIsLoading(false);
    });
  };

  const handleIncrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    const currentQuantity = quantities[productId] || 1;

    if (currentQuantity === 1) {
      handleDeleteItem(productId);
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: currentQuantity - 1,
      }));
    }
  };

  const handleDeleteItem = (productId) => {
    Meteor.call("deleteCartItem", user._id, productId, (err, result) => {
      if (err) {
        console.error("장바구니 상품 삭제 중 오류 발생: ", err.reason);
      } else {
        console.log("장바구니 상품 삭제 : ", result);
        fetchCartData();
      }
    });
  };

  const calculateTotalPrice = () => {
    let total = 0;
    cartData.forEach((item) => {
      const quantity = quantities[item.product_id] || 1;
      total += item.price * quantity;
    });
    setTotalPrice(total);
  };

  const handleAddOrder = () => {
    const orderItems = cartData.map((item) => ({
      product_id: item.product_id,
      quantity: quantities[item.product_id] || 1,
      price: item.price,
    }));

    Meteor.call(
      "addOrder",
      user._id,
      cartInfo.store_id,
      orderItems,
      totalPrice,
      (err, result) => {
        if (err) {
          console.error("주문을 하는 도중 에러 발생: ", err.reason);
        } else {
          console.log("주문 성공: ", result);
          navigate("/customers/payment", { state: { order_id: result } });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <p>장바구니를 불러오는 중...</p>
      </>
    );
  }

  return (
    <>
      <Nav />
      <Header />
      {cartData.length === 0 ? (
        <p>장바구니가 텅 비었네요, 상품을 담아보세요</p>
      ) : (
        <div>
          <div className="order-page-container">
            <div className="store-info-box">
              <div className="text_title_l">
                {Stores.findOne({ _id: cartInfo.store_id }).storeName}
              </div>
              <div className="text_body_m">
                전화번호: {store.storePhoneNumber}
                <br />
                주소: {store.storeAddress}
              </div>
              <div className="store-image-placeholder"></div>
            </div>

            <div className="order-info-box">
              <div className="text_title_m primary">주문 상품정보</div>

              <div className="cart-product-list">
                {cartData.map((item) => {
                  const quantity = quantities[item.product_id] || 1;

                  return (
                    <div key={item.product_id} className="cart-product-item">
                      <div className="cart-product-details">
                        <div className="cart-product-info">
                          <div className="text_body_l">
                            {Products.findOne({ _id: item.product_id })
                              .productName || "알 수 없음"}
                          </div>
                          <div className="text_body_l">
                            {item.price.toLocaleString()}원
                          </div>
                        </div>
                        <div className="product-quantity">
                          <div
                            className="quantity-control-icon"
                            onClick={() => handleDecrement(item.product_id)}
                            // style={{
                            //   backgroundColor: quantity === 1 ? "red" : "",
                            //   color: quantity === 1 ? "white" : "",
                            //   border: quantity === 1 ? "none" : "",
                            //   borderRadius: "5px",
                            //   padding: "5px 10px",
                            //   cursor: "pointer",
                            // }}
                          >
                            <img src="/icons/minus.svg" alt="minus" />
                          </div>
                          <div
                            className="quantity-value"
                            // type="number"
                            // value={quantity}
                            // min="1"
                            onChange={(e) =>
                              setQuantities((prev) => ({
                                ...prev,
                                [item.product_id]: Math.max(
                                  Number(e.target.value),
                                  1
                                ),
                              }))
                            }
                          >
                            {quantity}
                          </div>
                          <div
                            className="quantity-control-icon"
                            onClick={() => handleIncrement(item.product_id)}
                          >
                            <img src="/icons/plus.svg" alt="plus" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-product-list">
                {cartData.map((item) => {
                  const quantity = quantities[item.product_id] || 1;
                  return (
                    <div key={item.product_id} className="cart-product-item">
                      <div className="cart-product-details">
                        <div className="cart-product-info">
                          <div className="text_body_l">
                            {Products.findOne({ _id: item.product_id })
                              .productName || "알 수 없음"}
                          </div>
                          <div className="text_body_l">
                            {item.price.toLocaleString()}원
                          </div>
                        </div>
                        <div className="product-quantity">
                          <div className="quantity-control-icon">
                            <img src="/icons/minus.svg" alt="minus" />
                          </div>
                          <div className="quantity-value">{quantity}</div>
                          <div className="quantity-control-icon">
                            <img src="/icons/plus.svg" alt="plus" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cartData.length > 0 && (
                <>
                  <div className="total-amount-container">
                    <div className="total-amount">
                      <div className="text_body_l">총 금액</div>
                      <div className="amount-container">
                        <div className="amount-value">
                          {totalPrice.toLocaleString()}
                        </div>
                        <div className="text_body_l">원</div>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button
                        className="btn-secondary"
                        onClick={handleAddOrder}
                      >
                        결제 하기
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      ;
    </>
  );
};
