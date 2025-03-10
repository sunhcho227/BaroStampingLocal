import React, { useRef, useEffect, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useNavigate, Link } from "react-router-dom";
import Nav from "./Nav.jsx";
import Header from "./Header.jsx";
import Modal from "../Modal.jsx";
import "../styles/user_main.css";
import "../styles/user_layout.css";

export default () => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user(), []);
  const nicknameRef = useRef("");
  const phoneNumberRef = useRef("");
  const emailRef = useRef("");
  const [modal, setModal] = useState({ isVisible: false, message: "" });

  useEffect(() => {
    if (user) {
      nicknameRef.current.value = user.profile?.nickname || "";
      phoneNumberRef.current.value = user.profile?.phoneNumber || "";
      emailRef.current.value = user.profile?.email || "";
    }
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();

    const nickname = nicknameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const email = emailRef.current.value;

    Meteor.call(
      "users.updateProfile",
      { nickname, phoneNumber, email },
      (error) => {
        if (error) {
          setModal({
            isVisible: true,
            message: `프로필 정보 수정 실패: ${error.reason}`,
          });
        } else {
          setModal({
            isVisible: true,
            message: "프로필 정보가 수정되었습니다!",
          });
        }
      }
    );
  };

  const closeModal = () => {
    setModal({ isVisible: false, message: "" });
    navigate("/customers/mypage");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (user) {
      nicknameRef.current.value = user.profile?.nickname || "";
      phoneNumberRef.current.value = user.profile?.phoneNumber || "";
      emailRef.current.value = user.profile?.email || "";
    }
    navigate(-1);
  };

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  const pageTitle = "프로필 수정";
  document.title = `Stamping - ${pageTitle}`;
  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="profile-edit-container">
        <div className="profile-header">
          <div className="text_title_m primary">프로필 수정</div>
          <Link to="/customers/editpassword">
            <button className="btn-small">비밀번호 수정</button>
          </Link>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="profile-details">
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">닉네임</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="text"
                  ref={nicknameRef}
                  placeholder="닉네임을 입력해주세요"
                />
              </div>
            </div>
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">전화번호</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="text"
                  ref={phoneNumberRef}
                  placeholder="전화번호를 입력해주세요"
                />
              </div>
            </div>
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">이메일</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="text"
                  ref={emailRef}
                  placeholder="이메일을 입력해주세요"
                />
              </div>
            </div>
          </div>
          <div className="profile-btn-actions">
            <button className="btn-primary-outline" onClick={handleCancel}>
              취소
            </button>
            <button className="btn-primary" type="submit">
              저장
            </button>
          </div>
        </form>

        {modal.isVisible && (
          <Modal
            isOpen={modal.isVisible}
            message={modal.message}
            onClose={closeModal}
          />
        )}
      </div>
    </>
  );
};
