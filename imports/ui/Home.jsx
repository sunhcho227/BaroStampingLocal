import React, { useEffect, useRef } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";
import { Admins } from "/imports/api/collections";
import { Link } from "react-router-dom";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const navigate = useNavigate();

  const { user, isAdmin } = useTracker(() => {
    const user = Meteor.user();
    const isAdmin = user ? !!Admins.findOne({ user_id: user._id }) : false;

    return { user, isAdmin };
  });

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admins");
      } else {
        navigate("/customers");
      }
    }
  }, [user, isAdmin, navigate]);

  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate("/");
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    Meteor.loginWithPassword(username, password, (err, rslt) => {
      if (err) {
        alert(err.reason);
      } else {
        console.log("로그인 성공!", rslt);
      }
    });
  };

  return (
    <>
      <div className="login-page-container">
        {user ? (
          <div className="login-box">
            <div className="login-box">
              <div className="logo-box">
                <img src="/icons/logo.svg" alt="전자 스탬프 서비스 스탬핑" />
              </div>
              <div className="logout-text">
                <div className="text_title_l join_text_color">
                  환영합니다 {user?.profile.nickname || "GUEST"}님
                </div>
              </div>
              {/* <div className="button-container">
                <button className="logout-button" onClick={handleLogout}>
                  <span className="button-text">로그아웃</span>
                </button>
              </div> */}
              <div className="join-box">
                <div className="join">
                  <span className="text_title_xs join_text_color">
                    고객센터 1234-1234
                  </span>
                  <div className="separator"></div>
                  <span className="text_body_l join_text_color">
                    개인정보 처리 방침
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-box">
            <div className="login-box">
              <div className="logo-box">
                <img src="/icons/logo.svg" alt="전자 스탬프 서비스 스탬핑" />
              </div>

              <form onSubmit={handleLogin} className="form-container">
                <div className="custom-inputbox-container">
                  <input
                    // id="username"
                    ref={usernameRef}
                    type="text"
                    className="custom-inputbox"
                    placeholder="아이디를 입력해주세요"
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="custom-inputbox-container">
                  <input
                    // id="password"
                    type="password"
                    ref={passwordRef}
                    className="custom-inputbox"
                    placeholder="비밀번호를 입력해주세요"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="button-container">
                  <button className="login-button" type="submit">
                    <span className="button-text">로그인</span>
                  </button>
                </div>
              </form>

              <div className="join-box">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-semibold join_text_color text-center">
                    비치된 QR을 스캔하면 서비스를 시작할 수 있습니다.
                  </div>
                  <div className="text-xs font-semibold join_text_color text-center">
                    ID와 패스워드를 분실하셨을 경우
                    <br />
                    <Link to="/customers/LandingPage">
                    <u className="text-white">여기</u>
                    </Link>
                    를 누르시면 서비스를
                    시작할 수 있습니다.
                  </div>
                </div>

                {/* 
                <div className="join flex flex-wrap justify-center items-center gap-4 text-center">
                  <span className="text_title_xs join_text_color whitespace-nowrap">
                    회원가입
                  </span>
                  <div className="h-5 w-px bg-gray-300"></div>
                  <span className="text_body_l join_text_color whitespace-nowrap">
                    아이디 찾기
                  </span>
                  <div className="h-5 w-px bg-gray-300"></div>
                  <span className="text_body_l join_text_color whitespace-nowrap">
                    비밀번호 찾기
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
