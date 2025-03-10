import React, { useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import Nav from "./Nav.jsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Admins, UserStores } from "/imports/api/collections";
import Loading from "../Loading.jsx";

const UserSearch = () => {
  const user = useTracker(() => Meteor.user(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const storeId = Admins.findOne({ user_id: user._id })?.store_id;

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);

    Meteor.call("users.search", searchQuery, (error, result) => {
      if (error) {
        alert("검색 중 오류가 발생했습니다.");
        console.error(error);
      } else {
        setSearchResults(result);
        setSearchPerformed(true);
        setSearchQuery("");
      }
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  const userList = Meteor.users
    .find(
      {
        "profile.userGrade": { $in: ["회원", "비회원"] },
        _id: {
          $in: UserStores.find({ store_id: storeId }).map(
            (userStore) => userStore.user_id
          ),
        },
      },
      { sort: { "profile.createdAt": -1 } }
    )
    .fetch();

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Nav />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 헤드섹션 */}
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            회원 조회 및 관리
          </h1>
          <p className="mt-2 text-sm text-gray-500 mb-6">
            회원과 비회원을 검색하고 상세 정보를 확인할 수 있습니다. 닉네임,
            전화번호, 이메일을 기준으로 검색할 수 있으며, 전체 회원 목록도
            제공합니다.
          </p>
          <div className="space-y-8">
            {/* 검색 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                회원 조회
              </h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="검색어를 입력해주세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A9B5] focus:border-transparent"
                  />
                  <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center bg-[#00838C] text-white px-4 py-2 rounded hover:bg-[#006d75] transition-colors"
                >
                  검색
                </button>
              </form>

              {/* 검색 결과 */}
              {searchPerformed && (
                <div className="mt-6">
                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        검색 결과
                      </h3>

                      {/* 데스크탑용 테이블 */}
                      <div className="hidden md:block">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  닉네임
                                </th>
                                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  전화번호
                                </th>
                                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  이메일
                                </th>
                                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                  상세보기
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {searchResults.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                  <td className="px-3 py-4 text-center text-sm text-gray-900">
                                    {user.profile.nickname}
                                  </td>
                                  <td className="px-3 py-4 text-center text-sm text-gray-500">
                                    {user.profile.phoneNumber || "없음"}
                                  </td>
                                  <td className="px-3 py-4 text-center text-sm text-gray-500">
                                    {user.profile.email || "없음"}
                                  </td>
                                  <td className="px-3 py-4 text-center text-sm">
                                    <Link
                                      to="/admins/userdetail"
                                      state={{ userId: user._id }}
                                      className="text-[#00A9B5] hover:text-[#00838C]"
                                    >
                                      자세히 보기
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* 모바일용 카드 */}
                      <div className="block md:hidden">
                        <div className="space-y-4">
                          {searchResults.map((user) => (
                            <div
                              key={user._id}
                              className="bg-[#F2FDFD] p-4 rounded-lg shadow"
                            >
                              <p className="text-lg font-semibold text-gray-900">
                                닉네임: {user.profile.nickname}
                              </p>
                              <p className="text-sm text-gray-600">
                                전화번호: {user.profile.phoneNumber || "없음"}
                              </p>
                              <p className="text-sm text-gray-600">
                                이메일: {user.profile.email || "없음"}
                              </p>
                              <Link
                                to="/admins/userdetail"
                                state={{ userId: user._id }}
                                className="text-[#00A9B5] hover:text-[#00838C] mt-2 inline-block"
                              >
                                자세히 보기
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      검색 결과가 없습니다.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 회원 목록 섹션 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                회원 목록
              </h3>

              {/* 데스크탑용 테이블 */}
              <div className="hidden md:block">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-[#414B55] text-white">
                      <tr>
                        <th className="px-3 py-3.5 text-center text-sm font-semibold">
                          닉네임
                        </th>
                        <th className="px-3 py-3.5 text-center text-sm font-semibold">
                          가입일
                        </th>
                        <th className="px-3 py-3.5 text-center text-sm font-semibold">
                          회원유형
                        </th>
                        <th className="px-3 py-3.5 text-center text-sm font-semibold">
                          상세보기
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {userList.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 text-center text-sm text-gray-900">
                            {user.profile.nickname}
                          </td>
                          <td className="px-3 py-4 text-center text-sm text-gray-500">
                            {new Date(
                              user.profile.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4 text-center text-sm">
                            {user.profile.userGrade}
                          </td>
                          <td className="px-3 py-4 text-center text-sm">
                            <Link
                              to="/admins/userdetail"
                              state={{ userId: user._id }}
                              className="text-[#00A9B5] font-semibold hover:text-[#00838C]"
                            >
                              자세히 보기
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 모바일용 카드 */}
              <div className="block md:hidden">
                <div className="space-y-4">
                  {userList.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 rounded-lg border border-gray-300 shadow"
                    >
                      <p className="text-lg font-semibold text-gray-900">
                        닉네임: {user.profile.nickname}
                      </p>
                      <p className="text-sm text-gray-600">
                        가입일:{" "}
                        {new Date(user.profile.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        회원유형: {user.profile.userGrade}
                      </p>
                      <Link
                        to="/admins/userdetail"
                        state={{ userId: user._id }}
                        className="text-[#00A9B5] font-semibold hover:text-[#00838C] mt-2 inline-block"
                      >
                        자세히 보기
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSearch;
