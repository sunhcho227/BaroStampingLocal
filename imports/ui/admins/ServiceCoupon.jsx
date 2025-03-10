import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Nav from "./Nav.jsx";
import { QrCodeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ServiceCoupon = () => {
  const user = useTracker(() => Meteor.user(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    Meteor.call("users.search", searchQuery, (error, result) => {
      if (error) {
        alert("검색 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        setSearchResults(result);
        setSearchPerformed(true);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">서비스 쿠폰 발행</h1>
          <p className="mt-2 text-sm text-gray-600">쿠폰 발행 방식을 선택해주세요</p>
        </div>

        {/* 발행 방식 선택 카드 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* QR 코드 발행 카드 */}
          <Link 
            to="/reader" 
            state={{ type: "serviceCouponPlus" }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <QrCodeIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">바코드로 발행하기</h3>
                <p className="mt-1 text-sm text-gray-500">
                  QR/바코드를 스캔하여 빠르게 쿠폰을 발행합니다
                </p>
              </div>
            </div>
          </Link>

          {/* 회원 검색 발행 카드 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">회원 검색으로 발행하기</h3>
              <p className="mt-1 text-sm text-gray-500">
                회원 정보로 검색하여 쿠폰을 발행합니다
              </p>
            </div>

            {/* 검색 폼 */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어 입력 (username, nickname, phoneNumber, email)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                검색
              </button>
            </form>
          </div>
        </div>

        {/* 검색 결과 섹션 */}
        {searchPerformed && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">검색 결과</h3>
            {searchResults.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">닉네임</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">전화번호</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {searchResults.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.profile.nickname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.profile.phoneNumber || "없음"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.profile.email || "없음"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link 
                            to="/admins/userdetail" 
                            state={{ userId: user._id }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            자세히 보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCoupon;