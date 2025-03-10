import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav.jsx";
import Header from "./Header.jsx";
import "/imports/ui/lib/utils.js";
import "../styles/user_main.css";
import Loading from "../Loading.jsx";

export default () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let currentUsername = Meteor.user()?.username;
    setIsLoggedIn(!!currentUsername);

    if (!currentUsername) {
      setIsLoading(true);
      currentUsername = "Guest_" + Random.id();
      setUsername(currentUsername);

      Meteor.call("addUserforCart", currentUsername, (error, result) => {
        if (error) {
          setIsLoading(false);
          console.error("랜딩 페이지:", error);
        } else {
          console.log("랜딩 페이지", result);

          if (!Meteor.user()) {
            Meteor.loginWithPassword(currentUsername, "1234", (err) => {
              if (err) {
                console.error("자동 로그인 실패:", err);
              } else {
                console.log("로그인 성공");
                setIsLoggedIn(true);
              }
              setIsLoading(false);
            });
          } else {
            setIsLoading(false);
          }
        }
      });
    }
  }, []);

  //로그아웃처리
  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      Meteor.logout(() => {
        navigate("/");
      });
    }
  };

  const pageTitle = "전자스탬프서비스 Baro";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header pageTitle={pageTitle} />
          <Nav />
          <div className="landingpage-container p-6 bg-gray-100">
            <div className="text-centert items-center">
              <h1 className="text-xl text-center text-[#00838C] mb-1">
                쉽고 빠른 전자 스탬프 서비스
              </h1>

              {/* 로고를 가운데 정렬 */}
              <div className="flex justify-center m-4">
                <img
                  src="/icons/baro_logo.svg"
                  alt="Baro"
                  className="h-8 w-auto"
                />
              </div>

              <p className="text-center text-gray-600 mb-6">
                번거로운 종이 쿠폰은 이제 그만!
                <br />
                스마트한 스탬핑을 경험해 보세요
              </p>

              <Link to="/customers/StampTour">
                <div className="banner-item  mb-3">
                  <img
                    src="/images/banner/banner_stamptour02.png"
                    alt="스탬프 투어 개최중"
                  />
                </div>
              </Link>

              <a
                href="https://youtu.be/nnevZBfa5kc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="banner-item mb-6">
                  <img
                    src="/images/banner/banner_stamptour01.png"
                    alt="유튜브에서 보기!"
                  />
                </div>
              </a>

              {/* 핵심 기능 섹션 */}
              <div className="grid grid-cols-1 gap-6">
                {/* 양방향 QR 시스템 */}
                <div className="bg-white px-6 py-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    양방향 QR 스탬프 및 쿠폰 적립/사용 시스템
                  </h2>
                  <ul className="list-disc list-inside text-gray-700">
                    <li className="flex flex-col">
                      <strong className="mr-2">회원고객 :</strong> QR 코드를
                      스캔하여 스탬프 적립 및 쿠폰 사용 가능
                    </li>
                    <li className="flex flex-col">
                      <strong className="mr-2">기업고객 :</strong> 회원 QR
                      코드를 스캔하여 스탬프와 쿠폰 지급
                    </li>
                  </ul>
                </div>

                {/* AI 기능 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    AI 기능
                  </h2>
                  <ul className="list-disc list-inside text-gray-700">
                    <li className="flex flex-col">
                      <strong className="mr-2">회원고객 :</strong> DALL-E로 개인
                      맞춤형 프로필 사진 생성
                    </li>
                    <li className="flex flex-col">
                      <strong className="mr-2">기업고객 :</strong> 리뷰 관리 및
                      프로모션 콘텐츠 자동 생성
                    </li>
                  </ul>
                </div>

                {/* 회원 주문 기능 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    회원고객 주문 기능
                  </h2>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Baro주문를 통해 직접 주문</li>
                    <li>테이블 QR 코드를 스캔하여 주문</li>
                  </ul>
                </div>

                {/* 기업업님 주문 처리 기능 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    기업고객 통합 관리 시스템
                  </h2>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>POS 시스템을 통한 주문 관리</li>
                    <li>회원관리 및 마케팅관리</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="text-center">
              <Link to="/customers">
                <button className="w-full bg-[#00838C] text-white px-4 py-4 rounded hover:bg-[#006d75] transition-colors">
                  지금 시작하기
                </button>
              </Link>
              <div className="text-gray-400 pt-10 pb-10">
                기업 고객은 <u onClick={handleLogout}>여기</u>를 클릭하세요.
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
