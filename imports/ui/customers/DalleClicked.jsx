import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stores, AIprompts, Stamps } from "/imports/api/collections";
import Modal from "../Modal.jsx";
import Loading from "../Loading.jsx";
import LoadingAnimation from "/imports/ui/components/LoadingAnimation.jsx";
import "../styles/user_main.css";
import "../styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  if (!user) {
    return <Loading />;
  }

  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [generatedImage, setGeneratedImage] = useState("");
  const [dalleLoading, setDalleLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const lastStamp = Stamps.findOne(
    { user_id: user._id },
    { sort: { createdAt: -1 } }
  );
  const aiInfo = AIprompts.findOne({
    store_id:
      lastStamp?.store_id ||
      Stores.findOne({ storeUrlName: "BaroStamping" })._id,
  });

  const animals = ["기린", "코끼리", "판다", "여우", "토끼", "수달", "다람쥐"];
  const styles = ["귀여운", "만화풍", "몽환적인", "동화풍", "사랑스러운"];

  const generatePrompt = () => {
    return `${aiInfo.category}, ${aiInfo.product}, ${selectedAnimal}, ${selectedStyle}`;
  };

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

    const prompt = generatePrompt();
    setGeneratedImage("/customers/BaroStampIng.png");
    setDalleLoading(false);
    setImageLoading(false);

    // Meteor.call("dalle.generateImage", prompt, user._id, (err, result) => {
    //   if (err) {
    //     const errorMessage = err.reason || err.message;
    //     setModalMessage(errorMessage.replace(/[\[\]]/g, ""));
    //     setIsModalOpen(true);
    //   } else {
    //     console.log("이미지 생성 성공:", result);
    //     setGeneratedImage(result);
    //   }
    //   setDalleLoading(false);
    //   setImageLoading(false);
    //   setSelectedAnimal(null);
    //   setSelectedStyle(null);
    // });
  };

  const handleUpdateProfile = () => {
    setModalMessage("Azure의 응답이 늦어지고 있습니다.");
    setIsModalOpen(true);

    // setSaveLoading(true);

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
    //   }
    // );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/customers/mypage");
  };

  if (imageLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="dalle-container">
      <div className="dalle-inin">
        <div className="text_title_m_150 primary text_align_center">
          {user.profile.nickname}님의 <br />
          최근 방문한 가게와 좋아하는 동물을 기반으로, <br />
          AI가 단 하나뿐인 특별한 프로필 이미지를 제작합니다.
        </div>
        <div className="dalle-item">
          <div className="text_title_m"># 가게명</div>
          <div className="text_body_xl">
            {Stores.findOne({ _id: lastStamp?.store_id })?.storeName ||
              "Baro-Stamping"}
          </div>
        </div>

        <div className="dalle-item">
          <div className="text_title_m"># 좋아하는 동물</div>
          <div className="flex flex-wrap gap-2">
            {animals.map((animal) => (
              <button
                key={animal}
                onClick={() => setSelectedAnimal(animal)}
                className={`choice-button ${
                  selectedAnimal === animal ? "selected" : ""
                }`}
              >
                {animal}
              </button>
            ))}
          </div>
        </div>
        <div className="dalle-item">
          <div className="text_title_m"># 그림 스타일</div>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`choice-button ${
                  selectedStyle === style ? "selected" : ""
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleGenerateImage}
          disabled={
            dalleLoading || !selectedAnimal || !selectedStyle || !aiInfo
          }
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
      </div>

      <div className="dalle-output">
        {generatedImage && (
          <div className="generated-image-container">
            <h3 className="text_title_m">DALL-E가 생성한 이미지</h3>
            <button className="btn-secondary" onClick={handleUpdateProfile}>
              {saveLoading ? (
                <div className="loading-spinner">저장 중...</div>
              ) : (
                "프로필로 저장하기"
              )}
            </button>
            <img
              // src={generatedImage}
              src="/customers/BaroStampIng.png"
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
