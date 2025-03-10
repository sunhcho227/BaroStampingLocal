import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import {
  Admins,
  Stores,
  Payments,
  Orders,
  Products,
} from "/imports/api/collections";
import Nav from "./Nav.jsx";
import Loading from "../Loading.jsx";

export default () => {
  const user = Meteor.user();
  const [isLoading, setIsLoading] = useState(false);
  const storeId = Stores.findOne({
    _id: Admins.findOne({ user_id: user._id }).store_id,
  })._id;

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const payments = useTracker(() => {
    setIsLoading(true);
    const skip = (currentPage - 1) * ordersPerPage;
    return Payments.find(
      { store_id: storeId },
      { skip, limit: ordersPerPage, sort: { paymentDate: -1 } }
    ).fetch();
  }, [storeId, currentPage]);

  useEffect(() => {
    if (payments) {
      setIsLoading(false);
    }
  }, [payments]);

  const totalPayments = useTracker(() => {
    return Payments.find({ store_id: storeId }).count();
  }, [storeId]);

  const totalPages = Math.ceil(totalPayments / ordersPerPage);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelectOrder = (paymentId, orderNumber) => {
    if (selectedOrder?.orderNumber === orderNumber) {
      setSelectedOrder(null);
      return;
    }

    const order = Orders.findOne({
      _id: Payments.findOne({ _id: paymentId })?.order_id,
    });

    if (order) {
      setSelectedOrder({
        ...order,
        orderNumber,
      });
    } else {
      console.error("주문을 찾을 수 없습니다. 주문 ID:", paymentId);
    }
  };

  const handleMarkCompleted = (paymentId) => {
    Meteor.call("orders.markCompleted", paymentId, (error, result) => {
      if (error) {
        console.error("Error marking as completed:", error);
      } else {
        console.log("Order marked as completed");
      }
    });
  };

  const handleCancelPayment = (paymentId) => {
    Meteor.call("payments.cancelPayment", paymentId, (error, result) => {
      if (error) {
        console.error("Error canceling order:", error);
      } else {
        console.log("Payment canceled");
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          주문 목록 및 상세 관리
        </h1>
        <p className="mt-2 text-sm text-gray-500 mb-6">
          가게의 주문 내역을 확인하고, 결제 상태를 관리할 수 있습니다. 주문을
          선택하면 상세 정보를 볼 수 있으며, 결제 완료 처리 및 결제 취소도
          가능합니다.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {payments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">주문 내역이 없습니다.</p>
            </div>
          ) : (

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            {/* 데스크탑 버전: 테이블 형식 */}
            <table className="hidden md:table min-w-full divide-y divide-gray-300 mx-auto">
              <thead className="bg-[#414B55] text-white">
                <tr>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">주문 번호</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">주문 방식</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">주문 일자</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">닉네임</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">아이디</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">주문금액</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">주문상태</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold">결제 상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {payments.map((payment, index) => {
                  const order = Orders.findOne({ _id: payment.order_id });
                  const userNickname = Meteor.users.findOne({ _id: payment.user_id })?.profile.nickname || "정보 없음";
                  const username = Meteor.users.findOne({ _id: payment.user_id })?.username || "정보 없음";
          
                  return (
                    <React.Fragment key={payment._id}>
                      <tr onClick={() => handleSelectOrder(payment._id, index + 1)} className="hover:bg-gray-50 cursor-pointer">
                        <td className="px-3 py-4 text-center text-sm text-gray-900">{index + 1}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-900">{order ? order.orderType : "현장주문"}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-500">{new Date(payment.paymentDate).toLocaleString()}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-500">{userNickname}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-500">{username}</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-900">{payment.totalSum?.toLocaleString()}원</td>
                        <td className="px-3 py-4 text-center text-sm text-gray-900">
                          {payment.status === "대기" ? (
                            <button
                              onClick={() => handleMarkCompleted(payment._id)}
                              className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            >
                              대기 (클릭 시 완료)
                            </button>
                          ) : (
                            <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${payment.status === "완료" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {payment.status}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center text-sm space-x-2">
                          {payment.status !== "취소" ? (
                            <button onClick={() => handleCancelPayment(payment._id)} className="px-2 inline-flex text-xs font-semibold rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200">
                              결제 취소
                            </button>
                          ) : (
                            <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">취소됨</span>
                          )}
                        </td>
                      </tr>
                      {selectedOrder?.orderNumber === index + 1 && (
                        <tr>
                          <td colSpan={8} className="bg-gray-100 p-4">
                            <div>
                              <h2 className="text-lg font-semibold">주문 상세 정보</h2>
                              <table className="w-full mt-4 table-auto border-collapse border border-gray-200 bg-white">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">메뉴명</th>
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">수량</th>
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">단가</th>
                                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">합계</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedOrder.orderItems?.map((item, i) => {
                                    const product = Products.findOne({ _id: item.product_id });
                                    return (
                                      <tr key={i}>
                                        <td className="px-4 py-2 text-center text-sm text-gray-800">{product?.productName || "제품 정보 없음"}</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-600">{item.quantity}</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-600">{item.price?.toLocaleString()}원</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-600">{(item.quantity * (item.price || 0)).toLocaleString()}원</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          
            {/* 모바일 버전: 카드 형식 */}
            <div className="ring-none shadow-none border-none md:hidden space-y-4">
  {payments.map((payment, index) => {
    const order = Orders.findOne({ _id: payment.order_id });
    const userNickname = Meteor.users.findOne({ _id: payment.user_id })?.profile.nickname || "정보 없음";
    const username = Meteor.users.findOne({ _id: payment.user_id })?.username || "정보 없음";

    return (
      <div key={payment._id} className="space-y-2">
        {/* 메인 카드 */}
        <div
          className="p-4 bg-white shadow rounded-lg space-y-2 ring-1 ring-gray-200 cursor-pointer"
          onClick={() => handleSelectOrder(payment._id, index + 1)}
        >
          <div className="flex justify-between">
            <span className="text-sm font-semibold">주문 번호: {index + 1}</span>
            <span className="text-sm font-semibold">{order ? order.orderType : "현장주문"}</span>
          </div>
          <div className="text-sm text-gray-600">
            <div>주문 일자: {new Date(payment.paymentDate).toLocaleString()}</div>
            <div>닉네임: {userNickname}</div>
            <div>아이디: {username}</div>
            <div>주문금액: {payment.totalSum?.toLocaleString()}원</div>
            <div className="flex items-center space-x-2">
              <span>주문상태:</span>
              {payment.status === "대기" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkCompleted(payment._id);
                  }}
                  className="px-2 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  대기 (클릭 시 완료)
                </button>
              ) : (
                <span
                  className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                    payment.status === "완료" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>결제 상태:</span>
              {payment.status !== "취소" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelPayment(payment._id);
                  }}
                  className="px-2 inline-flex text-xs font-semibold rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200"
                >
                  결제 취소
                </button>
              ) : (
                <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  취소됨
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 주문 상세 정보 */}
        {selectedOrder?.orderNumber === index + 1 && (
          <div className="p-4 bg-gray-100 shadow-inner rounded-lg space-y-2">
            <h2 className="text-sm font-semibold">주문 상세 정보</h2>
            <div className="space-y-2">
              {selectedOrder.orderItems?.map((item, i) => {
                const product = Products.findOne({ _id: item.product_id });
                return (
                  <div key={i} className="p-2 bg-white shadow rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{product?.productName || "제품 정보 없음"}</span>
                      <span className="text-sm">{item.quantity}개</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>단가: {item.price?.toLocaleString()}원</span>
                      <span>합계: {(item.quantity * (item.price || 0)).toLocaleString()}원</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>

          </div>
          







          )}

          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md text-sm font-medium
                    ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
            >
              이전
            </button>
            <span className="text-sm text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-md text-sm font-medium
                    ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
