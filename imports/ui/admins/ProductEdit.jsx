import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Products } from "/imports/api/collections";
import Nav from "./Nav.jsx";
import MyShopSidebar from "./MyShopSidebar.jsx";
import { useMediaQuery } from "react-responsive"; // 반응형 조건을 위한 훅
import MyShopSidebarRow from "./MyShopSidebarRow.jsx";

const ProductEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.product_id;
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    if (productId) {
      const product = Products.findOne({ _id: productId });
      if (product) {
        setProductName(product.productName || "");
        setProductPrice(product.productPrice || "");
      }
    }
  }, []);

  const handleProductChange = (e) => {
    e.preventDefault();

    Meteor.call(
      "updateProducts",
      productId,
      productName,
      Number(productPrice),
      (err, result) => {
        if (err) {
          console.error("상품 수정 중 오류: ", err.reason);
        } else {
          console.log("상품 수정 성공:", result);
          navigate("/admins/product");
        }
      }
    );
  };

  const isMobile = useMediaQuery({ maxWidth: 640 }); // 640px 이하일 때 모바일로 간주

  return (

<>
 <Nav />

 <div className="w-full mx-auto">
 <div className="flex flex-col sm:flex-row sm:min-h-screen">
 {/* 마이샵사이드바 */}
 {isMobile ? <MyShopSidebarRow /> : <MyShopSidebar />}


   {/* 페이지 본문 */}
   <div className="flex-1 p-6 bg-gray-100">
   <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              상품 수정
            </h1>
            <p className="mt-2 text-sm text-gray-500 mb-6">
              가게에 등록된 상품의 상품명과 상품가격을 수정할 수 있습니다. 
            </p>

  <form onSubmit={handleProductChange} className="space-y-4">
    {/* 상품명 입력 필드 */}
    <div>
      <label
        htmlFor="productName"
        className="block text-gray-600 font-medium mb-2"
      >
        상품명
      </label>
      <input
        id="productName"
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        placeholder="상품명을 입력하세요"
      />
    </div>

    {/* 상품가격 입력 필드 */}
    <div>
      <div
        htmlFor="productPrice"
        className="block text-gray-600 font-medium mb-2"
      >
        상품가격
      </div>
      <input
        id="productPrice"
        type="number"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        placeholder="상품가격을 숫자로 입력하세요"
      />
    </div>

    {/* 수정하기 버튼 */}
    <button
      type="submit"
      className="w-full h-12 bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
    >
      수정하기
    </button>
  </form>
</div>
</div>

 </div>



</>
  );
};

export default ProductEdit;
