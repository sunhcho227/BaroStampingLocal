import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import Modal from "../Modal.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modal, setModal] = useState({
    isVisible: false,
    message: "",
    isSuccess: false,
  });
  const navigate = useNavigate();

  // 회원 접근 제한
  useEffect(() => {
    if (user?.profile?.userGrade === "회원") {
      navigate("/customers/mypage");
    }
  }, [navigate]);

  const handleSave = () => {
    // 필수 항목 검증
    if (!username || !nickname || !password || !confirmPassword) {
      setModal({
        isVisible: true,
        message: "필수 항목을 모두 입력해주세요.",
        isSuccess: false, // 실패 모달
      });
      return;
    }

    if (password !== confirmPassword) {
      setModal({
        isVisible: true,
        message: "비밀번호가 일치하지 않습니다.",
        isSuccess: false, // 실패 모달
      });
      return;
    }

    // 사용자 업데이트 메서드 호출
    Meteor.call(
      "nonMember.updateProfile",
      { nickname, phoneNumber, email, username, password, userGrade: "회원" },
      (error) => {
        if (error) {
          if (error.error === "duplicate-username") {
            // 아이디 중복 에러 처리
            setModal({
              isVisible: true,
              message:
                "이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.",
              isSuccess: false, // 실패 모달
            });
          } else {
            // 일반 에러 처리
            setModal({
              isVisible: true,
              message: `회원 정보 업데이트 실패: ${error.reason}`,
              isSuccess: false, // 실패 모달
            });
          }
          return;
        }

        // 성공 모달 표시
        setModal({
          isVisible: true,
          message: "가입을 환영합니다! 다시 로그인 해주세요!",
          isSuccess: true, // 성공 모달
        });
      }
    );
  };

  const closeModal = () => {
    if (modal.isSuccess) {
      // 성공 모달인 경우 /로 이동
      navigate("/");
    } else {
      // 실패 모달인 경우 모달만 닫기
      setModal({ isVisible: false, message: "가입 실패", isSuccess: false });
    }
  };

  const pageTitle = "회원가입";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="profile-edit-container">
        <div className="profile-header">
          <div className="text_title_m primary">회원 가입</div>
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">
              <span className="primary">*</span>아이디
            </div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
              />
            </div>
          </div>

          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">
              <span className="primary">*</span>닉네임
            </div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </div>
          </div>

          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">전화번호</div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </div>
          </div>

          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">이메일</div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>

          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">
              <span className="primary">*</span>비밀번호
            </div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          <div className="profile-field">
            <div className="text_title_xs profile_keyarea">
              <span className="primary">*</span>비밀번호 확인
            </div>
            <div className="custom-inputbox-container">
              <input
                className="custom-inputbox"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
        </div>

        <div className="profile-btn-actions">
          <button onClick={handleSave} className="btn-primary">
            가입 하기
          </button>
        </div>
      </div>
      {modal.isVisible && (
        <Modal
          isOpen={modal.isVisible}
          message={modal.message}
          onClose={closeModal}
        />
      )}
    </>
  );
};
