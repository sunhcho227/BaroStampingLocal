import React from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Stores, UserStores } from "/imports/api/collections";
import { Link } from "react-router-dom";
import Nav from "/imports/ui/customers/Nav.jsx";
import Header from "/imports/ui/customers/Header.jsx";
import "/imports/ui/styles/user_main.css";
import "/imports/ui/styles/user_layout.css";

export default () => {
  const user = Meteor.user();
  const teamUrlNames = Stores.find({
    storeUrlName: { $regex: /^team/ },
  }).fetch();
  const teamsIds = teamUrlNames.map((store) => store._id);

  const teamTourCount = UserStores.find({
    user_id: user._id,
    store_id: { $in: teamsIds },
  }).count();
  const completeMission = 5;

  // useTracker 선언
  useTracker(() => {
    UserStores.find().fetch();
  });

  // 이미지 경로를 조건에 따라 설정
  const getImageSrc = () => {
    if (teamTourCount >= completeMission) {
      return "/images/complete.png";
    }
    return `/images/step${teamTourCount}.png`;
  };

  // 단계별 설명을 반환하는 함수
  const getStageDescription = () => {
    switch (teamTourCount) {
      case 0:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              🌱 여정의 시작: 겁 많은 아기 토끼
            </h3>
            <p className="text_body_m">
              호기심에 가득 찬 작은 아기 토끼가 처음으로 세상에 발을 내딛습니다.
              몸집만한 배낭을 매고 떨리는 눈망울을 반짝이며, 새로운 모험을
              시작하려고 합니다. 아직은 무기도 없고, 마음속엔 두려움이
              가득하지만, 토끼의 여정은 이제 막 시작되었어요!
            </p>
          </div>
        );
      case 1:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              🍃 숲의 발견: 단검을 든 용감한 토끼
            </h3>
            <p className="text_body_m">
              울창한 작은 숲을 탐험하던 토끼는 나무 그루터기에 꽂힌 단검을
              발견합니다. 단검을 꼭 쥐며 두려움을 살짝 누른 채, 한걸음씩 더
              나아갑니다. '이제 작은 적쯤은 물리칠 수 있을지도 몰라!'
            </p>
          </div>
        );
      case 2:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              💧 신비의 호수: 반짝이는 방패를 얻은 토끼
            </h3>
            <p className="text_body_m">
              맑고 고요한 신비의 호수를 건너던 토끼는 물결 아래에서 반짝이는
              방패를 발견합니다. 방패를 든 순간, 두려움이 조금씩 사라지며
              마음속에 든든한 용기가 피어납니다. 이제 위험이 와도 막아낼 수 있을
              것 같아요!
            </p>
          </div>
        );
      case 3:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              🏔️ 산의 시련: 마법의 망토를 두른 토끼
            </h3>
            <p className="text_body_m">
              거친 바람과 눈보라를 뚫고 산을 오르던 토끼는, 휘황찬란한 빛을 내는
              마법의 망토를 발견합니다. 망토를 두른 순간, 몸이 가볍고
              따뜻해졌습니다. 이젠 진짜 모험가처럼 느껴져요!
            </p>
          </div>
        );
      case 4:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              🐉 운명의 결투: 거대한 용과 맞서는 토끼
            </h3>
            <p className="text_body_m">
              드디어 거대한 용이 앞을 가로막습니다! 불길과 포효 속에서도, 토끼는
              흔들림 없이 단검과 방패를 든 채 용과 맞섭니다. 두려움은 사라지고,
              눈빛엔 용맹함이 가득합니다. '이번엔 절대 물러서지 않을 거야!'
            </p>
          </div>
        );
      default:
        return (
          <div className="stamptour_contents">
            <h3 className="text_title_m primary mb-3">
              👑 왕관의 주인: 왕이 된 토끼
            </h3>
            <p className="text_body_m">
              모든 시련을 이겨내고 마침내 왕관을 쓰게 된 토끼! 작은 겁쟁이였던
              토끼는 이제 용기와 지혜로 가득한 왕이 되었습니다. 그의 모험은
              끝났지만, 이 전설은 영원히 기억될 거예요!
            </p>
          </div>
        );
    }
  };

  // 동그라미 렌더링 함수
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < completeMission; i++) {
      if (i < teamTourCount) {
        circles.push(
          <span key={i} className="circle filled">
            ●
          </span>
        );
      } else {
        circles.push(
          <span key={i} className="circle">
            ○
          </span>
        );
      }
    }
    return circles;
  };

  const pageTitle = "스탬프 투어";
  document.title = `Stamping - ${pageTitle}`;

  return (
    <>
      <Header pageTitle={pageTitle} />
      <Nav />
      <div className="stamptour-container">
        <div className="stamptour-titlebox">
          <div className="text-2xl font-bold text_align_center text-[#025f66]">
            스탬프 투어
          </div>
          <div className="text_body_l text_align_center">
            누구나에서 바로 스탬핑 투어중!
          </div>
          <div className="text_body_xl text_align_center">
            곳곳에 숨겨져있는 QR코드를 찾아서 스캔해주세요!
          </div>
          <div className="text_body_xl text_align_center">
            5개를 모으고 Baro부스를 방문해 주시면
          </div>
          <div className="text_body_xl text_align_center">
            소정의 상품을 드립니다!
          </div>
          <div className="text-sm text-gray-500 text_align_center">
            <span className="font-semibold text-[#00A9B5]">Tip</span> 시연부스를
            방문해서 체험하셔도 스탬프를 얻을 수 있어요!
          </div>
        </div>

        <div className="stamptour-status">
          <span className="text_title_xs primary">Start</span>
          <div>{renderCircles()}</div>
          <span className="text_title_xs">
            {teamTourCount} / {completeMission}{" "}
            {teamTourCount >= completeMission ? "미션 컴플리트" : "미션 진행중"}
          </span>
        </div>

        <div className="stamptour-contentsbox">
          <div className="text_title_m text_align_center">
            {getStageDescription()}
          </div>

          <div className="stamptour-contentsbox-img-placeholder">
            <img
              src={getImageSrc()}
              alt={`Step ${teamTourCount}`}
              className="step-image"
            />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text_align_center text-[#025f66] mb-3 mt-6">
            스탬프 획득 가능한 시연부스
          </h3>

          <div className="w-full flex flex-col gap-4">
            {/* Team01 */}
            <div className="w-full flex flex-col p-6 bg-[#fafcfc]">
              <div className="w-full flex flex-row gap-4">
                {/* 이미지 섹션 */}
                <div className="w-1/3 aspect-[3/2]">
                  <img
                    src="/images/teamimg/team01.png"
                    alt="Team Logo"
                    className="w-full aspect-[3/2] object-cover cursor-pointer shadow"
                    onClick={() =>
                      window.open("/images/teamimg/team01.png", "_blank")
                    }
                  />
                </div>

                {/* 텍스트 섹션 */}
                <div className="flex flex-col w-2/3">
                  {/* 타이틀과 부스 번호 */}
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="text-xl font-semibold">TiTi Project</div>
                    <div className="text-l">Byte & bite</div>
                  </div>

                  {/* 내용 */}
                  <div className="text-sm">
                    TiTi 프로젝트는 여행 정보 공유의 어려움을 해결하는 스마트
                    플랫폼입니다. 여행 클립(그룹) 기능을 통해 공동 여행 계획과
                    후기 공유를 지원하며, 개인 경험 공유의 한계를 극복합니다.
                    여행지 정보를 입력하면 AI가 자동으로 맞춤형 여행 일정, 음식,
                    날씨 정보를 제공해 시간 소요를 줄여줍니다. 또한, Azure AI를
                    활용해 여행 리뷰에서 핵심 정보를 추출하고 자동으로 여행
                    계획을 생성합니다. 여행 관심사를 바탕으로 비슷한 취향의
                    사용자들을 매칭하고 이메일 알림을 제공하여 원활한 소통을
                    돕습니다. TiTi 프로젝트는 맞춤형 여행 정보를 제공하고
                    효율적인 여행 준비를 지원하는 혁신적인 플랫폼입니다.
                  </div>
                </div>
              </div>
            </div>

            {/* Team02 */}
            <div className="w-full flex flex-col p-6 bg-[#fafcfc]">
              <div className="w-full flex flex-row gap-4">
                {/* 이미지 섹션 */}
                <div className="w-1/3 aspect-[3/2]">
                  <img
                    src="/images/teamimg/team02.png"
                    alt="Team Logo"
                    className="w-full aspect-[3/2] object-cover cursor-pointer shadow"
                    onClick={() =>
                      window.open("/images/teamimg/team02.png", "_blank")
                    }
                  />
                </div>

                {/* 텍스트 섹션 */}
                <div className="flex flex-col w-2/3">
                  {/* 타이틀과 부스 번호 */}
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="text-xl font-semibold">Market Bridge</div>
                    <div className="text-l">Bridgers</div>
                  </div>

                  {/* 내용 */}
                  <div className="text-sm">
                    직접 재배한 농수산물, 직접 제작한 메이커상품들을 대기업
                    쇼핑몰에서 팔 재정적 여건이 안되는 작은 상인들을 위한
                    쇼핑몰! 지금까지 이런 쇼핑몰은 없었다! 단기간에 소소한
                    상품들은 팔고 싶어도 판매할 사이트가 없어서 네이버나
                    구글폼을 방황하던 소상공인 여러분들을 돕고 싶어서 Market
                    Bridge가 탄생하였습니다. 소상공인의 힘든 시작에 작은 발판이
                    되어 드리겠습니다. 작은 상점이지만 관리자를 위한 편의 시설은
                    알차게 준비한 MarketBridge.
                  </div>
                </div>
              </div>
            </div>

            {/* Team03 */}
            <div className="w-full flex flex-col p-6 bg-[#fafcfc]">
              <div className="w-full flex flex-row gap-4">
                {/* 이미지 섹션 */}
                <div className="w-1/3 aspect-[3/2]">
                  <img
                    src="/images/teamimg/team03.png"
                    alt="Team Logo"
                    className="w-full aspect-[3/2] object-cover cursor-pointer shadow"
                    onClick={() =>
                      window.open("/images/teamimg/team03.png", "_blank")
                    }
                  />
                </div>

                {/* 텍스트 섹션 */}
                <div className="flex flex-col w-2/3">
                  {/* 타이틀과 부스 번호 */}
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="text-xl font-semibold">Baro스탬핑</div>
                    <div className="text-l">수평적 밤샘핑</div>
                  </div>

                  {/* 내용 */}
                  <div className="text-sm">
                    앱 설치나 회원가입 없이도 웹사이트에서 개인 QR 코드를 생성해
                    스탬프를 적립하고 쿠폰을 사용할 수 있는 Baro스탬핑입니다.
                    사업자와 고객이 서로의 QR을 사용하여 적립과 사용을 할수 있는
                    양방향 QR을 지원하며, 주문서비스를 지원합니다. DALL-E를
                    이용한 프로필사진 생성과 Chat-GPT를 이용한 고객 관리 기능을
                    이용할 수 있습니다.
                  </div>
                </div>
              </div>
            </div>

            {/* Team04 */}
            <div className="w-full flex flex-col p-6 bg-[#fafcfc]">
              <div className="w-full flex flex-row gap-4">
                {/* 이미지 섹션 */}
                <div className="w-1/3 aspect-[3/2]">
                  <img
                    src="/images/teamimg/team04.png"
                    alt="Team Logo"
                    className="w-full aspect-[3/2] object-cover cursor-pointer shadow"
                    onClick={() =>
                      window.open("/images/teamimg/team04.png", "_blank")
                    }
                  />
                </div>

                {/* 텍스트 섹션 */}
                <div className="flex flex-col w-2/3">
                  {/* 타이틀과 부스 번호 */}
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="text-xl font-semibold">DEVCONNECT</div>
                    <div className="text-l">나혼자한다</div>
                  </div>

                  {/* 내용 */}
                  <div className="text-sm">
                    DEVCONNECT는 개발자들을 위한 프로젝트 중개 플랫폼으로, 회원
                    역량 평가 시스템을 기반으로 맞춤형 프로젝트 매칭을
                    제공합니다. 모집자는 원하는 역량과 점수를 설정해 적합한
                    지원자를 찾을 수 있으며, 지원자는 요구사항을 충족할 경우
                    프로젝트에 지원할 수 있습니다. DEVCONNECT는 개발자들에게
                    예의(manner), 지식 공유(mentoring), 열정(passion),
                    의사소통(communication), 시간 관리(time)와 같은 핵심 역량을
                    바탕으로 성장 기회를 제공합니다. 다양한 수준의 개발자들과
                    협업하며 부족한 역량을 보완하고, 프로젝트 완료 후 팀원 간
                    상호평가를 통해 개인의 강점과 약점을 파악할 수 있습니다.
                    이를 통해 개발자들은 지속적으로 자신의 역량을 갱신하고
                    발전할 수 있습니다.
                  </div>
                </div>
              </div>
            </div>

            {/* Team05 */}
            <div className="w-full flex flex-col p-6 bg-[#fafcfc]">
              <div className="w-full flex flex-row gap-4">
                {/* 이미지 섹션 */}
                <div className="w-1/3 aspect-[3/2]">
                  <img
                    src="/images/teamimg/team05.png"
                    alt="Team Logo"
                    className="w-full aspect-[3/2] object-cover cursor-pointer shadow"
                    onClick={() =>
                      window.open("/images/teamimg/team05.png", "_blank")
                    }
                  />
                </div>

                {/* 텍스트 섹션 */}
                <div className="flex flex-col w-2/3">
                  {/* 타이틀과 부스 번호 */}
                  <div className="flex flex-col gap-1 mb-1">
                    <div className="text-xl font-semibold">소소이사</div>
                    <div className="text-l">소소하게</div>
                  </div>

                  {/* 내용 */}
                  <div className="text-sm">
                    소소이사는 1인 가구, 소규모 이사, 또는 간단한 물품 이동이
                    필요한 사용자들을 위한 맞춤형 이사 서비스 플랫폼입니다.
                    소소이사는 용달 및 도우미 업체와 사용자 간의 효율적인 연결을
                    통해 누구나 쉽고 편리하게 이사 서비스를 이용할 수 있도록
                    돕습니다. 사용자는 자신의 이사 조건에 맞춰 최적의 견적을
                    빠르게 비교하고 선택할 수 있으며, 합리적인 비용과 신뢰할 수
                    있는 업체를 통해 안심하고 이사를 진행할 수 있습니다. 특히
                    간편한 물품 이동이나 소규모 이사에 특화된 서비스를 제공하여,
                    큰 이사 업체를 이용하기 부담스러운 사용자들에게 최적의
                    솔루션을 제공합니다. 소소이사는 바쁜 현대인들이 이사
                    과정에서 겪는 번거로움을 최소화하고, 간편하고 만족스러운
                    이사 경험을 제공하는 스마트한 이사 서비스 플랫폼입니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
