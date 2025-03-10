import React from "react";
import { Products } from "/imports/api/collections";

const ShopOrdersDetail = ({ selectedOrder }) => {
  if (!selectedOrder) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white shadow-sm rounded-lg">
      <h2 className="text-l font-bold text-gray-900 mb-1">주문 상세</h2>
      <p className="text-sm mb-2">주문번호 : {selectedOrder.orderNumber}</p>
      <div className="space-y-6 rounded-lg overflow-hidden">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                닉네임
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                메뉴명
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                수량
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                단가
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                합계
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedOrder.orderItems?.map((item, index) => {
              const product = Products.findOne({
                _id: item.product_id,
              });
              const userNickname =
                Meteor.users.findOne({ _id: selectedOrder.user_id })?.profile.nickname ||
                "정보 없음";
              return (
                <tr key={index}>
                  <td className="px-4 py-3 text-center text-sm text-gray-800">
                    {userNickname}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-800">
                    {product?.productName || "제품 정보 없음"}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {(item.price || 0).toLocaleString()} 원
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {(item.quantity * (item.price || 0)).toLocaleString()} 원
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 총 금액 */}
        <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
          <span>총 금액</span>
          <span>{selectedOrder.totalPrice?.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default ShopOrdersDetail;
