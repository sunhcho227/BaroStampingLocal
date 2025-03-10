// Product.jsx
import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Admins, Stores, Products } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import { Link } from "react-router-dom";
import Nav from "./Nav.jsx";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";

export default () => {
  const { user, admin, store, products } = useTracker(() => {
    const user = Meteor.user();
    const admin = user && Admins.findOne({ user_id: user._id });
    const store = admin && Stores.findOne({ _id: admin.store_id });
    const products = Products.find({ store_id: admin.store_id }).fetch();
    return { user, admin, store, products };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const productNameRef = useRef(null);
  const productPriceRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  const handleProductAdd = (e) => {
    e.preventDefault();

    const productName = productNameRef.current.value;
    const productPrice = Number(productPriceRef.current.value);

    Meteor.call(
      "addProducts",
      admin.store_id,
      productName,
      productPrice,
      (err) => {
        if (err) {
          setMessage("새 상품 삽입 도중 에러 발생: ", err.reason);
        } else {
          setMessage("상품이 성공적으로 추가되었습니다!");
          productNameRef.current.value = "";
          productPriceRef.current.value = "";
        }
        setIsModalOpen(true);
      }
    );
  };

  const handleProductRemove = (product_id) => {
    Meteor.call("removeProducts", product_id, (err) => {
      if (err) {
        setMessage("상품을 지우는 도중 에러 발생: ", err.reason);
      } else {
        setMessage("상품이 성공적으로 삭제되었습니다!");
      }
      setIsModalOpen(true);
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Nav />

      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:min-h-screen">
          {/* 마이샵사이드바 */}
          {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}

          {/* 페이지 본문 */}
          <div className="flex-1 p-6 bg-gray-100">
            {/* 헤드섹션 */}
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              상품 관리
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              매장에서 판매할 상품을 추가, 수정, 삭제할 수 있습니다.
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold mb-6 text-gray-700">
                상품 관리
              </h1>

              {/* 상품 추가 폼 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                  상품 추가하기
                </h2>
                <form onSubmit={handleProductAdd} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      ref={productNameRef}
                      placeholder="상품명을 입력하세요"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      ref={productPriceRef}
                      placeholder="상품가격을 숫자로 입력하세요"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                  >
                    추가하기
                  </button>
                </form>
              </div>

              <hr className="my-6" />

              {/* 상품 목록 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                  우리 가게 상품 목록
                </h2>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="p-4 border rounded-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0"
                    >
                      <div>
                        <p className="font-medium text-gray-700">
                          상품명: {product.productName}
                        </p>
                        <p className="text-gray-600">
                          상품가격: ₩{product.productPrice.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to="/admins/myshop/productEdit"
                          state={{ product_id: product._id }}
                          className="w-20 text-center h-auto px-4 py-2 bg-[#00838C] text-white rounded-md hover:bg-[#006d75] focus:outline-none focus:ring-2 focus:ring-[#00838C] transition-colors"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleProductRemove(product._id)}
                          className="w-20 text-center h-auto px-4 py-2 bg-[#FF496D] text-white rounded-md hover:bg-[#e43b5c] focus:outline-none focus:ring-2 focus:ring-[#FF496D] transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 모달 */}
              <Modal
                isOpen={isModalOpen}
                message={message}
                onClose={handleModalClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
