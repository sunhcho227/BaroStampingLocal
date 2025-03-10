import React, { useEffect, useRef, useState } from "react";

const KakaoMap = ({ center, markerText }) => {
  const mapRef = useRef(null);
  const [tmpKakao, setTmpKakao] = useState({});

  useEffect(() => {
    if (Object.keys(tmpKakao).length === 0) return;
    if (!center) return;

    const mapContainer = mapRef.current;

    const mapOption = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 2,
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);

    // 커스텀 오버레이 내용
    const content = `
      <div class="custom-marker">
        <div class="marker-label">${markerText}</div>
        <div class="marker-tail"></div>
      </div>
    `;

    const customOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(center.lat, center.lng),
      content: content,
      yAnchor: 1.5, // 마커의 꼬리 끝이 정확한 위치를 가리킴
    });

    customOverlay.setMap(map);
  }, [center, markerText, tmpKakao]);

  const checkKakao = () => {
    if (window.kakao) {
      setTmpKakao(kakao);
    } else {
      setTimeout(checkKakao, 1000); // 1초 후 다시 실행
    }
  };

  checkKakao();

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>;
};

export default KakaoMap;
