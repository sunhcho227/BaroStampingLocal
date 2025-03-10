import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Products, Carts, Stores } from "/imports/api/collections";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";
import { HiShoppingCart } from "react-icons/hi";
import { Link } from "react-router-dom";
import Loading from "../Loading.jsx";

export default () => {
  const pageTitle = "장바구니";
  document.title = `Stamping - ${pageTitle}`;

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
        <Header pageTitle={pageTitle} />
        <Nav />
        <Loading />
      </>
    );
  }

  // 지도에 사용될 좌표 설정
  const defaultLat = 37.539449;
  const defaultLng = 127.066732;
  const mapCenter = {
    lat: store?.storeLatitude || defaultLat,
    lng: store?.storeLongitude || defaultLng,
  };

  // 지도 컴포넌트
  const KakaoMap = () => (
    <Map center={mapCenter} style={{ width: "100%", height: "100%" }} level={3}>
      <MapMarker position={mapCenter}>
        <div>{store ? store.storeName : "여기입니다!"}</div>
      </MapMarker>
    </Map>
  );

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen p-10 text-center">
          <div className="row w-full">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body cart">
                  <div className="col-sm-12 empty-cart-cls text-center flex flex-col items-center justify-center">
                    <img
                      src="/customers/empty.jpg"
                      width="400"
                      height="400"
                      className="img-fluid mb-4"
                      alt="Empty Cart"
                      style={{ maxWidth: "100%", objectFit: "contain" }}
                    />
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        장바구니가 텅 비었네요
                      </h2>
                      <p className="text-gray-600">새로운 상품을 담아보세요!</p>
                    </div>
                    <Link
                      to="/customers/order"
                      className="btn btn-primary cart-btn-transform m-3"
                      data-abc="true"
                      style={{ width: "auto", display: "inline-block" }}
                    >
                      Baro주문 하러 가기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="order-page-container-cart">
            {/* <div className="store-info-box">
              <div className="text_title_l">
                {Stores.findOne({ _id: cartInfo.store_id }).storeName}
              </div>
              <div className="text_body_m">
                전화번호: {store.storePhoneNumber}
                <br />
                주소: {store.storeAddress}
              </div>
              <div className="store-image-placeholder">
                <KakaoMap />
              </div>
            </div> */}

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
                          >
                            {quantity === 1 ? (
                              <img src="/icons/trash.svg" alt="trash" />
                            ) : (
                              <img src="/icons/minus.svg" alt="minus" />
                            )}
                          </div>
                          <div
                            className="quantity-value"
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
                        주문 하기
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
