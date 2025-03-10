import React from "react";
import { Link } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();

  // 고객님과 함께한 N일째
  const myFirstDay =
    new Date().diffInDays(new Date(user?.profile.createdAt)) + 1;

  //로그아웃처리
  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      Meteor.logout(() => {
        navigate("/");
      });
    }
  };

  const pageTitle = "전자 스탬프 적립 서비스 스탬핑";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="joinstamping-container">
        <div className="joinus-title">
          <div className="text_body_l">
            스탬핑과의 소중한 인연{" "}
            <span className="text_title_xs primary">{myFirstDay}</span>일째
          </div>
          <div className="text_title_m primary">
            지금 바로 가입하세요<i>!</i> 특별한 혜택이 준비되어 있습니다<i>!</i>
          </div>
        </div>

        <div className="joinstamping-benefits">
          <div className="joinstamping-benefit">
            <div className="text_title_s">🎁 스탬프 → 쿠폰 전환</div>
            <div className="text_body_m">
              목표를 달성한 스탬프를 쿠폰으로 전환하려면 회원가입이 필요해요.
              지금 가입하고 혜택을 즐겨보세요!
            </div>
          </div>

          <div className="joinstamping-benefit">
            <div className="text_title_s">📸 프로필 사진 생성</div>
            <div className="text_body_m">
              생성형 AI를 이용해 나만의 멋진 프로필 사진을 만들어 보세요!
            </div>
          </div>

          <div className="joinstamping-benefit">
            <div className="text_title_s">🔄 스탬프 이어 적립</div>
            <div className="text_body_m">
              기기를 변경해도 스탬프를 계속 이어서 적립할 수 있어요!
            </div>
          </div>

          <div className="joinstamping-benefit">
            <div className="text_title_s">📢 가게 소식과 이벤트</div>
            <div className="text_body_m">
              좋아하는 가게들의 최신 소식과 다양한 이벤트 정보를 놓치지 마세요.
            </div>
          </div>
        </div>

        <Link className="btn-primary" to="/customers/register">
          회원가입 하러가기
        </Link>

        <div className="text-gray-600 pt-[200px] pb-[100px] text-center">
          기업 고객은 <u onClick={handleLogout}>여기</u>를 클릭하세요.
        </div>
      </div>
    </>
  );
};
