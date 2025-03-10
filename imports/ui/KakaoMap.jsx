import React, { useEffect, useRef, useState } from "react";

const KakaoMap = ({ center, markerText }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [loadMap, setLoadMap] = useState(false); // Lazy Loading

  // Lazy Loading: 뷰포트에 들어오면 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true);
        }
      },
      { threshold: 0.1 }
    );

    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!loadMap || !center) return;

    const initMap = () => {
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 2,
      };
      const map = new kakao.maps.Map(mapContainer, mapOption);

      const content = `
        <div class="custom-marker">
          <div class="marker-label">${markerText}</div>
          <div class="marker-tail"></div>
        </div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(center.lat, center.lng),
        content: content,
        yAnchor: 1.5,
      });

      customOverlay.setMap(map);
      setLoading(false); // 지도 로딩 완료
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=32efc2b9a0628cfab2aa0e875ac33ad4";
      script.async = true;
      script.onload = initMap;
      script.onerror = () => {
        console.error("Kakao Maps API 로드 실패");
        setLoading(false);
      };
      document.head.appendChild(script);
    }
  }, [loadMap, center, markerText]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          지도를 불러오는 중입니다...
        </div>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "100%", backgroundColor: "#f2f2f2" }}></div>
    </div>
  );
};

export default KakaoMap;
