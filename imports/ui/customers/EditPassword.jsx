import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Modal from "../Modal.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const navigate = useNavigate();

  // 입력 폼 상태 관리
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modal, setModal] = useState({ isVisible: false, message: "" });

  // 비밀번호 저장
  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      setModal({
        isVisible: true,
        message: "새 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    Meteor.call(
      "users.changePassword",
      { currentPassword, newPassword },
      (error) => {
        if (error) {
          setModal({
            isVisible: true,
            message: `비밀번호 수정 실패: ${error.reason}`,
          });
        } else {
          setModal({
            isVisible: true,
            message: "비밀번호 수정이 완료되었습니다. 재로그인 해주세요!",
          });
        }
      }
    );
  };

  // 모달 닫기
  const closeModal = () => {
    setModal({ isVisible: false, message: "" });
    navigate("/");
  };

  // 취소 버튼 동작: 이전 페이지로 이동
  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  //로그아웃처리리
  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      Meteor.logout(() => {
        navigate("/");
      });
    }
  };

  const pageTitle = "비밀번호 수정";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />

      <div className="profile-edit-container">
        <div>
          <div className="profile-header">
            <div className="text_title_m primary">비밀 번호 수정</div>
          </div>
          <div className="profile-details">
            {/* 현재 비밀번호 */}
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">현재 비밀번호</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력해주세요"
                />
              </div>
              {/* 새 비밀번호 */}
            </div>
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">새 비밀번호</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력해주세요"
                />
              </div>
            </div>
            {/* 비밀번호 확인 */}
            <div className="profile-field">
              <div className="text_title_xs profile_keyarea">비밀번호 확인</div>
              <div className="custom-inputbox-container">
                <input
                  className="custom-inputbox"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력해주세요"
                />
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="profile-btn-actions">
            <button className="btn-primary-outline" onClick={handleCancel}>
              취소
            </button>
            <button className="btn-primary" onClick={handleSavePassword}>
              비밀번호 저장
            </button>
          </div>
        </div>

        <div className="pt-80 pb-100">
          <div
            className="text-xs text-gray-200 text-center hover:text-[#00A9B5] cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </div>
        </div>

        {/* 모달 */}
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
