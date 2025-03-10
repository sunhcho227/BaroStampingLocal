import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal.jsx";
import Loading from "../Loading.jsx";
import LoadingAnimation from "/imports/ui/components/LoadingAnimation.jsx";
import "../styles/user_main.css";
import "../styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const navigate = useNavigate();
  const imagePromptRef = useRef("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [dalleLoading, setDalleLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleGenerateImage = () => {
    setDalleLoading(true);
    setImageLoading(true);

    const lastGeneratedTime = parseInt(
      localStorage.getItem("lastGeneratedTime")
    );
    const now = new Date().getTime();

    if (lastGeneratedTime && now - lastGeneratedTime < 10 * 60 * 1000) {
      setDalleLoading(false);
      setImageLoading(false);
      setModalMessage("이미지 생성은 10분에 한 번만 가능합니다.");
      setIsModalOpen(true);
      return;
    }

    localStorage.setItem("lastGeneratedTime", now.toString());

    const imagePrompt = imagePromptRef.current.value;
    if (!imagePrompt) {
      setDalleLoading(false);
      setImageLoading(false);
      setModalMessage("이미지 생성에 필요한 정보를 입력해주세요.");
      setIsModalOpen(true);
      return;
    }

    setGeneratedImage("/customers/BaroStampIng.png");
    setDalleLoading(false);
    setImageLoading(false);

    // Meteor.call("dalle.generateImage", imagePrompt, user._id, (err, res) => {
    //   if (err) {
    //     const errorMessage = err.reason || err.message;
    //     setModalMessage(errorMessage.replace(/[\[\]]/g, ""));
    //     setIsModalOpen(true);
    //   } else {
    //     setGeneratedImage(res);
    //   }
    //   setDalleLoading(false);
    //   setImageLoading(false);
    //   imagePromptRef.current.value = "";
    // });
  };

  const handleUpdateProfile = () => {
    setModalMessage("Azure의 응답이 늦어지고 있습니다.");
    setIsModalOpen(true);

    // setSaveLoading(true);
    // setImageLoading(true);

    // Meteor.call(
    //   "saveProfileImageFromUrl",
    //   user._id,
    //   generatedImage,
    //   (err, res) => {
    //     if (err) {
    //       console.error("프로필 저장 실패:", err);
    //     } else {
    //       console.log("프로필 저장 성공:", res);
    //       setModalMessage("프로필 이미지가 저장되었습니다.");
    //       setIsModalOpen(true);
    //     }
    //     setSaveLoading(false);
    //     setImageLoading(false);
    //   }
    // );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage === "이미지 생성에 필요한 정보를 입력해주세요.") {
      return;
    } else {
      navigate("/customers/mypage");
    }
  };

  if (imageLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div
      className="dalle-container sc"
      style={{ minHeight: "calc(100vh - 200px)", paddingBottom: "120px" }}
    >
      <div className="text_title_m_150 primary text_align_center">
        만들고 싶은 이미지에 대해서 적어주세요!
      </div>
      <div className="custom-inputbox-container">
        <input
          className="custom-inputbox"
          type="text"
          ref={imagePromptRef}
          placeholder="예시: 눈 내리는 날 커피를 마시는 판다"
          required
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleGenerateImage}
        disabled={dalleLoading}
      >
        {dalleLoading ? (
          <div className="loading-spinner">이미지 생성 중...</div>
        ) : (
          "이미지 생성하기"
        )}
      </button>
      <div className="text-xs text-gray-500 text-center">
        이미지 생성에 시간이 조금 걸릴 수 있습니다
      </div>
      <div>
        {generatedImage && (
          <div className="generated-image-container">
            <h3>DALL-E가 생성한 이미지</h3>
            <button className="btn-secondary" onClick={handleUpdateProfile}>
              {saveLoading ? (
                <div className="loading-spinner">저장 중...</div>
              ) : (
                "프로필로 저장하기"
              )}
            </button>
            <img
              src="/customers/BaroStampIng.png"
              // src={generatedImage}
              alt="Generated"
              style={{
                opacity: saveLoading ? 0.5 : 1,
                transition: "opacity 0.3s",
              }}
            />
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} message={modalMessage} onClose={closeModal} />
    </div>
  );
};
